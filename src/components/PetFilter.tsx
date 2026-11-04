import { useMemo } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import type { PetDiary } from "../types";
import SelectDropdown from "./SelectDropdown";

type Props = {
  pets: PetDiary[];
  search: string;
  selectedPetId: string | undefined;
  onSearchChange: (value: string) => void;
  onPetChange: (petId: string | undefined) => void;
};

const PetFilter = ({
  pets,
  search,
  selectedPetId,
  onSearchChange,
  onPetChange,
}: Props) => {
  const matchingPets = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();

    if (!query) {
      return pets;
    }

    return pets.filter(
      (pet) =>
        pet.name.toLocaleLowerCase().includes(query) ||
        pet.id.toLocaleLowerCase().includes(query),
    );
  }, [pets, search]);

  const selectedPet = pets.find((pet) => pet.id === selectedPetId);
  const options = matchingPets.map((pet) => ({
    value: pet.id,
    label: `${pet.name} · ID ${pet.id}`,
  }));

  return (
    <View
      style={{
        marginHorizontal: 20,
        marginBottom: 14,
        gap: 8,
      }}
    >
      <View
        style={{
          minHeight: 46,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: "#F0DADA",
          backgroundColor: "#fff",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TextInput
          value={search}
          onChangeText={onSearchChange}
          placeholder="Buscar pet por nome ou ID"
          placeholderTextColor="#999"
          autoCapitalize="none"
          style={{
            minHeight: 44,
            flex: 1,
            paddingHorizontal: 14,
            color: "#2D2D2D",
          }}
        />
        {search.length > 0 ? (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Limpar busca"
            onPress={() => onSearchChange("")}
            style={{
              width: 40,
              height: 46,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#777", fontSize: 24, lineHeight: 28 }}>
              ×
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <SelectDropdown
        value={selectedPetId}
        options={options}
        onChange={onPetChange}
        placeholder="Selecionar pet"
        allLabel="Todos os pets"
        selectedLabel={
          selectedPet
            ? `${selectedPet.name} · ID ${selectedPet.id}`
            : undefined
        }
      />
    </View>
  );
};

export default PetFilter;
