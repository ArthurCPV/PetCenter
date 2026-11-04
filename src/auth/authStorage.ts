import AsyncStorage from "@react-native-async-storage/async-storage";

import { removeToken } from "../api/api";

import type { ApiUserResponse } from "../types/api";

const USER_KEY = "PETCENTER_USER";
const SESSION_RESET_KEY = "PETCENTER_SESSION_RESET_V1";

export const saveStoredUser = async (user: ApiUserResponse): Promise<void> => {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getStoredUser = async (): Promise<ApiUserResponse | undefined> => {
  const data = await AsyncStorage.getItem(USER_KEY);

  if (!data) {
    return undefined;
  }

  try {
    const parsed: unknown = JSON.parse(data);

    if (typeof parsed !== "object" || parsed === null) {
      return undefined;
    }

    const user = parsed as Record<string, unknown>;

    if (
      typeof user.id !== "number" ||
      typeof user.nome !== "string" ||
      typeof user.email !== "string" ||
      typeof user.tipoUsuario !== "string"
    ) {
      return undefined;
    }

    if (user.tipoUsuario !== "TUTOR" && user.tipoUsuario !== "VETERINARIO") {
      return undefined;
    }

    return parsed as ApiUserResponse;
  } catch {
    return undefined;
  }
};

export const clearStoredSession = async (): Promise<void> => {
  await Promise.all([removeToken(), AsyncStorage.removeItem(USER_KEY)]);
};

export const clearStoredSessionOnce = async (): Promise<void> => {
  const hasResetSession = await AsyncStorage.getItem(SESSION_RESET_KEY);

  if (hasResetSession === "true") {
    return;
  }

  await clearStoredSession();
  await AsyncStorage.setItem(SESSION_RESET_KEY, "true");
};
