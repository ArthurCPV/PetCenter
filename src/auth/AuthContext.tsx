import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  getUserByEmail,
  login,
  logout,
} from "../api/auth";

import {
  getToken,
} from "../api/api";

import {
  loginFirebaseUser,
  logoutFirebaseUser,
} from "../api/firebaseAuth";

import {
  clearStoredSession,
  getStoredUser,
  saveStoredUser,
} from "./authStorage";

import { auth } from "../../firebaseConfig";

import {
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";

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

  runAuthOperation: <T>(
    operation: () => Promise<T>,
  ) => Promise<T>;
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

  /*
   * Controla operações explícitas de autenticação.
   *
   * Enquanto este contador for maior que zero,
   * o onAuthStateChanged não interfere no fluxo.
   *
   * O contador permite operações aninhadas sem
   * perder o controle do estado.
   */
  const authOperationDepth =
    useRef(0);

  const runAuthOperation = async <T,>(
    operation: () => Promise<T>,
  ): Promise<T> => {
    authOperationDepth.current += 1;

    try {
      return await operation();
    } finally {
      authOperationDepth.current -= 1;
    }
  };

  useEffect(() => {
    const validateJavaSession =
      async (
        firebaseUser: FirebaseUser,
      ): Promise<void> => {
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

          await logoutFirebaseUser();

          return;
        }

        try {
          /*
           * Firebase confirmou a sessão.
           *
           * Agora validamos também o usuário
           * no backend Java.
           */
          const authenticatedUser =
            await getUserByEmail(
              firebaseUser.email ??
              storedUser.email,
            );

          setToken(storedToken);
          setUser(authenticatedUser);
        } catch (error) {
          console.error(
            "Não foi possível validar a sessão Java:",
            error,
          );

          await clearStoredSession();

          setToken(undefined);
          setUser(undefined);

          await logoutFirebaseUser();
        }
      };

    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (firebaseUser) => {
          /*
           * Login/cadastro explícito já está
           * controlando a sessão.
           *
           * O listener não deve interferir.
           */
          if (
            authOperationDepth.current > 0
          ) {
            return;
          }

          setIsLoading(true);

          try {
            if (!firebaseUser) {
              await clearStoredSession();

              setToken(undefined);
              setUser(undefined);

              return;
            }

            await validateJavaSession(
              firebaseUser,
            );
          } catch (error) {
            console.error(
              "Erro ao carregar sessão:",
              error,
            );

            await clearStoredSession();

            setToken(undefined);
            setUser(undefined);

            try {
              await logoutFirebaseUser();
            } catch {
              // Mantém o estado desconectado.
            }
          } finally {
            setIsLoading(false);
          }
        },
      );

    return unsubscribe;
  }, []);

  const loginUser = async (
    email: string,
    password: string,
  ): Promise<void> => {
    await runAuthOperation(
      async (): Promise<void> => {
        /*
         * Remove qualquer sessão Java anterior.
         */
        await clearStoredSession();

        setToken(undefined);
        setUser(undefined);

        /*
         * Verifica se já existe uma sessão Firebase
         * do mesmo usuário.
         *
         * Se existir outro usuário, encerramos a
         * sessão antes de fazer o novo login.
         */
        const currentFirebaseUser =
          auth.currentUser;

        if (
          !currentFirebaseUser ||
          currentFirebaseUser.email !== email
        ) {
          try {
            await logoutFirebaseUser();
          } catch {
            // Não havia outra sessão ativa.
          }

          await loginFirebaseUser(
            email,
            password,
          );
        }

        try {
          /*
           * Agora autenticamos no Spring.
           */
          const newToken =
            await login({
              email,
              senha: password,
            });

          const authenticatedUser =
            await getUserByEmail(email);

          await saveStoredUser(
            authenticatedUser,
          );

          setToken(newToken);
          setUser(authenticatedUser);
        } catch (error) {
          /*
           * Firebase autenticou, mas o Java não.
           *
           * Não deixamos uma sessão parcial.
           */
          await clearStoredSession();

          setToken(undefined);
          setUser(undefined);

          try {
            await logoutFirebaseUser();
          } catch {
            // Mantém o erro original.
          }

          throw error;
        }
      },
    );
  };

  const logoutUser =
    async (): Promise<void> => {
      await runAuthOperation(
        async (): Promise<void> => {
          try {
            await logoutFirebaseUser();
          } finally {
            await logout();
            await clearStoredSession();

            setToken(undefined);
            setUser(undefined);
          }
        },
      );
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

      runAuthOperation,
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