import { View, Text } from "react-native";
import { styles_gb } from "../styles/global";
import { styles_th } from "../styles/theme";

const Alerts = () => {
  return (
    <View style={styles_gb.center}>
      <Text style={styles_th.placeholderTitle}>
        Esta página está em construção
      </Text>
      <Text style={styles_th.placeholderSub}>
        (E o dev está repondo seu café...)
      </Text>
    </View>
  );
};

export default Alerts;