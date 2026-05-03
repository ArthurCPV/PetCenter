import React from "react";
import { View, Text } from "react-native";
import { styles } from "../styles/theme";
import { DiaryEntry } from "../types";

type Props = {
  entry: DiaryEntry;
};

const EntryCard: React.FC<Props> = ({ entry }) => {
  return (
    <View style={styles.item}>
      <Text style={styles.itemTitle}>{entry.title}</Text>
      <Text style={styles.itemDate}>
        {new Date(entry.createdAt).toLocaleString()}
      </Text>
    </View>
  );
};

export default EntryCard;