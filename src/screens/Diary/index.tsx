import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { useAuth } from "../../auth/AuthContext";
import CreatePetModal from "../../components/CreatePetModal";
import DiaryTextModal from "../../components/DiaryTextModal";
import EntryCard from "../../components/EntryCard";
import EntryDetailsModal from "../../components/EntryDetailsModal";
import Form from "../../components/Form";
import PetCard from "../../components/PetCard";
import PetFilter from "../../components/PetFilter";
import RecordFormModal from "../../components/RecordFormModal";
import { styles_th } from "../../styles/theme";
import { useDiary } from "../../store/useDiary";
import type {
  CreatePetData,
  CreateRecordData,
  DiaryEntry,
  PetDiary,
  Registro,
} from "../../types";
import { isToday } from "../../utils/date";

const confirmDelete = (
  title: string,
  message: string,
  onConfirm: () => Promise<void>,
  errorTitle: string,
  errorMessage: string,
): void => {
  Alert.alert(title, message, [
    { text: "Cancelar", style: "cancel" },
    {
      text: "Excluir",
      style: "destructive",
      onPress: () => {
        void onConfirm().catch((error: unknown) => {
          Alert.alert(
            errorTitle,
            error instanceof Error ? error.message : errorMessage,
          );
        });
      },
    },
  ]);
};

