import React from "react";
import { TouchableOpacity, Text, View } from "react-native";

import { styles_th } from "../styles/theme";

import { PetDiary } from "../types";

type Props = {
  pet: PetDiary;
  onPress: () => void;
};

const PetCard: React.FC<Props> = ({ pet, onPress }) => {
  return (
    <TouchableOpacity
      style={styles_th.item}
      onPress={onPress}
    >
      <Text style={styles_th.itemTitle}>{pet.name}</Text>

      <View
        style={{
          flexDirection: "row",
          marginTop: 5,
        }}
      >
        <Text style={styles_th.itemDate}>
          {pet.species}
        </Text>

        {pet.breed && (
          <Text style={styles_th.itemDate}>
            {" • "}
            {pet.breed}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default PetCard;