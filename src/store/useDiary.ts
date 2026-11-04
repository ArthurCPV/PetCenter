import { useCallback, useEffect, useRef, useState } from "react";

import {
  createPet,
  deletePet,
  listPets,
  listPetsByUser,
  updatePet,
} from "../api/pets";

import {
  createDiaryEntry,
  deleteDiaryEntry,
  listDiaryEntries,
  toDiaryEntry,
  updateDiaryEntry,
} from "../api/diary";

import {
  createRecord,
  deleteRecord,
  listRecords,
  toRegistro,
  updateRecord,
} from "../api/records";

import { useAuth } from "../auth/AuthContext";

import type {
  CreatePetData,
  CreateRecordData,
  DiaryEntry,
  PetDiary,
  Registro,
} from "../types";
import { isSameDay, isToday } from "../utils/date";

const isEditableToday = (createdAt: Date): boolean => {
  return isSameDay(createdAt, new Date());
};

const isDiaryEntryEditable = (entry: DiaryEntry): boolean => {
  return isToday(entry.entryDate);
};

const buildPetsWithEntries = (
  pets: PetDiary[],
  entries: DiaryEntry[],
  records: Registro[],
): PetDiary[] => {
  return pets.map((pet) => ({
    ...pet,
    entries: entries
      .filter((entry) => entry.idPet === pet.id)
      .map((entry) => ({
        ...entry,
        records: records.filter((record) => record.entryId === entry.id),
      })),
  }));
};

const updatePetInList = (
  pets: PetDiary[],
  petId: string,
  update: (pet: PetDiary) => PetDiary,
): PetDiary[] =>
  pets.map((pet) => (pet.id === petId ? update(pet) : pet));

const updateEntryInPets = (
  pets: PetDiary[],
  entryId: string,
  update: (entry: DiaryEntry) => DiaryEntry,
): PetDiary[] =>
  pets.map((pet) => ({
    ...pet,
    entries: pet.entries.map((entry) =>
      entry.id === entryId ? update(entry) : entry,
    ),
  }));

