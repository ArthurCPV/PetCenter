import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";

import { styles_th } from "../styles/theme";

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
  initialText?: string;
  hasTodayEntry: boolean;
  onSubmit: (text: string) => void;
};

const Form: React.FC<Props> = ({
  initialText = "",
  hasTodayEntry,
  onSubmit,
}) => {
  const [text, setText] = useState(initialText);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  const openModal = () => {
    setError("");
    setText(initialText);
    setModalVisible(true);
  };

  const closeModal = () => {
    setError("");
    setModalVisible(false);
  };

  const handleSubmit = () => {
    const trimmedText = text.trim();

    if (!trimmedText) {
      setError("Escreva como seu pet está hoje.");
      return;
    }

    onSubmit(trimmedText);
    setError("");
    setModalVisible(false);
  };

  return (
    <>
      <View style={styles_th.form}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={openModal}
          activeOpacity={0.8}
        >
          <TextInput
            style={[
              styles_th.input,
              inputBaseStyle,
              {
                height: 56,
                flex: 0,
                paddingHorizontal: 10,
                paddingTop: 15,
                paddingBottom: 15,
                borderRightWidth: 0,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                opacity: hasTodayEntry ? 0.5 : 1,
              },
            ]}
            placeholder={
              hasTodayEntry
                ? "Registro de hoje criado"
                : "Como seu pet está hoje?"
            }
            placeholderTextColor="#888"
            value=""
            editable={false}
            pointerEvents="none"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles_th.button,
            {
              marginLeft: 0,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
            },
          ]}
          onPress={openModal}
        >
          <Text style={styles_th.buttonText}>
            {hasTodayEntry ? "✎" : "+"}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <Pressable
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            }}
            onPress={closeModal}
          />

          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 20,
              padding: 20,
              maxHeight: "80%",
              minHeight: 380,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={styles_th.title}>
                {hasTodayEntry
                  ? "Editar registro"
                  : "Novo registro"}
              </Text>

              <TouchableOpacity
                onPress={closeModal}
                accessibilityLabel="Fechar"
                style={{
                  width: 40,
                  height: 40,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 26,
                    color: "#777",
                    fontWeight: "bold",
                  }}
                >
                  ×
                </Text>
              </TouchableOpacity>
            </View>

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
                error
                  ? {
                    borderWidth: 2,
                    borderColor: "#E53935",
                  }
                  : undefined,
              ]}
              placeholder="Escreva aqui como seu pet está hoje..."
              placeholderTextColor="#888"
              value={text}
              onChangeText={(value) => {
                setText(value);
                if (error) setError("");
              }}
              multiline
              numberOfLines={8}
              maxLength={MAX_ENTRY_LENGTH}
              autoFocus
            />

            <Text
              style={{
                marginTop: 6,
                textAlign: "right",
                color:
                  text.length >= MAX_ENTRY_LENGTH
                    ? "#E53935"
                    : "#777",
                fontSize: 12,
              }}
            >
              {text.length}/{MAX_ENTRY_LENGTH}
            </Text>

            {error ? (
              <Text
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
              style={[
                styles_th.button,
                {
                  width: "100%",
                  marginLeft: 0,
                  marginTop: 20,
                  borderRadius: 16,
                },
              ]}
              onPress={handleSubmit}
            >
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                }}
              >
                {hasTodayEntry
                  ? "Salvar alterações"
                  : "Criar registro"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Form;
