import { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type ListRenderItem,
} from "react-native";

import { colors, styles_th } from "../styles/theme";
import { useAssistant, type ChatMessage } from "../store/useAssistant";

const suggestedQuestions = [
  "Quantas vezes meu pet comeu hoje?",
  "Que horas ele bebeu água?",
  "Ele comeu mais ontem ou hoje?",
];

const chatStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  assistantIcon: {
    width: 44,
    height: 44,
  },
  title: {
    color: colors.primary,
    fontSize: 25,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 3,
    color: "#777",
    fontSize: 14,
  },
  scopeNotice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
    marginTop: 14,
    paddingHorizontal: 9,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: "#FFF0F0",
  },
  scopeIcon: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "700",
  },
  scopeText: {
    flex: 1,
    color: "#777",
    fontSize: 11,
    lineHeight: 15,
  },
  messageList: {
    flexGrow: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  message: {
    maxWidth: "88%",
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  composer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  questionChip: {
    marginRight: 8,
    marginBottom: 10,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#FFFFFF",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 46,
    maxHeight: 112,
    paddingVertical: 11,
    backgroundColor: "#FFFFFF",
  },
  sendButton: {
    width: 46,
    height: 46,
    padding: 0,
    borderRadius: 23,
  },
  disclaimer: {
    marginTop: 8,
    color: "#888",
    fontSize: 11,
    lineHeight: 15,
    textAlign: "center",
  },
});

const AI = () => {
  const {
    messages,
    input,
    setInput,
    errorMessage,
    isSending,
    sendMessage,
    clearError,
  } = useAssistant();
  const listRef = useRef<FlatList<ChatMessage>>(null);

  useEffect(() => {
    listRef.current?.scrollToEnd({ animated: true });
  }, [messages, isSending]);

  const renderMessage: ListRenderItem<ChatMessage> = ({ item }) => {
    const isUser = item.role === "user";

    return (
      <View
        style={[
          chatStyles.message,
          {
            alignSelf: isUser ? "flex-end" : "flex-start",
            backgroundColor: isUser ? colors.primary : "#FFFFFF",
            borderBottomRightRadius: isUser ? 5 : 16,
            borderBottomLeftRadius: isUser ? 16 : 5,
          },
        ]}
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
      style={chatStyles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
    >
      <View style={chatStyles.header}>
        <View style={chatStyles.headerRow}>
          <Image
            source={require("../../assets/icons/Icon_IA_petcenter.png")}
            style={chatStyles.assistantIcon}
            resizeMode="contain"
            accessibilityLabel="Ícone do assistente"
          />
          <View style={{ flex: 1 }}>
            <Text style={chatStyles.title}>Assistente CLYVO VET</Text>
            <Text style={chatStyles.subtitle}>
              Alimentação e hidratação do IoT
            </Text>
          </View>
        </View>

        <View style={chatStyles.scopeNotice}>
          <Text style={chatStyles.scopeIcon}>i</Text>
          <Text style={chatStyles.scopeText}>
            Integração experimental de outra disciplina. Usa dados do IoT
            compartilhado, sem identificar o perfil ou pet desta conta.
          </Text>
        </View>
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={chatStyles.messageList}
        onContentSizeChange={() =>
          listRef.current?.scrollToEnd({ animated: true })
        }
        keyboardShouldPersistTaps="handled"
        ListFooterComponent={
          isSending ? (
            <View
              style={[
                chatStyles.message,
                {
                  alignSelf: "flex-start",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  backgroundColor: "#FFFFFF",
                },
              ]}
            >
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={{ color: "#666" }}>Consultando os dados...</Text>
            </View>
          ) : null
        }
      />

      <View style={chatStyles.composer}>
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
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {suggestedQuestions.map((question) => (
              <Pressable
                key={question}
                accessibilityRole="button"
                disabled={isSending}
                onPress={() => void sendMessage(question)}
                style={[
                  chatStyles.questionChip,
                  { opacity: isSending ? 0.6 : 1 },
                ]}
              >
                <Text style={{ color: colors.text, fontSize: 13 }}>
                  {question}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        ) : null}

        <View style={chatStyles.inputRow}>
          <TextInput
            accessibilityLabel="Pergunta para o assistente"
            multiline
            maxLength={1000}
            editable={!isSending}
            value={input}
            onChangeText={(value) => {
              setInput(value);
              if (errorMessage) {
                clearError();
              }
            }}
            onSubmitEditing={() => void sendMessage()}
            placeholder="Digite sua pergunta..."
            placeholderTextColor="#888"
            returnKeyType="send"
            style={[styles_th.input, chatStyles.input]}
          />

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Enviar pergunta"
            disabled={!input.trim() || isSending}
            onPress={() => void sendMessage()}
            style={[
              styles_th.button,
              chatStyles.sendButton,
              { opacity: !input.trim() || isSending ? 0.5 : 1 },
            ]}
          >
            {isSending ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles_th.buttonText}>↑</Text>
            )}
          </Pressable>
        </View>

        <Text
          style={chatStyles.disclaimer}
        >
          Os sensores registram interações com recipientes e não substituem avaliação veterinária.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AI;
