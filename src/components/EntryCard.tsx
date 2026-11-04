import React from "react";

import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { styles_th } from "../styles/theme";

import type { DiaryEntry } from "../types";
import { getEntryTitle } from "../utils/date";
import OutlineButton from "./OutlineButton";

type Props = {
  entry: DiaryEntry;
  isTutor: boolean;
  isEditable: boolean;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

const EntryCard = ({
  entry,
  isTutor,
  isEditable,
  onPress,
  onEdit,
  onDelete,
}: Props) => {
  const entryDate =
    new Date(
      entry.createdAt,
    );

  return (
    <View
      style={styles_th.item}
    >
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text
          style={
            styles_th.itemTitle
          }
        >
          {getEntryTitle(
            entryDate,
          )}
        </Text>

        <Text
          style={
            styles_th.itemDate
          }
          numberOfLines={4}
        >
          {entry.title}
        </Text>

        <Text
          style={
            styles_th.itemDate
          }
        >
          {entry.records.length}{" "}
          {entry.records.length ===
            1
            ? "registro"
            : "registros"}
        </Text>

        <Text
          style={
            styles_th.itemDate
          }
        >
          {entryDate.toLocaleString(
            "pt-BR",
          )}
        </Text>
      </TouchableOpacity>

      {isTutor && isEditable ? (
        <View
          style={{
            flexDirection:
              "row",
            gap: 10,
            marginTop: 12,
          }}
        >
          <OutlineButton
            label="✎ Editar Registro"
            onPress={onEdit}
            style={{ flex: 1 }}
          />

          <OutlineButton
            label="🗑 Excluir Registro"
            onPress={onDelete}
            color="#B71C1C"
            style={{ flex: 1 }}
          />
        </View>
      ) : undefined}

      {isTutor && !isEditable ? (
        <Text style={{ marginTop: 10, color: "#999", fontSize: 12 }}>
          Diário encerrado. Alterações não são permitidas após a meia-noite.
        </Text>
      ) : undefined}
    </View>
  );
};

export default EntryCard;