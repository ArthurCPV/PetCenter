import { Text, TouchableOpacity } from "react-native";
import { Task } from "../types";
import { styles } from "../styles/global";
import { useNavigation } from "@react-navigation/native";

const Item = ({ task }: { task: Task }) => {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate("Details", { task })}
    >
      <Text style={styles.itemTitle}>{task.title}</Text>
    </TouchableOpacity>
  );
};

export default Item;