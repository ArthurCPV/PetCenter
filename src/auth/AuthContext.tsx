import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { ApiHttpError, getToken } from "../api/api";
import { getUserByEmail, login } from "../api/auth";

import {
  clearStoredSession,
  clearStoredSessionOnce,
  getStoredUser,
  saveStoredUser,
} from "./authStorage";

import type {
  ApiUserResponse,
} from "../types/api";

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
  createContext<
    AuthContextData | undefined
  >(undefined);

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
    useState<
      ApiUserResponse | undefined
    >(undefined);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async (): Promise<void> => {
      try {
        await clearStoredSessionOnce();

        const [storedToken, storedUser] = await Promise.all([
          getToken(),
          getStoredUser(),
        ]);

        if (!storedToken || !storedUser) {
          await clearStoredSession();
          return;
        }

        try {
          const authenticatedUser = await getUserByEmail(storedUser.email);
          await saveStoredUser(authenticatedUser);

          if (isMounted) {
            setToken(storedToken);
            setUser(authenticatedUser);
          }
        } catch (error) {
          if (
            error instanceof ApiHttpError &&
            [401, 403, 404].includes(error.status)
          ) {
            await clearStoredSession();
            return;
          }

          console.error("Não foi possível validar a sessão na API Java:", error);

          if (isMounted) {
            setToken(storedToken);
            setUser(storedUser);
          }
        }
      } catch (error) {
        console.error("Não foi possível restaurar a sessão:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const loginUser = async (
    email: string,
    password: string,
  ): Promise<void> => {
    await clearStoredSession();
    setToken(undefined);
    setUser(undefined);

    try {
      const newToken = await login({ email, senha: password });
      const authenticatedUser = await getUserByEmail(email);

      await saveStoredUser(authenticatedUser);
      setToken(newToken);
      setUser(authenticatedUser);
    } catch (error) {
      await clearStoredSession();
      setToken(undefined);
      setUser(undefined);
      throw error;
    }
  };

  const logoutUser = async (): Promise<void> => {
    try {
      await clearStoredSession();
    } finally {
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