import { Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { styles_gb } from "../styles/global";

import { HomeStack } from "../types/navigation";
import { DiaryEntry } from "../types";


type NavigationProp = NativeStackNavigationProp<
  HomeStack,
  "Details"
>;

type Props = {
  entry: DiaryEntry;
};

const Item = ({ entry }: Props) => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <TouchableOpacity
      style={styles_gb.item}
      onPress={() =>
        navigation.navigate("Details", { entry })
      }
    >
      <Text style={styles_gb.itemTitle}>
        {entry.title}
      </Text>
    </TouchableOpacity>
  );
};

export default Item;