import { useCallback, useRef, useState } from "react";

import { askAssistant } from "../api/assistant";
import { ApiConnectionError, ApiHttpError } from "../api/api";

export type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

const getRequestErrorMessage = (error: unknown): string => {
  if (error instanceof ApiConnectionError) {
    return "Não foi possível conectar ao assistente. Verifique sua conexão e tente novamente.";
  }

  if (error instanceof ApiHttpError) {
    if (error.status === 400) {
      return error.message;
    }

    if (error.status === 422) {
      return "A API não aceitou a pergunta. Verifique o texto e tente novamente.";
    }

    if (error.status === 500) {
      return "O servidor recebeu a pergunta, mas não conseguiu processá-la. A equipe precisa verificar a configuração do Gemini e o acesso aos dados do IoT.";
    }

    if ([502, 503, 504].includes(error.status)) {
      return "O assistente está temporariamente indisponível. Tente novamente em alguns instantes.";
    }

    return `Não foi possível obter uma resposta do assistente (HTTP ${error.status}).`;
  }

  return error instanceof Error
    ? error.message
    : "Ocorreu um erro inesperado ao consultar o assistente.";
};

const useAssistant = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Olá! Posso ajudar com os dados de alimentação e hidratação do monitor IoT.",
    },
  ]);
  const [input, setInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const nextMessageId = useRef(0);
  const clearError = useCallback(() => setErrorMessage(""), []);

  const sendMessage = useCallback(
    async (text = input): Promise<void> => {
      const message = text.trim();

      if (!message || isSending) {
        return;
      }

      const userMessage: ChatMessage = {
        id: `user-${nextMessageId.current++}`,
        role: "user",
        text: message,
      };

      setMessages((current) => [...current, userMessage]);
      setInput("");
      setErrorMessage("");
      setIsSending(true);

      try {
        const response = await askAssistant(message);

        setMessages((current) => [
          ...current,
          {
            id: `assistant-${nextMessageId.current++}`,
            role: "assistant",
            text: response,
          },
        ]);
      } catch (error) {
        setInput(message);
        setErrorMessage(getRequestErrorMessage(error));
      } finally {
        setIsSending(false);
      }
    },
    [input, isSending],
  );

  return {
    messages,
    input,
    setInput,
    errorMessage,
    isSending,
    sendMessage,
    clearError,
  };
};

export { useAssistant };
