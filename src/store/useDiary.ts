import { useCallback, useEffect, useState } from "react";

import { createPet, listPets, listPetsByUser } from "../api/pets";

import {
  createDiaryEntry,
  listDiaryEntries,
  toDiaryEntry,
  updateDiaryEntry,
} from "../api/diary";

import { useAuth } from "../auth/AuthContext";

import type { CreatePetData, DiaryEntry, PetDiary } from "../types";

const buildPetsWithEntries = (
  pets: PetDiary[],
  entries: Awaited<ReturnType<typeof listDiaryEntries>>,
): PetDiary[] => {
  return pets.map((pet) => ({
    ...pet,
    entries: entries
      .filter((entry) => String(entry.idPet) === pet.id)
      .map(toDiaryEntry),
  }));
};

export const useDiary = () => {
  const { user } = useAuth();

  const [pets, setPets] = useState<PetDiary[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadDiary = useCallback(
    async (refreshing = false) => {
      if (!user) {
        setPets([]);
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }

      try {
        if (refreshing) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }

        const petsFromApi =
          user.tipoUsuario === "TUTOR"
            ? await listPetsByUser(user.id)
            : await listPets();

        const entries = await listDiaryEntries();

        const petsWithEntries = buildPetsWithEntries(petsFromApi, entries);

        setPets(petsWithEntries);
      } catch (error) {
        console.error("Erro ao carregar diário:", error);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [user],
  );

  useEffect(() => {
    void loadDiary();
  }, [loadDiary]);

  const addPet = async (data: CreatePetData): Promise<void> => {
    if (user?.tipoUsuario !== "TUTOR") {
      return;
    }

    try {
      const newPet = await createPet(data);

      setPets((currentPets) => [newPet, ...currentPets]);
    } catch (error) {
      console.error("Erro ao criar pet:", error);

      throw error;
    }
  };

  const addEntry = async (petId: string, text: string): Promise<void> => {
    if (user?.tipoUsuario !== "TUTOR") {
      return;
    }

    try {
      const newEntry = await createDiaryEntry(petId, text);

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
    } catch (error) {
      console.error("Erro ao criar entrada:", error);

      throw error;
    }
  };

  const updateEntry = async (
    petId: string,
    entryId: string,
    text: string,
  ): Promise<void> => {
    if (user?.tipoUsuario !== "TUTOR") {
      return;
    }

    try {
      const updatedEntry = await updateDiaryEntry(entryId, petId, text);

      setPets((currentPets) =>
        currentPets.map((pet) => {
          if (pet.id !== petId) {
            return pet;
          }

          return {
            ...pet,
            entries: pet.entries.map((entry) =>
              entry.id === entryId ? updatedEntry : entry,
            ),
          };
        }),
      );
    } catch (error) {
      console.error("Erro ao atualizar entrada:", error);

      throw error;
    }
  };

  return {
    pets,
    isLoading,
    isRefreshing,
    addPet,
    addEntry,
    updateEntry,
    refresh: () => loadDiary(true),
  };
};
