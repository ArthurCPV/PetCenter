import { View, Text } from "react-native";
import {
  useRoute,
  RouteProp,
} from "@react-navigation/native";

import { styles_gb } from "../styles/global";

import { HomeStack } from "../types/navigation";

type DetailsRouteProp =
  RouteProp<HomeStack, "Details">;

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

const Details = () => {
  const route =
    useRoute<DetailsRouteProp>();

  const { entry } = route.params;

  const entryDate =
    new Date(entry.createdAt);

  return (
    <View style={styles_gb.container}>
      <Text style={styles_gb.title}>
        {getEntryTitle(entryDate)}
      </Text>

      <Text style={styles_gb.itemTitle}>
        {entry.title}
      </Text>

      <Text style={styles_gb.itemDate}>
        {entryDate.toLocaleString()}
      </Text>
    </View>
  );
};

export default Details;