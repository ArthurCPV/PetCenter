import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { styles_th } from "../styles/theme";
import { styles_gb } from "../styles/global";
import DailyEntryModal from "./DailyEntryModal";

type Props = {
  onSubmit: (data: {
    title: string;
    petAte?: string;
    whatAte?: string;
    petSlept?: string;
    observations?: string;
    concerns?: string;
  }) => void;
};

const Form: React.FC<Props> = ({ onSubmit }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSubmit = (data: any) => {
    onSubmit(data);
  };

  return (
    <>
      <View style={styles_gb.inputRow}>
        <TouchableOpacity
          style={styles_gb.inputGroupInput}
          activeOpacity={0.8}
          onPress={() => setModalVisible(true)}
        >
          <Text style={{ fontSize: 15, color: "#999" }}>
            Como seu pet está hoje?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles_gb.inputGroupButton}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={[styles_th.buttonText, { fontSize: 24 }]}>+</Text>
        </TouchableOpacity>
      </View>

      <DailyEntryModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default Form;