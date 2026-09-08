import React from "react";
import { View, Text } from "react-native";

import { styles_th } from "../styles/theme";

import { DiaryEntry } from "../types";

type Props = {
  entry: DiaryEntry;
};

const isSameDay = (
  firstDate: Date,
  secondDate: Date,
): boolean => {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
};

const getEntryTitle = (
  entryDate: Date,
): string => {
  const today = new Date();

  if (isSameDay(entryDate, today)) {
    return "Registro de hoje";
  }

  const yesterday = new Date(today);

  yesterday.setDate(
    today.getDate() - 1,
  );

  if (isSameDay(entryDate, yesterday)) {
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

const EntryCard: React.FC<Props> = ({
  entry,
}) => {
  return (
    <View style={styles_th.item}>
      <Text style={styles_th.itemTitle}>
        {getEntryTitle(
          new Date(entry.createdAt),
        )}
      </Text>

      <Text
        style={styles_th.itemDate}
        numberOfLines={5}
        ellipsizeMode="tail"
      >
        {entry.title}
      </Text>

      <Text style={styles_th.itemDate}>
        {new Date(
          entry.createdAt,
        ).toLocaleString()}
      </Text>
    </View>
  );
};

export default EntryCard;