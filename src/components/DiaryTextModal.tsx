import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

import { styles_th } from "../styles/theme";
import ModalShell from "./ModalShell";

const MAX_ENTRY_LENGTH = 1000;

const inputBaseStyle = {
  width: "100%" as const,
  flexGrow: 0,
  flexShrink: 0,
  borderWidth: 1,
  borderColor: "#C9C9C9",
  backgroundColor: "#FFFFFF",
  color: "#222222",
  fontSize: 16,
  borderRadius: 14,
};

type Props = {
  visible: boolean;
  title: string;
  initialText: string;
  textPlaceholder: string;
  submitLabel: string;
  validationMessage: string;
  onClose: () => void;
  onSubmit: (text: string) => Promise<void>;
  autoFocus?: boolean;
};

const DiaryTextModal = ({
  visible,
  title,
  initialText,
  textPlaceholder,
  submitLabel,
  validationMessage,
  onClose,
  onSubmit,
  autoFocus = false,
}: Props) => {
  const [text, setText] = useState(initialText);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (visible) {
      setText(initialText);
      setError("");
    }
  }, [initialText, visible]);

  const handleSubmit = async () => {
    const trimmedText = text.trim();

    if (!trimmedText) {
      setError(validationMessage);
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await onSubmit(trimmedText);
      onClose();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível salvar o diário.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalShell
      visible={visible}
      title={title}
      onClose={onClose}
      isSubmitting={isSubmitting}
      cardStyle={{ maxHeight: "80%", minHeight: 380 }}
    >
      <View>
        <TextInput
          style={[
            styles_th.input,
            inputBaseStyle,
            {
              width: "100%",
              minHeight: 180,
              height: 180,
              marginTop: 20,
              paddingHorizontal: 15,
              paddingTop: 12,
              paddingBottom: 12,
              textAlignVertical: "top",
            },
            error ? { borderWidth: 2, borderColor: "#E53935" } : undefined,
          ]}
          placeholder={textPlaceholder}
          placeholderTextColor="#888"
          value={text}
          onChangeText={(value) => {
            setText(value);
            if (error) {
              setError("");
            }
          }}
          multiline
          numberOfLines={8}
          maxLength={MAX_ENTRY_LENGTH}
          autoFocus={autoFocus}
        />

        <Text
          style={{
            marginTop: 6,
            textAlign: "right",
            color: text.length >= MAX_ENTRY_LENGTH ? "#E53935" : "#777",
            fontSize: 12,
          }}
        >
          {text.length}/{MAX_ENTRY_LENGTH}
        </Text>

        {error ? (
          <Text
            accessibilityRole="alert"
            style={{
              color: "#E53935",
              marginTop: 6,
              marginLeft: 5,
              fontSize: 14,
            }}
          >
            {error}
          </Text>
        ) : undefined}

        <TouchableOpacity
          disabled={isSubmitting}
          style={[
            styles_th.button,
            {
              width: "100%",
              marginLeft: 0,
              marginTop: 20,
              borderRadius: 16,
              opacity: isSubmitting ? 0.6 : 1,
            },
          ]}
          onPress={() => {
            void handleSubmit();
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            {isSubmitting ? "Salvando..." : submitLabel}
          </Text>
        </TouchableOpacity>
      </View>
    </ModalShell>
  );
};

export default DiaryTextModal;
