import { View, Text } from "react-native";
import { styles_gb } from "../styles/global";

const Profile = () => {
  return (
    <View style={styles_gb.center}>
      <Text style={styles_gb.placeholderTitle}>
        Perfil do usuário
      </Text>
      <Text style={styles_gb.placeholderSub}>
        (Quase pronto… confia 😅)
      </Text>
    </View>
  );
};

export default Profile;