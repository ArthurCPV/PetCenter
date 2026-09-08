import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { styles_th } from "../styles/theme";

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
    setText("");
  };

  return (
    <>
      {/* FORMULÁRIO COMPACTO */}
      <View style={styles_th.form}>
        <TouchableOpacity
          style={{
            flex: 1,
          }}
          onPress={openModal}
          activeOpacity={0.8}
        >
          <TextInput
            style={[
              styles_th.input,
              {
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
            value=""
            editable={false}
            pointerEvents="none"
          />
        </TouchableOpacity>

        {/* BOTÃO + / EDIÇÃO */}
        <TouchableOpacity
          style={[styles_th.button,
          {
            marginLeft: 0,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          }
          ]}
          onPress={openModal}
        >
          <Text style={styles_th.buttonText}>
            {hasTodayEntry ? "✎" : "+"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* POPUP */}
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
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 20,
              padding: 20,
            }}
          >
            {/* CABEÇALHO */}
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

              <TouchableOpacity onPress={closeModal}>
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

            {/* INPUT GRANDE */}
            <TextInput
              style={[
                styles_th.input,
                {
                  marginTop: 20,
                  height: 180,
                  paddingHorizontal: 15,
                  paddingTop: 10,
                  paddingBottom: 40,
                  textAlignVertical: "top",
                  borderWidth: error ? 2 : undefined,
                  borderColor: error ? "#E53935" : undefined,
                },
              ]}
              placeholder="Escreva aqui como seu pet está hoje..."
              value={text}
              onChangeText={(value) => {
                setText(value);

                if (error) {
                  setError("");
                }
              }}
              multiline
              numberOfLines={8}
              autoFocus
            />

            {/* ERRO */}
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
            ) : null}

            {/* BOTÃO */}
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