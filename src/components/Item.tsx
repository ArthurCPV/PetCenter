import { Text, TouchableOpacity } from "react-native";
import { DiaryEntry } from "../types";
import { styles_gb } from "../styles/global";
import { styles_th } from "../styles/theme";
import { useNavigation } from "@react-navigation/native";

const Item = ({ entry }: { entry: DiaryEntry }) => {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity
      style={styles_th.item}
      onPress={() => navigation.navigate("Details", { entry })}
    >
      <Text style={styles_th.itemTitle}>{entry.title}</Text>
    </TouchableOpacity>
  );
};

export default Item;