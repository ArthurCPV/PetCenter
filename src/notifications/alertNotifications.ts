import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import type { Alerta } from "../types";

const ALERTS_CHANNEL_ID = "petcenter-alerts";
const NOTIFICATION_SOURCE = "petcenter-alert";

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
};

export const synchronizeAlertNotifications = async (
  userId: number,
  alerts: Alerta[],
): Promise<void> => {
  if (Platform.OS === "web") {
    return;
  }

  const activeAlerts = alerts.filter((alert) => alert.ativo);
  await cancelAlertNotifications(userId);

  if (activeAlerts.length === 0) {
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
    for (const alert of activeAlerts) {
      const frequencyHours = alert.frequenciaHoras;
      const startDate = new Date(alert.dataInicio);

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

      const repeats =
        Number.isInteger(frequencyHours) && Number(frequencyHours) > 0;
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
        identifier: `${NOTIFICATION_SOURCE}:${userId}:${alert.id}`,
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
          },
        },
        trigger,
      });
    }
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
