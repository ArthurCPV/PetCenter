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
            <TouchableOpacity
              onPress={onEdit}
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#E53935",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#E53935",
                  fontWeight: "bold",
                }}
              >
                ✎ Editar Diário
              </Text>
            </TouchableOpacity>
          ) : null}

          {onDelete ? (
            <TouchableOpacity
              onPress={onDelete}
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#B71C1C",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#B71C1C",
                  fontWeight: "bold",
                }}
              >
                🗑 Excluir diário
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      )}
    </View>
  );
};

export default PetCard;