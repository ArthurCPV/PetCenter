import { View, Text } from "react-native";
import { useRoute } from "@react-navigation/native";
import { styles } from "../styles/global";

const Details = () => {
  const { params }: any = useRoute();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalhes</Text>

      <Text style={styles.itemTitle}>{params.task.title}</Text>
      <Text style={styles.itemDate}>
        {new Date(params.task.createdAt).toLocaleString()}
      </Text>
    </View>
  );
};

export default Details;