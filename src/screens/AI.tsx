import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
  type ListRenderItem,
} from "react-native";

import { askAssistant } from "../api/assistant";
import { ApiConnectionError, ApiHttpError } from "../api/api";
import { colors, styles_th } from "../styles/theme";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

const suggestedQuestions = [
  "Quantas vezes meu pet comeu hoje?",
  "Que horas ele bebeu água?",
  "Ele comeu mais ontem ou hoje?",
];

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

    if (error.status === 502 || error.status === 503 || error.status === 504) {
      return "O assistente está temporariamente indisponível. Tente novamente em alguns instantes.";
    }

    return `Não foi possível obter uma resposta do assistente (HTTP ${error.status}).`;
  }

  return error instanceof Error
    ? error.message
    : "Ocorreu um erro inesperado ao consultar o assistente.";
};

const AI = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Olá! Sou o assistente CLYVO VET. Posso consultar os dados de alimentação e hidratação registrados pelo sistema IoT. O que você gostaria de saber?",
    },
  ]);
  const [input, setInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const listRef = useRef<FlatList<ChatMessage>>(null);
  const nextMessageId = useRef(0);

  useEffect(() => {
    listRef.current?.scrollToEnd({ animated: true });
  }, [messages, isSending]);

  const sendMessage = async (text = input): Promise<void> => {
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
  };

  const renderMessage: ListRenderItem<ChatMessage> = ({ item }) => {
    const isUser = item.role === "user";

    return (
      <View
        style={{
          alignSelf: isUser ? "flex-end" : "flex-start",
          maxWidth: "88%",
          marginBottom: 12,
          paddingHorizontal: 15,
          paddingVertical: 11,
          borderRadius: 18,
          backgroundColor: isUser ? colors.primary : colors.card,
          borderWidth: isUser ? 0 : 1,
          borderColor: colors.border,
        }}
      >
        <Text
          style={{
            color: isUser ? "#FFFFFF" : colors.text,
            fontSize: 15,
            lineHeight: 22,
          }}
        >
          {item.text}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles_th.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
    >
      <View style={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 12 }}>
        <Text style={styles_th.title}>Assistente CLYVO VET</Text>
        <Text style={styles_th.subtitle}>
          Pergunte sobre os dados reais de alimentação e hidratação do IoT.
        </Text>
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "flex-end",
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
        onContentSizeChange={() =>
          listRef.current?.scrollToEnd({ animated: true })
        }
        keyboardShouldPersistTaps="handled"
        ListFooterComponent={
          isSending ? (
            <View
              style={{
                alignSelf: "flex-start",
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
                padding: 14,
                borderRadius: 18,
                backgroundColor: colors.card,
              }}
            >
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={{ color: "#666" }}>Consultando os dados...</Text>
            </View>
          ) : null
        }
      />

      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 12,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.background,
        }}
      >
        {errorMessage ? (
          <Text
            accessibilityRole="alert"
            style={{
              marginBottom: 10,
              color: "#B71C1C",
              lineHeight: 20,
            }}
          >
            {errorMessage}
          </Text>
        ) : null}

        {messages.length === 1 ? (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 10,
            }}
          >
            {suggestedQuestions.map((question) => (
              <Pressable
                key={question}
                accessibilityRole="button"
                disabled={isSending}
                onPress={() => void sendMessage(question)}
                style={{
                  paddingHorizontal: 11,
                  paddingVertical: 8,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: colors.card,
                  opacity: isSending ? 0.6 : 1,
                }}
              >
                <Text style={{ color: colors.text, fontSize: 13 }}>
                  {question}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : null}

        <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 8 }}>
          <TextInput
            accessibilityLabel="Pergunta para o assistente"
            multiline
            maxLength={1000}
            editable={!isSending}
            value={input}
            onChangeText={(value) => {
              setInput(value);
              if (errorMessage) {
                setErrorMessage("");
              }
            }}
            onSubmitEditing={() => void sendMessage()}
            placeholder="Digite sua pergunta..."
            placeholderTextColor="#888"
            returnKeyType="send"
            style={[
              styles_th.input,
              {
                minHeight: 48,
                maxHeight: 120,
                flex: 1,
                paddingVertical: 12,
                backgroundColor: colors.card,
              },
            ]}
          />

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Enviar pergunta"
            disabled={!input.trim() || isSending}
            onPress={() => void sendMessage()}
            style={[
              styles_th.button,
              {
                minWidth: 54,
                height: 48,
                padding: 12,
                opacity: !input.trim() || isSending ? 0.5 : 1,
              },
            ]}
          >
            {isSending ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles_th.buttonText}>Enviar</Text>
            )}
          </Pressable>
        </View>

        <Text
          style={{
            marginTop: 8,
            color: "#777",
            fontSize: 12,
            textAlign: "center",
          }}
        >
          Os sensores registram interações com os recipientes; não substituem avaliação veterinária.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AI;
