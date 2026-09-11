import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { login, logout } from "../api/auth";
import { getToken } from "../api/api";

export type UserRole = "TUTOR" | "VETERINARIO";

type AuthContextData = {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  loginUser: (email: string, password: string) => Promise<void>;
  logoutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextData | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedToken = await getToken();
        setToken(storedToken);
      } finally {
        setIsLoading(false);
      }
    };

    void loadSession();
  }, []);

  const loginUser = async (email: string, password: string) => {
    const newToken = await login({
      email,
      senha: password,
    });

    setToken(newToken);
  };

  const logoutUser = async () => {
    await logout();
    setToken(null);
  };

  const value = useMemo(
    () => ({
      isAuthenticated: token !== null,
      isLoading,
      token,
      loginUser,
      logoutUser,
    }),
    [isLoading, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  }

  return context;
};
