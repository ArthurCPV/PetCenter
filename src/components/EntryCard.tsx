import React from "react";

import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { styles_th } from "../styles/theme";

import type { DiaryEntry } from "../types";

type Props = {
  entry: DiaryEntry;
  isTutor: boolean;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

const isSameDay = (
  firstDate: Date,
  secondDate: Date,
): boolean => {
  return (
    firstDate.getFullYear() ===
    secondDate.getFullYear() &&
    firstDate.getMonth() ===
    secondDate.getMonth() &&
    firstDate.getDate() ===
    secondDate.getDate()
  );
};

const getEntryTitle = (
  entryDate: Date,
): string => {
  const today =
    new Date();

  if (
    isSameDay(
      entryDate,
      today,
    )
  ) {
    return "Registro de hoje";
  }

  const yesterday =
    new Date(today);

  yesterday.setDate(
    today.getDate() - 1,
  );

  if (
    isSameDay(
      entryDate,
      yesterday,
    )
  ) {
    return "Registro de ontem";
  }

  const dayBeforeYesterday =
    new Date(today);

  dayBeforeYesterday.setDate(
    today.getDate() - 2,
  );

  if (
    isSameDay(
      entryDate,
      dayBeforeYesterday,
    )
  ) {
    return "Registro de anteontem";
  }

  return `Registro de ${entryDate.toLocaleDateString(
    "pt-BR",
  )}`;
};

const EntryCard = ({
  entry,
  isTutor,
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

      {isTutor ? (
        <View
          style={{
            flexDirection:
              "row",
            gap: 10,
            marginTop: 12,
          }}
        >
          <TouchableOpacity
            onPress={onEdit}
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 12,
              borderWidth: 1,
              borderColor:
                "#E53935",
              alignItems:
                "center",
            }}
          >
            <Text
              style={{
                color:
                  "#E53935",
                fontWeight:
                  "bold",
              }}
            >
              ✎ Editar diário
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onDelete}
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 12,
              borderWidth: 1,
              borderColor:
                "#B71C1C",
              alignItems:
                "center",
            }}
          >
            <Text
              style={{
                color:
                  "#B71C1C",
                fontWeight:
                  "bold",
              }}
            >
              🗑 Excluir diário
            </Text>
          </TouchableOpacity>
        </View>
      ) : undefined}
    </View>
  );
};

export default EntryCard;