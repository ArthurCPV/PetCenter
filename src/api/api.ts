import AsyncStorage from "@react-native-async-storage/async-storage";

export const API_URL = "https://challenge-java-petcenter.onrender.com";

const TOKEN_KEY = "PETCENTER_TOKEN";

type RequestOptions = RequestInit & {
  authenticated?: boolean;
};

export class ApiHttpError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiHttpError";
    this.status = status;
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
  const { authenticated = true, headers, ...fetchOptions } = options;

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

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers: requestHeaders,
  });

  if (!response.ok) {
    let responseBody: unknown | undefined;

    try {
      responseBody = await response.json();
    } catch {
      responseBody = undefined;
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
