import { request } from "./api";

const DEFAULT_ASSISTANT_API_URL = "https://challenger-iot.onrender.com";

export const ASSISTANT_API_URL = (
  process.env.EXPO_PUBLIC_AI_API_URL?.trim() ||
  DEFAULT_ASSISTANT_API_URL
).replace(/\/+$/, "");

type ChatResponse = {
  response: string;
};

export const askAssistant = async (message: string): Promise<string> => {
  const result = await request<ChatResponse>("/chat", {
    method: "POST",
    authenticated: false,
    baseUrl: ASSISTANT_API_URL,
    body: JSON.stringify({ message }),
  });

  if (typeof result.response !== "string" || !result.response.trim()) {
    throw new Error("O assistente retornou uma resposta vazia ou inválida.");
  }

  return result.response.trim();
};
