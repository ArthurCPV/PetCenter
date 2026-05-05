import { View, Text } from "react-native";
import { styles_gb } from "../styles/global";

const AI = () => {
  return (
    <View style={styles_gb.center}>
      <Text style={styles_gb.placeholderTitle}>
        IA em desenvolvimento
      </Text>
      <Text style={styles_gb.placeholderSub}>
        (Ainda estamos treinando o cérebro dela...)
      </Text>
    </View>
  );
};

export default AI;