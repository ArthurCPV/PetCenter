import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DiaryEntry, PetDiary } from "../types";

const STORAGE_KEY = "PET_DIARIES";

export const useDiary = () => {
  const [pets, setPets] = useState<PetDiary[]>([]);

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    const data = await AsyncStorage.getItem(STORAGE_KEY);

    if (data) {
      const parsed = JSON.parse(data);

      setPets(parsed);
    }
  };

  const savePets = async (newPets: PetDiary[]) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPets));
  };

  const addPet = (
    name: string,
    species: string,
    breed?: string,
    birthDate?: string
  ) => {
    const newPet: PetDiary = {
      id: String(Date.now()),
      name,
      species,
      breed,
      birthDate,
      entries: [],
    };

    const updated = [newPet, ...pets];

    setPets(updated);
    savePets(updated);
  };

  const addEntry = (petId: string, text: string) => {
    const updated = pets.map((pet) => {
      if (pet.id !== petId) return pet;

      const newEntry: DiaryEntry = {
        id: String(Date.now()),
        title: text,
        createdAt: new Date(),
      };

      return {
        ...pet,
        entries: [newEntry, ...pet.entries],
      };
    });

    setPets(updated);
    savePets(updated);
  };

  return {
    pets,
    addPet,
    addEntry,
  };
};