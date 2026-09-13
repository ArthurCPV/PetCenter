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
      await createAlert(data);

      await loadAlerts();
    },
    [loadAlerts],
  );

  const activateAlert = useCallback(
    async (id: string): Promise<void> => {
      await activateAlertApi(id);

      await loadAlerts();
    },
    [loadAlerts],
  );

  const deactivateAlert = useCallback(
    async (id: string): Promise<void> => {
      await deactivateAlertApi(id);

      await loadAlerts();
    },
    [loadAlerts],
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
    addAlert,
    activateAlert,
    deactivateAlert,
    refresh,
  };
};

export { useAlerts };
