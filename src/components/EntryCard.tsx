import React from "react";
import { View, Text } from "react-native";
import { styles_th } from "../styles/theme";
import { DiaryEntry } from "../types";

type Props = {
  entry: DiaryEntry;
};

const EntryCard: React.FC<Props> = ({ entry }) => {
  return (
    <View style={styles_th.item}>
      <Text style={styles_th.itemTitle}>{entry.title}</Text>
      <Text style={styles_th.itemDate}>
        {new Date(entry.createdAt).toLocaleString()}
      </Text>
    </View>
  );
};

export default EntryCard;