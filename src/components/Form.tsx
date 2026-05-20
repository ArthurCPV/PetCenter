import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { styles_th } from "../styles/theme";
import { styles_gb } from "../styles/global";

type Props = {
  onSubmit: (text: string) => void;
};

const Form: React.FC<Props> = ({ onSubmit }) => {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;

    onSubmit(text);
    setText("");
  };

  return (
    <View style={styles_gb.formRow}>
      <TextInput
        style={styles_th.input}
        placeholder="Como seu pet está hoje?"
        value={text}
        onChangeText={setText}
      />

      <TouchableOpacity style={styles_th.button} onPress={handleSubmit}>
        <Text style={styles_th.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Form;