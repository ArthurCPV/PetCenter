import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DiaryEntry, PetDiary } from "../types";

const STORAGE_KEY = "PET_DIARIES";

const isSameDay = (a?: string | Date, b?: string | Date) => {
  if (!a || !b) return false;
  const da = new Date(a);
  const db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
};

export const useDiary = () => {
  const [pets, setPets] = useState<PetDiary[]>([]);

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    const data = await AsyncStorage.getItem(STORAGE_KEY);

    if (data) {
      try {
        const parsed = JSON.parse(data);
        setPets(parsed);
      } catch (err) {
        setPets([]);
      }
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

  const getEntryForDate = (petId: string, date: Date) => {
    const pet = pets.find((p) => p.id === petId);
    if (!pet) return undefined;
    return pet.entries.find((e) => isSameDay(e.createdAt, date));
  };

  const addEntry = (
    petId: string,
    petAte?: string,
    whatAte?: string,
    petSlept?: string,
    observations?: string,
    concerns?: string,
    // new structured fields
    summary?: string,
    mood?: string,
    records?: DiaryEntry["records"]
  ) => {
    const today = new Date();

    const updated = pets.map((pet) => {
      if (pet.id !== petId) return pet;

      // prevent creating more than one entry per day
      const exists = pet.entries.some((e) => isSameDay(e.createdAt, today));
      if (exists) return pet;

      const title = `Registro do dia ${today.toLocaleDateString("pt-BR")}`;

      const newEntry: DiaryEntry = {
        id: String(Date.now()),
        title,
        createdAt: today,
        petAte,
        whatAte,
        petSlept,
        observations,
        concerns,
        // map summary/legacy
        summary: summary || observations,
        mood,
        records,
      };

      return {
        ...pet,
        entries: [newEntry, ...pet.entries],
      };
    });

    setPets(updated);
    savePets(updated);
  };

  const editEntry = (
    petId: string,
    entryId: string,
    updates: Partial<Omit<DiaryEntry, "id" | "createdAt" | "title">>
  ) => {
    const updated = pets.map((pet) => {
      if (pet.id !== petId) return pet;

      const entries = pet.entries.map((e) => {
        if (e.id !== entryId) return e;

        return {
          ...e,
          ...updates,
        } as DiaryEntry;
      });

      return {
        ...pet,
        entries,
      };
    });

    setPets(updated);
    savePets(updated);
  };

  return {
    pets,
    addPet,
    addEntry,
    editEntry,
    getEntryForDate,
  };
};