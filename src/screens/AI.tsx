import { View, Text } from "react-native";

import { styles_gb } from "../styles/global";
import { styles_th } from "../styles/theme";

const AI = () => {
  return (
    <View style={styles_gb.center}>
      <Text style={styles_th.placeholderTitle}>
        IA em desenvolvimento
      </Text>
      <Text style={styles_th.placeholderSub}>
        (Ainda estamos treinando o cérebro dela...)
      </Text>
    </View>
  );
};

export default AI;