import { useCallback, useEffect, useState } from "react";

import {
  activateAlert as activateAlertApi,
  createAlert,
  deactivateAlert as deactivateAlertApi,
  listAlerts,
} from "../api/alerts";

import { listPets, listPetsByUser } from "../api/pets";

import { useAuth } from "../auth/AuthContext";

import type { CreateAlertData, Alerta, PetDiary } from "../types";

const useAlerts = () => {
  const { user } = useAuth();

  const [alerts, setAlerts] = useState<Alerta[]>([]);

  const [pets, setPets] = useState<PetDiary[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [loadError, setLoadError] = useState<string | undefined>();

  const loadAlerts = useCallback(
    async (showLoading = false): Promise<void> => {
      if (!user) {
        setAlerts([]);
        setPets([]);
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }

      if (showLoading) {
        setIsLoading(true);
      }

      try {
        const [apiAlerts, apiPets] = await Promise.all([
          listAlerts(),

          user.tipoUsuario === "TUTOR" ? listPetsByUser(user.id) : listPets(),
        ]);

        setAlerts(apiAlerts);

        setPets(apiPets);
        setLoadError(undefined);
      } catch (error) {
        console.error("Não foi possível carregar os alertas:", error);
        setLoadError(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os alertas.",
        );
      } finally {
        setIsLoading(false);

        setIsRefreshing(false);
      }
    },
    [user],
  );

  useEffect(() => {
    void loadAlerts(true);
  }, [loadAlerts]);

  const addAlert = useCallback(
    async (data: CreateAlertData): Promise<void> => {
      if (user?.tipoUsuario !== "VETERINARIO") {
        throw new Error("Somente veterinários podem criar alertas.");
      }

      await createAlert(data);

      await loadAlerts();
    },
    [loadAlerts, user],
  );

  const activateAlert = useCallback(
    async (id: string): Promise<void> => {
      if (user?.tipoUsuario !== "VETERINARIO") {
        throw new Error("Somente veterinários podem ativar alertas.");
      }

      await activateAlertApi(id);

      await loadAlerts();
    },
    [loadAlerts, user],
  );

  const deactivateAlert = useCallback(
    async (id: string): Promise<void> => {
      if (user?.tipoUsuario !== "VETERINARIO") {
        throw new Error("Somente veterinários podem desativar alertas.");
      }

      await deactivateAlertApi(id);

      await loadAlerts();
    },
    [loadAlerts, user],
  );

  const refresh = useCallback(async (): Promise<void> => {
    setIsRefreshing(true);

    await loadAlerts();
  }, [loadAlerts]);

  return {
    alerts,
    pets,
    isLoading,
    isRefreshing,
    loadError,
    addAlert,
    activateAlert,
    deactivateAlert,
    refresh,
  };
};

export { useAlerts };
