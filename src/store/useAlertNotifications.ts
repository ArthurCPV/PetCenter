import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";

import {
  cancelAlertNotifications,
  enableAlertNotifications,
  hasAlertNotificationPermission,
  synchronizeAlertNotifications,
} from "../notifications/alertNotifications";

import type { Alerta } from "../types";

type PermissionState = {
  userId: number | undefined;
  granted: boolean;
  loaded: boolean;
};

const getScheduleSignature = (alerts: Alerta[]): string =>
  JSON.stringify(
    alerts
      .map((alert) => ({
        id: alert.id,
        petId: alert.petId,
        petNome: alert.petNome,
        titulo: alert.titulo,
        descricao: alert.descricao,
        dataInicio: alert.dataInicio,
        dataFim: alert.dataFim,
        frequenciaHoras: alert.frequenciaHoras,
        ativo: alert.ativo,
      }))
      .sort((first, second) => first.id - second.id),
  );

const useAlertNotifications = (
  userId: number | undefined,
  alerts: Alerta[],
) => {
  const [permission, setPermission] = useState<PermissionState>({
    userId,
    granted: false,
    loaded: userId === undefined,
  });
  const [error, setError] = useState<string | undefined>();
  const lastScheduleSignature = useRef<string | undefined>(undefined);

  const refreshPermission = useCallback(async (): Promise<void> => {
    if (userId === undefined) {
      setPermission({ userId, granted: false, loaded: true });
      return;
    }

    setPermission((current) => ({
      userId,
      granted: current.userId === userId && current.granted,
      loaded: false,
    }));

    const granted = await hasAlertNotificationPermission();
    setPermission({ userId, granted, loaded: true });
  }, [userId]);

  useEffect(() => {
    let isMounted = true;

    const checkPermission = (): void => {
      void refreshPermission().catch((permissionError: unknown) => {
        if (!isMounted) {
          return;
        }

        setError(
          permissionError instanceof Error
            ? permissionError.message
            : "Não foi possível verificar a permissão de notificações.",
        );
        setPermission({ userId, granted: false, loaded: true });
      });
    };

    checkPermission();

    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        checkPermission();
      }
    });

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, [refreshPermission, userId]);

  useEffect(() => {
    if (userId === undefined) {
      lastScheduleSignature.current = undefined;
      return;
    }

    return () => {
      void cancelAlertNotifications(userId).catch((cancelError: unknown) => {
        console.error("Não foi possível cancelar lembretes da sessão:", cancelError);
      });
    };
  }, [userId]);

  const scheduleAlerts = useCallback(async (): Promise<void> => {
    if (userId === undefined) {
      return;
    }

    const signature = getScheduleSignature(alerts);

    if (lastScheduleSignature.current === signature) {
      return;
    }

    await synchronizeAlertNotifications(userId, alerts);
    lastScheduleSignature.current = signature;
    setError(undefined);
  }, [alerts, userId]);

  useEffect(() => {
    if (
      userId === undefined ||
      permission.userId !== userId ||
      !permission.loaded
    ) {
      return;
    }

    if (!permission.granted) {
      lastScheduleSignature.current = undefined;
      void cancelAlertNotifications(userId).catch((cancelError: unknown) => {
        setError(
          cancelError instanceof Error
            ? cancelError.message
            : "Não foi possível cancelar os lembretes.",
        );
      });
      return;
    }

    void scheduleAlerts().catch((scheduleError: unknown) => {
      setError(
        scheduleError instanceof Error
          ? scheduleError.message
          : "Não foi possível atualizar os lembretes.",
      );
      console.error("Não foi possível atualizar os lembretes:", scheduleError);
    });
  }, [permission, scheduleAlerts, userId]);

  const enable = useCallback(async (): Promise<void> => {
    if (userId === undefined) {
      throw new Error("Faça login para ativar os lembretes.");
    }

    lastScheduleSignature.current = undefined;

    try {
      await enableAlertNotifications(userId, alerts);
      lastScheduleSignature.current = getScheduleSignature(alerts);
      setPermission({ userId, granted: true, loaded: true });
      setError(undefined);
    } catch (enableError) {
      try {
        const granted = await hasAlertNotificationPermission();
        setPermission({ userId, granted, loaded: true });
      } catch (permissionError: unknown) {
        console.error(
          "Não foi possível confirmar a permissão após solicitar notificações:",
          permissionError,
        );
        setPermission({ userId, granted: false, loaded: true });
      }

      throw enableError;
    }
  }, [alerts, userId]);

  return {
    hasPermission:
      permission.userId === userId &&
      permission.loaded &&
      permission.granted,
    isLoading:
      !permission.loaded ||
      permission.userId !== userId,
    error,
    enable,
  };
};

export { useAlertNotifications };
