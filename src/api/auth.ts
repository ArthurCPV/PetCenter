import { ApiHttpError, request, removeToken, saveToken } from "./api";

import type {
  ApiLoginRequest,
  ApiLoginResponse,
  ApiUserRequest,
  ApiUserResponse,
  ApiVeterinarianRequest,
} from "../types/api";

export const login = async (data: ApiLoginRequest): Promise<string> => {
  try {
    const response = await request<ApiLoginResponse>("/api/auth/login", {
      method: "POST",
      authenticated: false,
      body: JSON.stringify(data),
    });

    await saveToken(response.token);

    return response.token;
  } catch (error) {
    if (
      error instanceof ApiHttpError &&
      (error.status === 401 || error.status === 403)
    ) {
      throw new ApiHttpError(
        "Usuário não encontrado ou senha incorreta.",
        error.status,
      );
    }

    throw error;
  }
};

export const getUserByEmail = async (
  email: string,
): Promise<ApiUserResponse> => {
  return request<ApiUserResponse>(
    `/api/users/email/${encodeURIComponent(email)}`,
  );
};

export const logout = async (): Promise<void> => {
  await removeToken();
};

export const registerUser = async (data: ApiUserRequest): Promise<void> => {
  try {
    await request<void>("/api/users", {
      method: "POST",
      authenticated: false,
      body: JSON.stringify(data),
    });
  } catch (error) {
    if (error instanceof ApiHttpError && error.status === 409) {
      throw new ApiHttpError("Este e-mail já está cadastrado.", error.status);
    }

    throw error;
  }
};

export const deleteUserAccount = async (id: number): Promise<void> => {
  await request<void>(`/api/users/${id}`, {
    method: "DELETE",
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
