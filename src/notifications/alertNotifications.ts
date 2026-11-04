import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import type { Alerta } from "../types";

const ALERTS_CHANNEL_ID = "petcenter-alerts";
const NOTIFICATION_SOURCE = "petcenter-alert";
const ONE_TIME_ALERTS_STORAGE_KEY = "PETCENTER_ONE_TIME_ALERT_SCHEDULES";

const ensureNotificationsSupported = (): void => {
  if (Platform.OS === "web") {
    throw new Error(
      "Notificações locais estão disponíveis no aplicativo Android ou iOS.",
    );
  }
};

export const hasAlertNotificationPermission = async (): Promise<boolean> => {
  if (Platform.OS === "web") {
    return false;
  }

  const permission = await Notifications.getPermissionsAsync();
  return permission.granted;
};

const configureNotificationChannel = async (): Promise<void> => {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(ALERTS_CHANNEL_ID, {
      name: "Lembretes dos pets",
      description: "Lembretes definidos nos alertas veterinários",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#E53935",
    });
  }
};

export const requestAlertNotificationPermission = async (): Promise<void> => {
  ensureNotificationsSupported();
  await configureNotificationChannel();

  const currentPermission = await Notifications.getPermissionsAsync();
  const permission = currentPermission.granted
    ? currentPermission
    : await Notifications.requestPermissionsAsync();

  if (!permission.granted) {
    throw new Error(
      "Permita as notificações nas configurações do dispositivo para receber os lembretes.",
    );
  }
};

const isManagedAlertNotification = (
  notification: Notifications.NotificationRequest,
  userId: number,
): boolean => {
  const data = notification.content.data;

  return data.source === NOTIFICATION_SOURCE && data.userId === userId;
};

const getScheduledAlertIdentifier = (userId: number, alertId: number): string =>
  `${NOTIFICATION_SOURCE}:${userId}:${alertId}`;

const getAlertScheduleSignature = (alert: Alerta): string =>
  JSON.stringify({
    petId: alert.petId,
    petNome: alert.petNome,
    titulo: alert.titulo,
    descricao: alert.descricao,
    dataInicio: alert.dataInicio,
    dataFim: alert.dataFim,
    frequenciaHoras: alert.frequenciaHoras,
    ativo: alert.ativo,
  });

const getOneTimeAlertSchedules = async (
  userId: number,
): Promise<Record<string, string>> => {
  const storedSchedules = await AsyncStorage.getItem(
    `${ONE_TIME_ALERTS_STORAGE_KEY}:${userId}`,
  );

  if (!storedSchedules) {
    return {};
  }

  const parsed: unknown = JSON.parse(storedSchedules);

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    Object.values(parsed).some((signature) => typeof signature !== "string")
  ) {
    throw new Error("O estado local dos lembretes está inválido.");
  }

  return parsed as Record<string, string>;
};

const saveOneTimeAlertSchedules = async (
  userId: number,
  schedules: Record<string, string>,
): Promise<void> => {
  await AsyncStorage.setItem(
    `${ONE_TIME_ALERTS_STORAGE_KEY}:${userId}`,
    JSON.stringify(schedules),
  );
};

export const cancelAlertNotifications = async (
  userId: number,
): Promise<void> => {
  if (Platform.OS === "web") {
    return;
  }

  const scheduledNotifications =
    await Notifications.getAllScheduledNotificationsAsync();

  await Promise.all(
    scheduledNotifications
      .filter((notification) =>
        isManagedAlertNotification(notification, userId),
      )
      .map((notification) =>
        Notifications.cancelScheduledNotificationAsync(
          notification.identifier,
        ),
      ),
  );

  await AsyncStorage.removeItem(
    `${ONE_TIME_ALERTS_STORAGE_KEY}:${userId}`,
  );
};

