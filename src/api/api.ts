import AsyncStorage from "@react-native-async-storage/async-storage";

export const API_URL = "https://COLE-AQUI-A-URL-DO-RENDER.onrender.com";

const TOKEN_KEY = "PETCENTER_TOKEN";

type RequestOptions = RequestInit & {
  authenticated?: boolean;
};

export const getToken = async (): Promise<string | null> => {
  return AsyncStorage.getItem(TOKEN_KEY);
};

export const saveToken = async (token: string): Promise<void> => {
  await AsyncStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = async (): Promise<void> => {
  await AsyncStorage.removeItem(TOKEN_KEY);
};

export const request = async <T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> => {
  const { authenticated = true, headers, ...fetchOptions } = options;
  const requestHeaders = new Headers(headers);

  requestHeaders.set("Content-Type", "application/json");
  requestHeaders.set("Accept", "application/json");

  if (authenticated) {
    const token = await getToken();

    if (token) {
      requestHeaders.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers: requestHeaders,
  });

  if (!response.ok) {
    let message = `Erro HTTP ${response.status}`;

    try {
      const body: unknown = await response.json();

      if (
        typeof body === "object" &&
        body !== null &&
        "message" in body &&
        typeof body.message === "string"
      ) {
        message = body.message;
      }
    } catch {
      // Resposta sem JSON.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
};
