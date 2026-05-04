import { View, Text } from "react-native";
import { global, styles } from "../styles/global";
import { theme } from "../styles/theme";

const Profile = () => {
  return (
    <View style={styles.center}>
      <Text style={styles.placeholderTitle}>
        Perfil do usuário
      </Text>
      <Text style={styles.placeholderSub}>
        (Quase pronto… confia 😅)
      </Text>
    </View>
  );
};

export default Profile;