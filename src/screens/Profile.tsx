import { View, Text } from "react-native";
import { styles_gb } from "../styles/global";
import { styles_th } from "../styles/theme";

const Profile = () => {
  return (
    <View style={styles_gb.center}>
      <Text style={styles_th.placeholderTitle}>
        Perfil do usuário
      </Text>
      <Text style={styles_th.placeholderSub}>
        (Quase pronto…)
      </Text>
    </View>
  );
};

export default Profile;