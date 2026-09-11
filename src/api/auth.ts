import AsyncStorage from "@react-native-async-storage/async-storage";

import { request, TOKEN_KEY } from "./api";
import type { LoginRequest, LoginResponse } from "../types/api";

export const login = async (
  credentials: LoginRequest,
): Promise<LoginResponse> => {
  const response = await request<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: credentials,
    authenticated: false,
  });

  await AsyncStorage.setItem(TOKEN_KEY, response.token);

  return response;
};

export const logout = async (): Promise<void> => {
  await AsyncStorage.removeItem(TOKEN_KEY);
};

export const getToken = async (): Promise<string | null> => {
  return AsyncStorage.getItem(TOKEN_KEY);
};