export const useDiary = () => {
  const { user } = useAuth();

  const [pets, setPets] = useState<PetDiary[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const loadRequestInProgress = useRef(false);

  const loadDiary = useCallback(
    async (refreshing = false): Promise<void> => {
      if (loadRequestInProgress.current) {
        return;
      }

      if (!user) {
        setPets([]);
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }

      loadRequestInProgress.current = true;
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

        const [diaryResponses, recordResponses] = await Promise.all([
          listDiaryEntries(),
          listRecords(),
        ]);

        const entries = diaryResponses.map(toDiaryEntry);

        const records = recordResponses.map(toRegistro);

        setPets(buildPetsWithEntries(petsFromApi, entries, records));
      } catch (error) {
        console.error("Erro ao carregar diário:", error);
      } finally {
        loadRequestInProgress.current = false;
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [user],
  );

  useEffect(() => {
    void loadDiary();
  }, [loadDiary]);

  const refresh = useCallback(
    () => loadDiary(true),
    [loadDiary],
  );

  const addPet = async (data: CreatePetData): Promise<void> => {
    if (user?.tipoUsuario !== "TUTOR") {
      return;
    }

    const newPet = await createPet(data);

    setPets((currentPets) => [newPet, ...currentPets]);
  };

  const editPet = async (petId: string, data: CreatePetData): Promise<void> => {
    if (user?.tipoUsuario !== "TUTOR") {
      return;
    }

    const updatedPet = await updatePet(petId, data);

    setPets((currentPets) =>
      updatePetInList(currentPets, petId, () => updatedPet),
    );
  };

  const removePet = async (petId: string): Promise<void> => {
    if (user?.tipoUsuario !== "TUTOR") {
      return;
    }

    await deletePet(petId);

    setPets((currentPets) => currentPets.filter((pet) => pet.id !== petId));
  };

  const addEntry = async (petId: string, text: string): Promise<void> => {
    if (user?.tipoUsuario !== "TUTOR") {
      return;
    }

    const newEntry = await createDiaryEntry(petId, text);

    setPets((currentPets) =>
      currentPets.map((pet) => {
        if (pet.id !== petId) {
          return pet;
        }

        return {
          ...pet,
          entries: [
            {
              ...newEntry,
              records: [],
            },
            ...pet.entries,
          ],
        };
      }),
    );
  };

  const updateEntry = async (
    petId: string,
    entryId: string,
    text: string,
  ): Promise<void> => {
    if (user?.tipoUsuario !== "TUTOR") {
      return;
    }

    const entry = pets
      .find((pet) => pet.id === petId)
      ?.entries.find((currentEntry) => currentEntry.id === entryId);

    if (!entry || !isDiaryEntryEditable(entry)) {
      throw new Error(
        "Este diário não pode mais ser alterado, pois pertence a um dia anterior.",
      );
    }

    const updatedEntry = await updateDiaryEntry(
      entryId,
      petId,
      entry.entryDate,
      text,
    );

    setPets((currentPets) =>
      updatePetInList(currentPets, petId, (pet) => ({
        ...pet,
        entries: pet.entries.map((entry) =>
          entry.id === entryId
            ? { ...updatedEntry, records: entry.records }
            : entry,
        ),
      })),
    );
  };

  const removeEntry = async (petId: string, entryId: string): Promise<void> => {
    if (user?.tipoUsuario !== "TUTOR") {
      return;
    }

    const entry = pets
      .find((pet) => pet.id === petId)
      ?.entries.find((currentEntry) => currentEntry.id === entryId);

    if (!entry || !isDiaryEntryEditable(entry)) {
      throw new Error(
        "Este diário não pode mais ser excluído, pois pertence a um dia anterior.",
      );
    }

    await deleteDiaryEntry(entryId);

    setPets((currentPets) =>
      currentPets.map((pet) => {
        if (pet.id !== petId) {
          return pet;
        }

        return {
          ...pet,
          entries: pet.entries.filter((entry) => entry.id !== entryId),
        };
      }),
    );
  };

  const addRecord = async (
    entryId: string,
    data: CreateRecordData,
  ): Promise<void> => {
    if (user?.tipoUsuario !== "TUTOR") {
      return;
    }

    const entry = pets
      .flatMap((pet) => pet.entries)
      .find((currentEntry) => currentEntry.id === entryId);

    if (!entry || !isDiaryEntryEditable(entry)) {
      throw new Error(
        "Só é possível criar registros no diário do dia atual.",
      );
    }

    const record = await createRecord(entryId, data);

    setPets((currentPets) =>
      updateEntryInPets(currentPets, entryId, (entry) => ({
        ...entry,
        records: [record, ...entry.records],
      })),
    );
  };

  const editRecord = async (
    entryId: string,
    recordId: string,
    data: CreateRecordData,
  ): Promise<void> => {
    if (user?.tipoUsuario !== "TUTOR") {
      return;
    }

    const entry = pets
      .flatMap((pet) => pet.entries)
      .find((currentEntry) => currentEntry.id === entryId);

    const record = entry?.records.find(
      (currentRecord) => currentRecord.id === recordId,
    );

    if (
      !entry ||
      !record ||
      !isDiaryEntryEditable(entry) ||
      !isEditableToday(record.createdAt)
    ) {
      throw new Error(
        "Este registro não pode mais ser alterado, pois pertence a um dia anterior.",
      );
    }

    const updatedRecord = await updateRecord(recordId, entryId, data);

    setPets((currentPets) =>
      updateEntryInPets(currentPets, entryId, (currentEntry) => ({
        ...currentEntry,
        records: currentEntry.records.map((currentRecord) =>
          currentRecord.id === recordId ? updatedRecord : currentRecord,
        ),
      })),
    );
  };

  const removeRecord = async (
    entryId: string,
    recordId: string,
  ): Promise<void> => {
    if (user?.tipoUsuario !== "TUTOR") {
      return;
    }

    const entry = pets
      .flatMap((pet) => pet.entries)
      .find((currentEntry) => currentEntry.id === entryId);

    const record = entry?.records.find(
      (currentRecord) => currentRecord.id === recordId,
    );

    if (
      !entry ||
      !record ||
      !isDiaryEntryEditable(entry) ||
      !isEditableToday(record.createdAt)
    ) {
      throw new Error(
        "Este registro não pode mais ser excluído, pois pertence a um dia anterior.",
      );
    }

    await deleteRecord(recordId);

    setPets((currentPets) =>
      updateEntryInPets(currentPets, entryId, (currentEntry) => ({
        ...currentEntry,
        records: currentEntry.records.filter(
          (currentRecord) => currentRecord.id !== recordId,
        ),
      })),
    );
  };

  return {
    pets,
    isLoading,
    isRefreshing,
    addPet,
    editPet,
    removePet,
    addEntry,
    updateEntry,
    removeEntry,
    addRecord,
    editRecord,
    removeRecord,
    refresh,
    isEditableToday,
    isDiaryEntryEditable,
  };
};
