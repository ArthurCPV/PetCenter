import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  getUserByEmail,
  login,
  logout,
} from "../api/auth";

import { getToken } from "../api/api";

import {
  clearStoredSession,
  getStoredUser,
  saveStoredUser,
} from "./authStorage";

import type { ApiUserResponse } from "../types/api";

export type UserRole =
  | "TUTOR"
  | "VETERINARIO";

type AuthContextData = {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | undefined;
  user: ApiUserResponse | undefined;

  loginUser: (
    email: string,
    password: string,
  ) => Promise<void>;

  logoutUser: () => Promise<void>;
};

const AuthContext =
  createContext<AuthContextData | undefined>(
    undefined,
  );

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({
  children,
}: Props) => {
  const [token, setToken] =
    useState<string | undefined>(
      undefined,
    );

  const [user, setUser] =
    useState<ApiUserResponse | undefined>(
      undefined,
    );

  const [isLoading, setIsLoading] =
    useState(true);

  /*
   * Carrega a sessão existente.
   *
   * Não confiamos somente no AsyncStorage:
   * se existir token e usuário salvos,
   * fazemos uma requisição autenticada para
   * confirmar que aquela sessão ainda é válida.
   */
  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedToken =
          await getToken();

        const storedUser =
          await getStoredUser();

        if (
          !storedToken ||
          !storedUser
        ) {
          await clearStoredSession();

          setToken(undefined);
          setUser(undefined);

          return;
        }

        try {
          /*
           * getUserByEmail usa o token salvo
           * automaticamente através de request().
           *
           * Assim verificamos se o token realmente
           * continua válido para o usuário armazenado.
           */
          const authenticatedUser =
            await getUserByEmail(
              storedUser.email,
            );

          setToken(storedToken);
          setUser(authenticatedUser);
        } catch (error) {
          console.error(
            "Sessão armazenada inválida:",
            error,
          );

          await clearStoredSession();

          setToken(undefined);
          setUser(undefined);
        }
      } catch (error) {
        console.error(
          "Erro ao carregar sessão:",
          error,
        );

        await clearStoredSession();

        setToken(undefined);
        setUser(undefined);
      } finally {
        setIsLoading(false);
      }
    };

    void loadSession();
  }, []);

  /*
   * Realiza login.
   *
   * Antes de começar, remove qualquer sessão
   * anterior para evitar conflito entre contas.
   */
  const loginUser = async (
    email: string,
    password: string,
  ): Promise<void> => {
    await clearStoredSession();

    setToken(undefined);
    setUser(undefined);

    const newToken = await login({
      email,
      senha: password,
    });

    try {
      /*
       * O login já salvou o novo token.
       *
       * Agora buscamos os dados reais do usuário
       * usando exatamente essa nova sessão.
       */
      const authenticatedUser =
        await getUserByEmail(email);

      await saveStoredUser(
        authenticatedUser,
      );

      setToken(newToken);
      setUser(authenticatedUser);
    } catch (error) {
      /*
       * Se conseguimos fazer login mas não
       * conseguimos carregar o usuário, a sessão
       * não deve permanecer parcialmente salva.
       */
      await clearStoredSession();

      setToken(undefined);
      setUser(undefined);

      throw error;
    }
  };

  /*
   * Encerra completamente a sessão atual.
   */
  const logoutUser = async (): Promise<void> => {
    try {
      await logout();
    } finally {
      /*
       * Mesmo que algo dê errado na chamada
       * anterior, a sessão local precisa ser limpa.
       */
      await clearStoredSession();

      setToken(undefined);
      setUser(undefined);
    }
  };

  const value = useMemo(
    () => ({
      isAuthenticated:
        token !== undefined &&
        user !== undefined,

      isLoading,

      token,

      user,

      loginUser,

      logoutUser,
    }),
    [
      isLoading,
      token,
      user,
    ],
  );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth =
  (): AuthContextData => {
    const context =
      useContext(AuthContext);

    if (!context) {
      throw new Error(
        "useAuth deve ser usado dentro de AuthProvider.",
      );
    }

    return context;
  };