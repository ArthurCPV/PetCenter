import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { styles_th } from "../styles/theme";
import { styles_gb } from "../styles/global";

const PetCard = ({ pet, onPress }: any) => {
  return (
    <TouchableOpacity style={styles_th.item} onPress={onPress}>
      <Text style={styles_th.itemTitle}>{pet.name}</Text>

      <View
        style={styles_gb.row}
      >
        <Text style={styles_th.itemDate}>
          {pet.species}
        </Text>

        {pet.breed && (
          <Text style={styles_th.itemDate}>
            {" • "}{pet.breed}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default PetCard;