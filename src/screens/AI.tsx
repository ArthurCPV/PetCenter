import { View, Text } from "react-native";
import { styles } from "../styles/global";

const AI = () => {
  return (
    <View style={styles.center}>
      <Text style={styles.placeholderTitle}>
        IA em desenvolvimento
      </Text>
      <Text style={styles.placeholderSub}>
        (Ainda estamos treinando o cérebro dela...)
      </Text>
    </View>
  );
};

export default AI;