import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import type { CreatePetData, DiaryEntry, PetDiary } from "../types";

const STORAGE_KEY = "PET_DIARIES";

type StoredDiaryEntry = Omit<DiaryEntry, "createdAt"> & {
  createdAt: string;
};

type StoredPetDiary = Omit<PetDiary, "entries"> & {
  entries: StoredDiaryEntry[];
};

const isValidDateString = (value: string): boolean => {
  const date = new Date(value);

  return !Number.isNaN(date.getTime());
};

const isStoredDiaryEntry = (value: unknown): value is StoredDiaryEntry => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const entry = value as Record<string, unknown>;

  return (
    typeof entry.id === "string" &&
    typeof entry.title === "string" &&
    typeof entry.createdAt === "string" &&
    isValidDateString(entry.createdAt)
  );
};

const isStoredPetDiary = (value: unknown): value is StoredPetDiary => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const pet = value as Record<string, unknown>;

  return (
    typeof pet.id === "string" &&
    typeof pet.name === "string" &&
    typeof pet.species === "string" &&
    Array.isArray(pet.entries) &&
    pet.entries.every(isStoredDiaryEntry)
  );
};

const loadStoredPets = async (): Promise<PetDiary[]> => {
  const data = await AsyncStorage.getItem(STORAGE_KEY);

  if (!data) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(data);

    if (!Array.isArray(parsed)) {
      return [];
    }

    if (!parsed.every(isStoredPetDiary)) {
      return [];
    }

    return parsed.map((pet) => ({
      ...pet,
      entries: pet.entries.map((entry) => ({
        ...entry,
        createdAt: new Date(entry.createdAt),
      })),
    }));
  } catch (error) {
    console.error("Erro ao interpretar os dados salvos:", error);

    return [];
  }
};

export const useDiary = () => {
  const [pets, setPets] = useState<PetDiary[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadPets = async () => {
      try {
        const storedPets = await loadStoredPets();

        setPets(storedPets);
      } catch (error) {
        console.error("Erro ao carregar os pets:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    void loadPets();
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    const savePets = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(pets));
      } catch (error) {
        console.error("Erro ao salvar os pets:", error);
      }
    };

    void savePets();
  }, [pets, isLoaded]);

  const addPet = ({ name, species, breed, birthDate }: CreatePetData) => {
    const newPet: PetDiary = {
      id: String(Date.now()),
      name,
      species,
      breed,
      birthDate,
      entries: [],
    };

    setPets((currentPets) => [newPet, ...currentPets]);
  };

  const addEntry = (petId: string, text: string) => {
    const newEntry: DiaryEntry = {
      id: String(Date.now()),
      title: text,
      createdAt: new Date(),
    };

    setPets((currentPets) =>
      currentPets.map((pet) => {
        if (pet.id !== petId) {
          return pet;
        }

        return {
          ...pet,
          entries: [newEntry, ...pet.entries],
        };
      }),
    );
  };

  const clearPets = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setPets([]);
    } catch (error) {
      console.error("Erro ao limpar os pets:", error);
    }
  };

  return {
    pets,
    addPet,
    addEntry,
    clearPets,
  };
};
