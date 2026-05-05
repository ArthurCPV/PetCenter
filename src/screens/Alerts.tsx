import { View, Text } from "react-native";
import { styles_gb } from "../styles/global";

const Alerts = () => {
  return (
    <View style={styles_gb.center}>
      <Text style={styles_gb.placeholderTitle}>
        Esta página está em construção
      </Text>
      <Text style={styles_gb.placeholderSub}>
        (E o dev está repondo seu café...)
      </Text>
    </View>
  );
};

export default Alerts;