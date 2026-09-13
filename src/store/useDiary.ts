import { useCallback, useEffect, useState } from "react";

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

const isSameDay = (firstDate: Date, secondDate: Date): boolean => {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
};

const isRecordEditable = (createdAt: Date): boolean => {
  return isSameDay(createdAt, new Date());
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

export const useDiary = () => {
  const { user } = useAuth();

  const [pets, setPets] = useState<PetDiary[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadDiary = useCallback(
    async (refreshing = false): Promise<void> => {
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

        const [diaryResponses, recordResponses] = await Promise.all([
          listDiaryEntries(),
          listRecords(),
        ]);

        const entries = diaryResponses.map(toDiaryEntry);

        const records = recordResponses.map(
          (record): Registro => ({
            id: String(record.id),
            entryId: String(record.idDiarioEntrada),
            type: record.tipo,
            subtype: record.subtipo,
            value: record.valor,
            unit: record.unidade,
            note: record.nota,
            createdAt: new Date(record.horario),
            updatedAt: record.atualizadoEm
              ? new Date(record.atualizadoEm)
              : undefined,
          }),
        );

        setPets(buildPetsWithEntries(petsFromApi, entries, records));
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

    const newPet = await createPet(data);

    setPets((currentPets) => [newPet, ...currentPets]);
  };

  const editPet = async (petId: string, data: CreatePetData): Promise<void> => {
    if (user?.tipoUsuario !== "TUTOR") {
      return;
    }

    const updatedPet = await updatePet(petId, data);

    setPets((currentPets) =>
      currentPets.map((pet) => (pet.id === petId ? updatedPet : pet)),
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

    const updatedEntry = await updateDiaryEntry(entryId, petId, text);

    setPets((currentPets) =>
      currentPets.map((pet) => {
        if (pet.id !== petId) {
          return pet;
        }

        return {
          ...pet,
          entries: pet.entries.map((entry) =>
            entry.id === entryId
              ? {
                  ...updatedEntry,
                  records: entry.records,
                }
              : entry,
          ),
        };
      }),
    );
  };

  const removeEntry = async (petId: string, entryId: string): Promise<void> => {
    if (user?.tipoUsuario !== "TUTOR") {
      return;
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

    const record = await createRecord(entryId, data);

    setPets((currentPets) =>
      currentPets.map((pet) => ({
        ...pet,
        entries: pet.entries.map((entry) =>
          entry.id === entryId
            ? {
                ...entry,
                records: [record, ...entry.records],
              }
            : entry,
        ),
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

    if (!record || !isRecordEditable(record.createdAt)) {
      throw new Error(
        "Este registro não pode mais ser alterado, pois pertence a um dia anterior.",
      );
    }

    const updatedRecord = await updateRecord(recordId, entryId, data);

    setPets((currentPets) =>
      currentPets.map((pet) => ({
        ...pet,
        entries: pet.entries.map((currentEntry) =>
          currentEntry.id === entryId
            ? {
                ...currentEntry,
                records: currentEntry.records.map((currentRecord) =>
                  currentRecord.id === recordId ? updatedRecord : currentRecord,
                ),
              }
            : currentEntry,
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

    if (!record || !isRecordEditable(record.createdAt)) {
      throw new Error(
        "Este registro não pode mais ser excluído, pois pertence a um dia anterior.",
      );
    }

    await deleteRecord(recordId);

    setPets((currentPets) =>
      currentPets.map((pet) => ({
        ...pet,
        entries: pet.entries.map((currentEntry) =>
          currentEntry.id === entryId
            ? {
                ...currentEntry,
                records: currentEntry.records.filter(
                  (currentRecord) => currentRecord.id !== recordId,
                ),
              }
            : currentEntry,
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
    refresh: () => loadDiary(true),
    isRecordEditable,
  };
};