const Diary = () => {
  const {
    pets,
    addPet,
    editPet,
    removePet,
    addEntry,
    updateEntry,
    removeEntry,
    addRecord,
    editRecord,
    removeRecord,
    isLoading,
    isRefreshing,
    refresh,
    isEditableToday,
    isDiaryEntryEditable,
  } = useDiary();
  const { user } = useAuth();
  const isTutor = user?.tipoUsuario === "TUTOR";

  const [selectedPetId, setSelectedPetId] = useState<string>();
  const [petSearch, setPetSearch] = useState("");
  const [selectedPetFilterId, setSelectedPetFilterId] = useState<string>();
  const [selectedEntryId, setSelectedEntryId] = useState<string>();
  const [createPetModalVisible, setCreatePetModalVisible] = useState(false);
  const [petBeingEdited, setPetBeingEdited] = useState<PetDiary>();
  const [recordModalVisible, setRecordModalVisible] = useState(false);
  const [recordBeingEdited, setRecordBeingEdited] = useState<Registro>();
  const [diaryEditVisible, setDiaryEditVisible] = useState(false);
  const [diaryBeingEdited, setDiaryBeingEdited] = useState<DiaryEntry>();

  const selectedPet = useMemo(
    () => pets.find((pet) => pet.id === selectedPetId),
    [pets, selectedPetId],
  );
  const selectedEntry = useMemo(
    () => selectedPet?.entries.find((entry) => entry.id === selectedEntryId),
    [selectedPet, selectedEntryId],
  );
  const todayEntry = selectedPet?.entries.find((entry) =>
    isToday(entry.entryDate),
  );
  const filteredPets = useMemo(() => {
    const query = petSearch.trim().toLocaleLowerCase();

    return pets.filter((pet) => {
      const matchesPet =
        selectedPetFilterId === undefined || pet.id === selectedPetFilterId;
      const matchesSearch =
        !query ||
        pet.name.toLocaleLowerCase().includes(query) ||
        pet.id.toLocaleLowerCase().includes(query);

      return matchesPet && matchesSearch;
    });
  }, [pets, petSearch, selectedPetFilterId]);

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          if (recordModalVisible) {
            setRecordModalVisible(false);
            setRecordBeingEdited(undefined);
            return true;
          }

          if (diaryEditVisible) {
            setDiaryEditVisible(false);
            setDiaryBeingEdited(undefined);
            return true;
          }

          if (selectedEntryId !== undefined) {
            setSelectedEntryId(undefined);
            return true;
          }

          if (selectedPetId !== undefined) {
            setSelectedPetId(undefined);
            return true;
          }

          return false;
        },
      );

      return () => subscription.remove();
    }, [
      diaryEditVisible,
      recordModalVisible,
      selectedEntryId,
      selectedPetId,
    ]),
  );

  useFocusEffect(
    useCallback(() => {
      void refresh();
      const interval = setInterval(() => {
        void refresh();
      }, 10_000);

      return () => clearInterval(interval);
    }, [refresh]),
  );

  const handleEntrySubmit = async (text: string): Promise<void> => {
    if (!selectedPet) {
      return;
    }

    if (todayEntry) {
      await updateEntry(selectedPet.id, todayEntry.id, text);
      return;
    }

    await addEntry(selectedPet.id, text);
  };

  const handleEditPet = (pet: PetDiary): void => {
    setPetBeingEdited(pet);
    setCreatePetModalVisible(true);
  };

  const handleSavePet = async (data: CreatePetData): Promise<void> => {
    if (!petBeingEdited) {
      await addPet(data);
      return;
    }

    await editPet(petBeingEdited.id, data);
    setPetBeingEdited(undefined);
  };

  const handleDeletePet = (pet: PetDiary): void => {
    confirmDelete(
      "Excluir diário do pet",
      `Tem certeza que deseja excluir o diário de ${pet.name}?`,
      async () => {
        await removePet(pet.id);

        if (selectedPetId === pet.id) {
          setSelectedPetId(undefined);
          setSelectedEntryId(undefined);
        }
      },
      "Não foi possível excluir",
      "Não foi possível excluir o diário do pet.",
    );
  };

  const handleEditEntry = (entry: DiaryEntry): void => {
    if (!isDiaryEntryEditable(entry)) {
      Alert.alert(
        "Diário encerrado",
        "Este diário pertence a um dia anterior e não pode mais ser alterado.",
      );
      return;
    }

    setDiaryBeingEdited(entry);
    setDiaryEditVisible(true);
  };

  const handleEditDiary = async (text: string): Promise<void> => {
    if (!selectedPet || !diaryBeingEdited) {
      return;
    }

    await updateEntry(selectedPet.id, diaryBeingEdited.id, text);
  };

  const handleDeleteEntry = (entry: DiaryEntry): void => {
    if (!selectedPet) {
      return;
    }

    if (!isDiaryEntryEditable(entry)) {
      Alert.alert(
        "Diário encerrado",
        "Este diário pertence a um dia anterior e não pode mais ser excluído.",
      );
      return;
    }

    confirmDelete(
      "Excluir diário",
      "Tem certeza que deseja excluir este diário?",
      async () => {
        await removeEntry(selectedPet.id, entry.id);

        if (selectedEntryId === entry.id) {
          setSelectedEntryId(undefined);
        }
      },
      "Não foi possível excluir",
      "Existem registros vinculados a este diário.",
    );
  };

  const openEditRecord = (record: Registro): void => {
    if (
      !selectedEntry ||
      !isDiaryEntryEditable(selectedEntry) ||
      !isEditableToday(record.createdAt)
    ) {
      Alert.alert(
        "Registro bloqueado",
        "Este registro pertence a um dia anterior e não pode mais ser alterado.",
      );
      return;
    }

    setRecordBeingEdited(record);
    setRecordModalVisible(true);
  };

  const handleSaveRecord = async (
    data: CreateRecordData,
  ): Promise<void> => {
    if (!selectedEntry) {
      return;
    }

    if (recordBeingEdited) {
      await editRecord(selectedEntry.id, recordBeingEdited.id, data);
    } else {
      await addRecord(selectedEntry.id, data);
    }
  };

  const handleDeleteRecord = (record: Registro): void => {
    if (!selectedEntry) {
      return;
    }

    if (
      !isDiaryEntryEditable(selectedEntry) ||
      !isEditableToday(record.createdAt)
    ) {
      Alert.alert(
        "Registro bloqueado",
        "Este registro pertence a um dia anterior e não pode mais ser excluído.",
      );
      return;
    }

    confirmDelete(
      "Excluir registro",
      "Tem certeza que deseja excluir este registro?",
      () => removeRecord(selectedEntry.id, record.id),
      "Não foi possível excluir",
      "Não foi possível excluir o registro.",
    );
  };

  const handleSelectPet = (petId: string): void => {
    setSelectedEntryId(undefined);
    setSelectedPetId(petId);
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles_th.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 12, color: "#666" }}>
          Carregando diários...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles_th.container}>
      <View style={styles_th.header}>
        <Text style={styles_th.title}>PetCenter</Text>
        <Text style={styles_th.subtitle}>
          {isTutor
            ? "Diário inteligente do seu pet"
            : "Visualização veterinária dos pets"}
        </Text>
      </View>

      {!selectedPet ? (
        <>
          {isTutor ? (
            <>
              <TouchableOpacity
                style={[
                  styles_th.button,
                  {
                    width: "90%",
                    alignSelf: "center",
                    borderRadius: 16,
                    marginBottom: 20,
                    marginLeft: 0,
                  },
                ]}
                onPress={() => setCreatePetModalVisible(true)}
              >
                <Text
                  style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}
                >
                  + Criar Diário
                </Text>
              </TouchableOpacity>

              <CreatePetModal
                visible={createPetModalVisible}
                initialData={
                  petBeingEdited
                    ? {
                        name: petBeingEdited.name,
                        species: petBeingEdited.species,
                        breed: petBeingEdited.breed,
                        birthDate: petBeingEdited.birthDate,
                      }
                    : undefined
                }
                title={
                  petBeingEdited ? "Editar diário do pet" : "Novo Diário"
                }
                submitLabel={
                  petBeingEdited ? "Salvar alterações" : "Criar Diário"
                }
                onClose={() => {
                  setCreatePetModalVisible(false);
                  setPetBeingEdited(undefined);
                }}
                onCreate={handleSavePet}
              />
            </>
          ) : (
            <View
              style={{
                width: "90%",
                alignSelf: "center",
                marginBottom: 20,
              }}
            >
              <Text style={{ color: "#666", textAlign: "center" }}>
                Aqui você pode consultar os diários dos pets.
              </Text>
            </View>
          )}

          {!isTutor && pets.length > 0 ? (
            <PetFilter
              pets={pets}
              search={petSearch}
              selectedPetId={selectedPetFilterId}
              onSearchChange={setPetSearch}
              onPetChange={setSelectedPetFilterId}
            />
          ) : undefined}

          <FlatList<PetDiary>
            data={isTutor ? pets : filteredPets}
            keyExtractor={(item) => item.id}
            refreshing={isRefreshing}
            onRefresh={() => void refresh()}
            renderItem={({ item }) => (
              <PetCard
                pet={item}
                onPress={() => handleSelectPet(item.id)}
                onEdit={isTutor ? () => handleEditPet(item) : undefined}
                onDelete={isTutor ? () => handleDeletePet(item) : undefined}
              />
            )}
            ListEmptyComponent={
              <Text style={styles_th.emptyText}>
                {isTutor
                  ? "Nenhum diário criado ainda ✨"
                  : petSearch || selectedPetFilterId
                    ? "Nenhum pet corresponde à busca."
                    : "Nenhum pet disponível para visualização."}
              </Text>
            }
          />
        </>
      ) : (
        <>
          <TouchableOpacity
            onPress={() => {
              setSelectedEntryId(undefined);
              setSelectedPetId(undefined);
            }}
          >
            <Text style={{ color: "#E53935", fontWeight: "600" }}>
              ← Voltar
            </Text>
          </TouchableOpacity>

          <Text style={[styles_th.sectionTitle, { fontSize: 20 }]}>
            Diário de {selectedPet.name}
          </Text>

          {isTutor ? (
            <Form
              initialText={todayEntry?.title ?? ""}
              hasTodayEntry={todayEntry !== undefined}
              onSubmit={handleEntrySubmit}
            />
          ) : (
            <Text
              style={{
                marginHorizontal: 20,
                marginBottom: 15,
                color: "#777",
                textAlign: "center",
              }}
            >
              Modo de visualização veterinária
            </Text>
          )}

          <FlatList<DiaryEntry>
            data={selectedPet.entries}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <EntryCard
                entry={item}
                isTutor={isTutor}
                isEditable={isDiaryEntryEditable(item)}
                onPress={() => setSelectedEntryId(item.id)}
                onEdit={() => handleEditEntry(item)}
                onDelete={() => handleDeleteEntry(item)}
              />
            )}
            ListEmptyComponent={
              <Text style={styles_th.emptyText}>Nenhum registro ainda.</Text>
            }
          />

          {selectedEntry ? (
            <EntryDetailsModal
              visible
              entry={selectedEntry}
              isTutor={isTutor}
              onClose={() => setSelectedEntryId(undefined)}
              isRecordEditable={isEditableToday}
              isEntryEditable={isDiaryEntryEditable}
              onEditRecord={openEditRecord}
              onDeleteRecord={handleDeleteRecord}
            />
          ) : undefined}

          <RecordFormModal
            visible={recordModalVisible}
            initialData={
              recordBeingEdited
                ? {
                    type: recordBeingEdited.type,
                    subtype: recordBeingEdited.subtype,
                    value: recordBeingEdited.value,
                    unit: recordBeingEdited.unit,
                    note: recordBeingEdited.note,
                  }
                : undefined
            }
            onClose={() => {
              setRecordModalVisible(false);
              setRecordBeingEdited(undefined);
            }}
            onSubmit={handleSaveRecord}
          />

          <DiaryTextModal
            visible={diaryEditVisible}
            title="Editar diário"
            initialText={diaryBeingEdited?.title ?? ""}
            textPlaceholder="Escreva aqui como seu pet está..."
            submitLabel="Salvar alterações"
            validationMessage="Escreva como seu pet está."
            onClose={() => {
              setDiaryEditVisible(false);
              setDiaryBeingEdited(undefined);
            }}
            onSubmit={handleEditDiary}
          />
        </>
      )}
    </View>
  );
};

export default Diary;
