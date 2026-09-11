import { request, removeToken, saveToken } from "./api";
import type {
  ApiLoginRequest,
  ApiLoginResponse,
  ApiUserRequest,
  ApiVeterinarianRequest,
} from "../types/api";

export const login = async (data: ApiLoginRequest): Promise<string> => {
  const response = await request<ApiLoginResponse>("/api/auth/login", {
    method: "POST",
    authenticated: false,
    body: JSON.stringify(data),
  });

  await saveToken(response.token);

  return response.token;
};

export const logout = async (): Promise<void> => {
  await removeToken();
};

export const registerUser = async (data: ApiUserRequest): Promise<void> => {
  await request<void>("/api/users", {
    method: "POST",
    authenticated: false,
    body: JSON.stringify(data),
  });
};

export const createVeterinarianProfile = async (
  data: ApiVeterinarianRequest,
): Promise<void> => {
  await request<void>("/api/veterinarios", {
    method: "POST",
    body: JSON.stringify(data),
  });
};
