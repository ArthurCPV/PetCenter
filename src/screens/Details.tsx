import { View, Text } from "react-native";
import {
  useRoute,
  RouteProp,
} from "@react-navigation/native";

import { styles_gb } from "../styles/global";

import { HomeStack } from "../types/navigation";

type DetailsRouteProp = RouteProp<HomeStack, "Details">;

const Details = () => {
  const route = useRoute<DetailsRouteProp>();

  const { entry } = route.params;

  return (
    <View style={styles_gb.container}>
      <Text style={styles_gb.title}>
        Detalhes
      </Text>

      <Text style={styles_gb.itemTitle}>
        {entry.title}
      </Text>

      <Text style={styles_gb.itemDate}>
        {new Date(entry.createdAt).toLocaleString()}
      </Text>
    </View>
  );
};

export default Details;