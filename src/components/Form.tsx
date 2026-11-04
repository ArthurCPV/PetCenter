import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

import { styles_th } from "../styles/theme";
import DiaryTextModal from "./DiaryTextModal";

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
  onSubmit: (text: string) => Promise<void>;
};

const Form: React.FC<Props> = ({
  initialText = "",
  hasTodayEntry,
  onSubmit,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <View style={styles_th.form}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => setModalVisible(true)}
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
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles_th.buttonText}>
            {hasTodayEntry ? "✎" : "+"}
          </Text>
        </TouchableOpacity>
      </View>

      <DiaryTextModal
        visible={modalVisible}
        title={hasTodayEntry ? "Editar registro" : "Novo registro"}
        initialText={initialText}
        textPlaceholder="Escreva aqui como seu pet está hoje..."
        submitLabel={hasTodayEntry ? "Salvar alterações" : "Criar registro"}
        validationMessage="Escreva como seu pet está hoje."
        onClose={() => setModalVisible(false)}
        onSubmit={onSubmit}
        autoFocus
      />
    </>
  );
};

export default Form;