export const synchronizeAlertNotifications = async (
  userId: number,
  alerts: Alerta[],
): Promise<void> => {
  if (Platform.OS === "web") {
    return;
  }

  const activeAlerts = alerts.filter((alert) => alert.ativo);

  if (activeAlerts.length === 0) {
    await cancelAlertNotifications(userId);
    await saveOneTimeAlertSchedules(userId, {});
    return;
  }

  await configureNotificationChannel();

  const permission = await Notifications.getPermissionsAsync();

  if (!permission.granted) {
    throw new Error(
      "Permita as notificações nas configurações do dispositivo para receber os lembretes.",
    );
  }

  try {
    const scheduledNotifications =
      await Notifications.getAllScheduledNotificationsAsync();
    const existingByIdentifier = new Map(
      scheduledNotifications
        .filter((notification) =>
          isManagedAlertNotification(notification, userId),
        )
        .map((notification) => [notification.identifier, notification]),
    );
    const expectedSignatures = new Map<string, string>();
    const oneTimeSchedules = await getOneTimeAlertSchedules(userId);
    const alertsById = new Map(alerts.map((alert) => [String(alert.id), alert]));

    for (const alertId of Object.keys(oneTimeSchedules)) {
      if (!alertsById.get(alertId)?.ativo) {
        delete oneTimeSchedules[alertId];
      }
    }

    for (const alert of activeAlerts) {
      const frequencyHours = alert.frequenciaHoras;
      const startDate = new Date(alert.dataInicio);
      const identifier = getScheduledAlertIdentifier(userId, alert.id);
      const repeats =
        Number.isInteger(frequencyHours) && Number(frequencyHours) > 0;

      if (Number.isNaN(startDate.getTime())) {
        throw new Error(
          `A data de início do alerta "${alert.titulo}" é inválida.`,
        );
      }

      const endDate = alert.dataFim ? new Date(alert.dataFim) : undefined;

      if (endDate && Number.isNaN(endDate.getTime())) {
        throw new Error(
          `A data de término do alerta "${alert.titulo}" é inválida.`,
        );
      }

      if (endDate && endDate.getTime() <= Date.now()) {
        continue;
      }

      const signature = getAlertScheduleSignature(alert);
      expectedSignatures.set(identifier, signature);

      const existingNotification = existingByIdentifier.get(identifier);

      if (
        !repeats &&
        oneTimeSchedules[String(alert.id)] === signature
      ) {
        if (
          existingNotification &&
          existingNotification.content.data.scheduleSignature !== signature
        ) {
          await Notifications.cancelScheduledNotificationAsync(identifier);
        }
        continue;
      }

      if (
        existingNotification?.content.data.scheduleSignature === signature
      ) {
        continue;
      }

      if (existingNotification) {
        await Notifications.cancelScheduledNotificationAsync(identifier);
      }

      const trigger: Notifications.NotificationTriggerInput = repeats
        ? {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: Number(frequencyHours) * 60 * 60,
            repeats: true,
            ...(Platform.OS === "android"
              ? { channelId: ALERTS_CHANNEL_ID }
              : {}),
          }
        : startDate.getTime() > Date.now()
          ? {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date: startDate,
              ...(Platform.OS === "android"
                ? { channelId: ALERTS_CHANNEL_ID }
                : {}),
            }
          : null;

      const description = alert.descricao?.trim();

      await Notifications.scheduleNotificationAsync({
        identifier,
        content: {
          title: `Lembrete para ${alert.petNome}`,
          body: description
            ? `${alert.titulo} · ${description}`
            : alert.titulo,
          sound: true,
          data: {
            source: NOTIFICATION_SOURCE,
            userId,
            alertId: alert.id,
            petId: alert.petId,
            scheduleSignature: signature,
          },
        },
        trigger,
      });

      if (repeats) {
        delete oneTimeSchedules[String(alert.id)];
      } else {
        oneTimeSchedules[String(alert.id)] = signature;
      }
    }

    await saveOneTimeAlertSchedules(userId, oneTimeSchedules);

    await Promise.all(
      [...existingByIdentifier.keys()]
        .filter((identifier) => !expectedSignatures.has(identifier))
        .map((identifier) =>
          Notifications.cancelScheduledNotificationAsync(identifier),
        ),
    );
  } catch (error) {
    await cancelAlertNotifications(userId);
    throw error;
  }
};

export const enableAlertNotifications = async (
  userId: number,
  alerts: Alerta[],
): Promise<void> => {
  await requestAlertNotificationPermission();
  await synchronizeAlertNotifications(userId, alerts);
};

export const sendAlertNotificationNow = async (
  userId: number,
  alert: Alerta,
): Promise<void> => {
  await requestAlertNotificationPermission();

  const description = alert.descricao?.trim();

  await Notifications.scheduleNotificationAsync({
    identifier: `${NOTIFICATION_SOURCE}:${userId}:${alert.id}:manual:${Date.now()}`,
    content: {
      title: `Lembrete para ${alert.petNome}`,
      body: description
        ? `${alert.titulo} · ${description}`
        : alert.titulo,
      sound: true,
      ...(Platform.OS === "android" ? { channelId: ALERTS_CHANNEL_ID } : {}),
      data: {
        source: NOTIFICATION_SOURCE,
        userId,
        alertId: alert.id,
        petId: alert.petId,
      },
    },
    trigger: null,
  });
};
