import React from "react";
import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { styles_th } from "../styles/theme";

import type { PetDiary } from "../types";
import OutlineButton from "./OutlineButton";

type Props = {
  pet: PetDiary;
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

const PetCard = ({
  pet,
  onPress,
  onEdit,
  onDelete,
}: Props) => {
  return (
    <View style={styles_th.item}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
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
            {pet.breed ? ` • ${pet.breed}` : ""}
          </Text>

          {pet.birthDate ? (
            <Text style={styles_th.itemDate}>
              {pet.birthDate}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>

      {(onEdit || onDelete) && (
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            marginTop: 12,
          }}
        >
          {onEdit ? (
            <OutlineButton
              label="✎ Editar Diário"
              onPress={onEdit}
              style={{ flex: 1 }}
            />
          ) : null}

          {onDelete ? (
            <OutlineButton
              label="🗑 Excluir diário"
              onPress={onDelete}
              color="#B71C1C"
              style={{ flex: 1 }}
            />
          ) : null}
        </View>
      )}
    </View>
  );
};

export default PetCard;