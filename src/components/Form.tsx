import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";

import { styles_th } from "../styles/theme";
import { styles_gb } from "../styles/global";

import DailyEntryModal, {
  DailyEntryData,
} from "./DailyEntryModal";

type FormProps = {
  onSubmit: (data: DailyEntryData) => void;
  initialValues?: DailyEntryData;
  onOpenAttempt?: (hasTodayEntry: boolean) => void;
  disabled?: boolean;
};

const Form: React.FC<FormProps> = ({
  onSubmit,
  initialValues,
  onOpenAttempt,
  disabled,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const hasTodayEntry = !!initialValues;

  const handleOpen = () => {
    onOpenAttempt?.(hasTodayEntry);

    if (!hasTodayEntry) {
      setModalVisible(true);
    }
  };

  const handleSubmit = (data: DailyEntryData) => {
    onSubmit(data);
  };

  return (
    <>
      <View style={styles_gb.inputRow}>
        <TouchableOpacity
          style={styles_gb.inputGroupInput}
          activeOpacity={0.8}
          onPress={() => !disabled && handleOpen()}
        >
          <Text style={{ fontSize: 15, color: "#999" }}>
            {hasTodayEntry
              ? "Tocar para editar o registro de hoje"
              : "Como seu pet está hoje?"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles_gb.inputGroupButton,
            {
              backgroundColor: hasTodayEntry
                ? "#4CAF50"
                : "#E53935",
            },
          ]}
          onPress={() => !disabled && handleOpen()}
          activeOpacity={0.85}
        >
          <Text
            style={[
              styles_th.buttonText,
              { fontSize: 24 },
            ]}
          >
            {hasTodayEntry ? "✏️" : "+"}
          </Text>
        </TouchableOpacity>
      </View>

      <DailyEntryModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
        initialValues={initialValues}
      />
    </>
  );
};

export default Form;