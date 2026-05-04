import { View, Text } from "react-native";
import { styles } from "../styles";

const Alerts = () => {
  return (
    <View style={styles.center}>
      <Text style={styles.placeholderTitle}>
        Esta página está em construção
      </Text>
      <Text style={styles.placeholderSub}>
        (E o dev está repondo seu café...)
      </Text>
    </View>
  );
};

export default Alerts;