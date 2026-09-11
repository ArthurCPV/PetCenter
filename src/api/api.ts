import AsyncStorage from "@react-native-async-storage/async-storage";

export const API_URL = "https://COLE-AQUI-A-URL-DO-RENDER.onrender.com";

const TOKEN_KEY = "PETCENTER_TOKEN";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  authenticated?: boolean;
};

export const request = async <T>(
  path: string,
  { method = "GET", body, authenticated = true }: RequestOptions = {},
): Promise<T> => {
  const token = authenticated ? await AsyncStorage.getItem(TOKEN_KEY) : null;

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Erro HTTP ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();

  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
};

export { TOKEN_KEY };
