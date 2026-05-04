import { View, TouchableOpacity, Image, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styles } from "../styles/global";

const TabBar = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.tabBar}>
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => navigation.navigate("Lista")}
      >
        <Image
          source={require("../../assets/diary.png")}
          style={styles.tabIcon}
        />
        <Text style={styles.tabText}>Diário</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => navigation.navigate("Alerts")}
      >
        <Image
          source={require("../../assets/alert.png")}
          style={styles.tabIcon}
        />
        <Text style={styles.tabText}>Alertas</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => navigation.navigate("AI")}
      >
        <Image
          source={require("../../assets/ai.png")}
          style={styles.tabIcon}
        />
        <Text style={styles.tabText}>IA</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => navigation.navigate("Profile")}
      >
        <Image
          source={require("../../assets/profile.png")}
          style={styles.tabIcon}
        />
        <Text style={styles.tabText}>Perfil</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TabBar;