import { useCallback } from "react";

import {
  createVeterinarianProfile,
  deleteUserAccount,
  login,
  logout,
  registerUser,
} from "../api/auth";
import type { ApiUserRequest, ApiVeterinarianRequest } from "../types/api";

type RegistrationData = {
  user: ApiUserRequest;
  veterinarian?: ApiVeterinarianRequest;
};

const registerAccount = async (data: RegistrationData): Promise<void> => {
  let currentStep = "criar o usuário na API Java";
  let createdUserId: number | undefined;

  try {
    const createdUser = await registerUser(data.user);
    createdUserId = createdUser.id;

    if (data.user.tipoUsuario === "VETERINARIO") {
      if (!data.veterinarian) {
        throw new Error("Informe os dados profissionais do veterinário.");
      }

      currentStep = "autenticar o usuário na API Java";
      await login({ email: data.user.email, senha: data.user.senha });

      currentStep = "criar o perfil de veterinário na API Java";
      await createVeterinarianProfile(data.veterinarian);
    }

    await logout();
  } catch (error) {
    if (createdUserId !== undefined) {
      try {
        await login({ email: data.user.email, senha: data.user.senha });
        await deleteUserAccount(createdUserId);
      } catch (cleanupError) {
        console.error(
          "Não foi possível remover a conta criada parcialmente:",
          cleanupError,
        );
      }
    }

    try {
      await logout();
    } catch (logoutError) {
      console.error(
        "Não foi possível limpar o token após o cadastro:",
        logoutError,
      );
    }

    const errorMessage =
      error instanceof Error ? error.message : "Não foi possível criar a conta.";

    throw new Error(`Falha ao ${currentStep}: ${errorMessage}`);
  }
};

const useRegistration = () => ({
  register: useCallback(registerAccount, []),
});

export { useRegistration };
