import React from "react";
import {
  TouchableOpacity,
  Text,
  View,
} from "react-native";

import { styles_th } from "../styles/theme";

import type { PetDiary } from "../types";

type Props = {
  pet: PetDiary;
  onPress: () => void;
};

const PetCard = ({
  pet,
  onPress,
}: Props) => {
  return (
    <TouchableOpacity
      style={styles_th.item}
      onPress={onPress}
    >
      <Text style={styles_th.itemTitle}>
        {pet.name}
      </Text>

      <View
        style={{
          marginTop: 5,
        }}
      >
        <Text style={styles_th.itemDate}>
          {pet.species}
          {pet.breed
            ? ` • ${pet.breed}`
            : ""}
        </Text>

        {pet.birthDate ? (
          <Text style={styles_th.itemDate}>
            {pet.birthDate}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

export default PetCard;