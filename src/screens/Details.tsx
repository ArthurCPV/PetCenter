import { View, Text } from "react-native";
import { useRoute } from "@react-navigation/native";
import { styles_gb } from "../styles/global";
import { styles_th } from "../styles/theme";

const Details = () => {
  const { params }: any = useRoute();

  return (
    <View style={styles_gb.container}>
      <Text style={styles_th.title}>Detalhes</Text>

      <Text style={styles_th.itemTitle}>{params.task.title}</Text>
      <Text style={styles_th.itemDate}>
        {new Date(params.task.createdAt).toLocaleString()}
      </Text>
    </View>
  );
};

export default Details;