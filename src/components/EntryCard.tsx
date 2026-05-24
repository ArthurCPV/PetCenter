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
        {new Date(entry.createdAt).toLocaleDateString("pt-BR")}
      </Text>
      {(entry.summary || entry.observations) ? (
        <Text style={{ marginTop: 8, color: "#666" }} numberOfLines={2}>
          {entry.summary || entry.observations}
        </Text>
      ) : null}

      {entry.mood ? (
        <Text style={{ marginTop: 6, color: "#999", fontSize: 13 }}>Humor: {entry.mood}</Text>
      ) : null}

      {entry.records && entry.records.length ? (
        <Text style={{ marginTop: 8, color: "#666", fontSize: 13 }} numberOfLines={1}>
          {entry.records.length} registro(s) estruturado(s)
        </Text>
      ) : null}
    </View>
  );
};

export default EntryCard;