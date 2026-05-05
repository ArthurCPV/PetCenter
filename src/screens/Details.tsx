import { View, Text } from "react-native";
import { useRoute } from "@react-navigation/native";
import { styles_gb } from "../styles/global";

const Details = () => {
  const { params }: any = useRoute();

  return (
    <View style={styles_gb.container}>
      <Text style={styles_gb.title}>Detalhes</Text>

      <Text style={styles_gb.itemTitle}>{params.task.title}</Text>
      <Text style={styles_gb.itemDate}>
        {new Date(params.task.createdAt).toLocaleString()}
      </Text>
    </View>
  );
};

export default Details;