import AsyncStorage from "@react-native-async-storage/async-storage";

const DEFAULT_API_URL = "https://challenge-java-petcenter.onrender.com";

export const API_URL = (
  process.env.EXPO_PUBLIC_API_URL?.trim() || DEFAULT_API_URL
).replace(/\/+$/, "");

const TOKEN_KEY = "PETCENTER_TOKEN";

type RequestOptions = RequestInit & {
  authenticated?: boolean;
  baseUrl?: string;
};

export class ApiHttpError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiHttpError";
    this.status = status;
  }
}

export class ApiConnectionError extends Error {
  constructor() {
    super("Não foi possível conectar à API. Verifique sua conexão e tente novamente.");
    this.name = "ApiConnectionError";
  }
}

export const getToken = async (): Promise<string | null> => {
  return AsyncStorage.getItem(TOKEN_KEY);
};

export const saveToken = async (token: string): Promise<void> => {
  await AsyncStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = async (): Promise<void> => {
  await AsyncStorage.removeItem(TOKEN_KEY);
};

const extractErrorMessage = (body: unknown, status: number): string => {
  if (typeof body === "string" && body.trim()) {
    return body.trim();
  }

  if (typeof body === "object" && body !== null) {
    if ("message" in body && typeof body.message === "string") {
      return body.message;
    }

    if ("detail" in body && typeof body.detail === "string") {
      return body.detail;
    }

    if ("error" in body && typeof body.error === "string") {
      return body.error;
    }

    if ("errors" in body && Array.isArray(body.errors)) {
      const messages = body.errors.filter(
        (error): error is string => typeof error === "string",
      );

      if (messages.length > 0) {
        return messages.join("\n");
      }
    }
  }

  return `Erro HTTP ${status}`;
};

export const request = async <T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> => {
  const {
    authenticated = true,
    baseUrl = API_URL,
    headers,
    ...fetchOptions
  } = options;

  const requestHeaders = new Headers(headers);
  requestHeaders.set("Content-Type", "application/json");
  requestHeaders.set("Accept", "application/json");

  if (authenticated) {
    const token = await getToken();

    if (token) {
      requestHeaders.set("Authorization", `Bearer ${token}`);
    }
  } else {
    requestHeaders.delete("Authorization");
  }

  let response: Response;

  try {
    response = await fetch(`${baseUrl.replace(/\/+$/, "")}${endpoint}`, {
      ...fetchOptions,
      headers: requestHeaders,
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new ApiConnectionError();
    }

    throw error;
  }

  if (!response.ok) {
    const responseText = await response.text();
    let responseBody: unknown | undefined;

    if (responseText) {
      try {
        responseBody = JSON.parse(responseText);
      } catch {
        responseBody = responseText;
      }
    }

    throw new ApiHttpError(
      extractErrorMessage(responseBody, response.status),
      response.status,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
};
