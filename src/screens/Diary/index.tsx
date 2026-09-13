import React, {
  useCallback,
  useMemo,
  useState,
} from "react";

import {
  Alert,
  BackHandler,
  View,
  Text,
  FlatList,
  Modal,
  TouchableOpacity,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import {
  useFocusEffect,
} from "@react-navigation/native";

import {
  styles_th,
} from "../../styles/theme";

import {
  useDiary,
} from "../../store/useDiary";

import {
  useAuth,
} from "../../auth/AuthContext";

import type {
  CreatePetData,
  CreateRecordData,
  DiaryEntry,
  PetDiary,
  Registro,
} from "../../types";

import CreatePetModal from "../../components/CreatePetModal";
import PetCard from "../../components/PetCard";
import Form from "../../components/Form";
import EntryCard from "../../components/EntryCard";
import RecordFormModal from "../../components/RecordFormModal";
import DiaryEntryEditModal from "../../components/DiaryEntryEditModal";

const isSameDay = (
  dateA: Date,
  dateB: Date,
): boolean => {
  return (
    dateA.getFullYear() ===
    dateB.getFullYear() &&
    dateA.getMonth() ===
    dateB.getMonth() &&
    dateA.getDate() ===
    dateB.getDate()
  );
};

const getEntryTitle = (
  createdAt: Date,
): string => {
  const today =
    new Date();

  if (
    isSameDay(
      createdAt,
      today,
    )
  ) {
    return "Registro de hoje";
  }

  const yesterday =
    new Date(today);

  yesterday.setDate(
    today.getDate() - 1,
  );

  if (
    isSameDay(
      createdAt,
      yesterday,
    )
  ) {
    return "Registro de ontem";
  }

  return `Registro de ${createdAt.toLocaleDateString(
    "pt-BR",
  )}`;
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
    isRecordEditable,
  } = useDiary();

  const { user } =
    useAuth();

  const isTutor =
    user?.tipoUsuario ===
    "TUTOR";

  const [
    selectedPetId,
    setSelectedPetId,
  ] = useState<
    string | undefined
  >(undefined);

  const [
    selectedEntryId,
    setSelectedEntryId,
  ] = useState<
    string | undefined
  >(undefined);

  const [
    createPetModalVisible,
    setCreatePetModalVisible,
  ] = useState(false);

  const [
    petBeingEdited,
    setPetBeingEdited,
  ] = useState<PetDiary | undefined>(undefined);

  const [
    recordModalVisible,
    setRecordModalVisible,
  ] = useState(false);

  const [
    recordBeingEdited,
    setRecordBeingEdited,
  ] = useState<
    Registro | undefined
  >(undefined);

  const [
    diaryEditVisible,
    setDiaryEditVisible,
  ] = useState(false);

  const [
    diaryBeingEdited,
    setDiaryBeingEdited,
  ] = useState<
    DiaryEntry | undefined
  >(undefined);

  const selectedPet =
    useMemo(
      () =>
        pets.find(
          (pet) =>
            pet.id ===
            selectedPetId,
        ),
      [
        pets,
        selectedPetId,
      ],
    );

  const selectedEntry =
    useMemo(
      () =>
        selectedPet?.entries.find(
          (entry) =>
            entry.id ===
            selectedEntryId,
        ),
      [
        selectedPet,
        selectedEntryId,
      ],
    );

  const todayEntry =
    selectedPet?.entries.find(
      (entry) =>
        isSameDay(
          new Date(
            entry.createdAt,
          ),
          new Date(),
        ),
    );

  useFocusEffect(
    useCallback(() => {
      const subscription =
        BackHandler.addEventListener(
          "hardwareBackPress",
          () => {
            if (
              recordModalVisible
            ) {
              setRecordModalVisible(
                false,
              );
              setRecordBeingEdited(
                undefined,
              );
              return true;
            }

            if (
              diaryEditVisible
            ) {
              setDiaryEditVisible(
                false,
              );
              setDiaryBeingEdited(
                undefined,
              );
              return true;
            }

            if (
              selectedEntryId !==
              undefined
            ) {
              setSelectedEntryId(
                undefined,
              );
              return true;
            }

            if (
              selectedPetId !==
              undefined
            ) {
              setSelectedPetId(
                undefined,
              );
              return true;
            }

            return false;
          },
        );

      return () =>
        subscription.remove();
    }, [
      recordModalVisible,
      diaryEditVisible,
      selectedEntryId,
      selectedPetId,
    ]),
  );

  const handleEntrySubmit =
    async (
      text: string,
    ): Promise<void> => {
      if (!selectedPet) {
        return;
      }

      if (todayEntry) {
        await updateEntry(
          selectedPet.id,
          todayEntry.id,
          text,
        );
        return;
      }

      await addEntry(
        selectedPet.id,
        text,
      );
    };

  const handleEditPet = (
    pet: PetDiary,
  ): void => {
    setPetBeingEdited(pet);
    setCreatePetModalVisible(true);
  };

  const handleSavePet = async (
    data: CreatePetData,
  ): Promise<void> => {
    if (!petBeingEdited) {
      await addPet(data);
      return;
    }

    await editPet(petBeingEdited.id, data);
    setPetBeingEdited(undefined);
  };

  const handleDeletePet = (pet: PetDiary): void => {
    Alert.alert(
      "Excluir diário do pet",
      `Tem certeza que deseja excluir o diário de ${pet.name}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            void (async () => {
              try {
                await removePet(pet.id);

                if (selectedPetId === pet.id) {
                  setSelectedPetId(undefined);
                  setSelectedEntryId(undefined);
                }
              } catch (error) {
                Alert.alert(
                  "Não foi possível excluir",
                  error instanceof Error
                    ? error.message
                    : "Não foi possível excluir o diário do pet.",
                );
              }
            })();
          },
        },
      ],
    );
  };

  const handleEditEntry =
    (
      entry: DiaryEntry,
    ): void => {
      setDiaryBeingEdited(
        entry,
      );
      setDiaryEditVisible(
        true,
      );
    };

  const handleEditDiary =
    async (
      text: string,
    ): Promise<void> => {
      if (
        !selectedPet ||
        !diaryBeingEdited
      ) {
        return;
      }

      await updateEntry(
        selectedPet.id,
        diaryBeingEdited.id,
        text,
      );
    };

  const handleDeleteEntry =
    (
      entry: DiaryEntry,
    ): void => {
      if (!selectedPet) {
        return;
      }

      Alert.alert(
        "Excluir diário",
        "Tem certeza que deseja excluir este diário?",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Excluir",
            style: "destructive",
            onPress: () => {
              void (async () => {
                try {
                  await removeEntry(
                    selectedPet.id,
                    entry.id,
                  );

                  if (
                    selectedEntryId ===
                    entry.id
                  ) {
                    setSelectedEntryId(
                      undefined,
                    );
                  }
                } catch (
                error
                ) {
                  Alert.alert(
                    "Não foi possível excluir",
                    error instanceof
                      Error
                      ? error.message
                      : "Existem registros vinculados a este diário.",
                  );
                }
              })();
            },
          },
        ],
      );
    };

  const openEditRecord =
    (
      record: Registro,
    ): void => {
      if (
        !isRecordEditable(
          record.createdAt,
        )
      ) {
        Alert.alert(
          "Registro bloqueado",
          "Este registro pertence a um dia anterior e não pode mais ser alterado.",
        );
        return;
      }

      setRecordBeingEdited(
        record,
      );

      setRecordModalVisible(
        true,
      );
    };

  const handleSaveRecord =
    async (
      data: CreateRecordData,
    ): Promise<void> => {
      if (
        !selectedEntry
      ) {
        return;
      }

      if (
        recordBeingEdited
      ) {
        await editRecord(
          selectedEntry.id,
          recordBeingEdited.id,
          data,
        );
      } else {
        await addRecord(
          selectedEntry.id,
          data,
        );
      }
    };

  const handleDeleteRecord =
    (
      record: Registro,
    ): void => {
      if (
        !selectedEntry
      ) {
        return;
      }

      if (
        !isRecordEditable(
          record.createdAt,
        )
      ) {
        Alert.alert(
          "Registro bloqueado",
          "Este registro pertence a um dia anterior e não pode mais ser excluído.",
        );
        return;
      }

      Alert.alert(
        "Excluir registro",
        "Tem certeza que deseja excluir este registro?",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Excluir",
            style: "destructive",
            onPress: () => {
              void (async () => {
                try {
                  await removeRecord(
                    selectedEntry.id,
                    record.id,
                  );
                } catch (
                error
                ) {
                  Alert.alert(
                    "Não foi possível excluir",
                    error instanceof
                      Error
                      ? error.message
                      : "Não foi possível excluir o registro.",
                  );
                }
              })();
            },
          },
        ],
      );
    };

  const handleSelectPet =
    (
      petId: string,
    ): void => {
      setSelectedEntryId(
        undefined,
      );
      setSelectedPetId(
        petId,
      );
    };

  if (isLoading) {
    return (
      <View
        style={[
          styles_th.container,
          {
            justifyContent:
              "center",
            alignItems:
              "center",
          },
        ]}
      >
        <ActivityIndicator
          size="large"
        />

        <Text
          style={{
            marginTop: 12,
            color: "#666",
          }}
        >
          Carregando diários...
        </Text>
      </View>
    );
  }

  return (
    <View
      style={
        styles_th.container
      }
    >
      <View
        style={
          styles_th.header
        }
      >
        <Text
          style={
            styles_th.title
          }
        >
          PetCenter
        </Text>

        <Text
          style={
            styles_th.subtitle
          }
        >
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
                    alignSelf:
                      "center",
                    borderRadius:
                      16,
                    marginBottom:
                      20,
                    marginLeft: 0,
                  },
                ]}
                onPress={() =>
                  setCreatePetModalVisible(
                    true,
                  )
                }
              >
                <Text
                  style={{
                    color:
                      "#fff",
                    fontWeight:
                      "bold",
                    fontSize: 16,
                  }}
                >
                  + Criar Diário
                </Text>
              </TouchableOpacity>

              <CreatePetModal
                visible={
                  createPetModalVisible
                }
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
                title={petBeingEdited ? "Editar diário do pet" : "Novo Diário"}
                submitLabel={petBeingEdited ? "Salvar alterações" : "Criar Diário"}
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
                alignSelf:
                  "center",
                marginBottom:
                  20,
              }}
            >
              <Text
                style={{
                  color:
                    "#666",
                  textAlign:
                    "center",
                }}
              >
                Aqui você pode
                consultar os
                diários dos pets.
              </Text>
            </View>
          )}

          <FlatList
            data={pets}
            keyExtractor={(
              item,
            ) =>
              item.id}
            refreshing={
              isRefreshing
            }
            onRefresh={() =>
              void refresh()
            }
            renderItem={({
              item,
            }) => (
              <PetCard
                pet={item}
                onPress={() => handleSelectPet(item.id)}
                onEdit={isTutor ? () => handleEditPet(item) : undefined}
                onDelete={isTutor ? () => handleDeletePet(item) : undefined}
              />
            )}
            ListEmptyComponent={
              <Text
                style={
                  styles_th.emptyText
                }
              >
                {isTutor
                  ? "Nenhum diário criado ainda ✨"
                  : "Nenhum pet disponível para visualização."}
              </Text>
            }
          />
        </>
      ) : (
        <>
          <TouchableOpacity
            onPress={() => {
              setSelectedEntryId(
                undefined,
              );
              setSelectedPetId(
                undefined,
              );
            }}
            style={{
              marginLeft: 20,
              marginBottom: 10,
            }}
          >
            <Text
              style={{
                color:
                  "#E53935",
                fontWeight:
                  "600",
              }}
            >
              ← Voltar
            </Text>
          </TouchableOpacity>

          <Text
            style={[
              styles_th.sectionTitle,
              {
                fontSize: 20,
              },
            ]}
          >
            Diário de{" "}
            {
              selectedPet.name
            }
          </Text>

          {isTutor ? (
            <Form
              initialText={
                todayEntry?.title ??
                ""
              }
              hasTodayEntry={
                todayEntry !==
                undefined
              }
              onSubmit={handleEntrySubmit}
            />
          ) : (
            <Text
              style={{
                marginHorizontal:
                  20,
                marginBottom:
                  15,
                color:
                  "#777",
                textAlign:
                  "center",
              }}
            >
              Modo de visualização veterinária
            </Text>
          )}

          <FlatList
            data={
              selectedPet.entries
            }
            keyExtractor={(
              item,
            ) =>
              item.id}
            renderItem={({
              item,
            }) => (
              <EntryCard
                entry={item}
                isTutor={isTutor}
                onPress={() =>
                  setSelectedEntryId(
                    item.id,
                  )
                }
                onEdit={() =>
                  handleEditEntry(
                    item,
                  )
                }
                onDelete={() =>
                  handleDeleteEntry(
                    item,
                  )
                }
              />
            )}
            ListEmptyComponent={
              <Text
                style={
                  styles_th.emptyText
                }
              >
                Nenhum registro ainda.
              </Text>
            }
          />

          <Modal
            visible={
              selectedEntry !==
              undefined
            }
            transparent
            animationType="fade"
            onRequestClose={() =>
              setSelectedEntryId(
                undefined,
              )
            }
          >
            <View
              style={{
                flex: 1,
                backgroundColor:
                  "rgba(0,0,0,0.5)",
                justifyContent:
                  "center",
                padding: 20,
              }}
            >
              <Pressable
                style={{
                  position:
                    "absolute",
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                }}
                onPress={() =>
                  setSelectedEntryId(
                    undefined,
                  )
                }
              />

              <View
                style={{
                  backgroundColor:
                    "#fff",
                  borderRadius: 20,
                  padding: 20,
                  maxHeight:
                    "90%",
                }}
              >
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                >
                  {selectedEntry ? (
                    <>
                      <Text
                        style={
                          styles_th.title
                        }
                      >
                        {getEntryTitle(
                          new Date(
                            selectedEntry.createdAt,
                          ),
                        )}
                      </Text>

                      <Text
                        style={{
                          marginTop: 20,
                          fontSize: 16,
                          lineHeight: 24,
                        }}
                      >
                        {
                          selectedEntry.title
                        }
                      </Text>

                      <Text
                        style={{
                          marginTop: 10,
                          color:
                            "#777",
                        }}
                      >
                        {new Date(
                          selectedEntry.createdAt,
                        ).toLocaleString(
                          "pt-BR",
                        )}
                      </Text>

                      {selectedEntry.records.length > 0 ? (
                        <View
                          style={{
                            marginTop: 25,
                          }}
                        >
                          {selectedEntry.records.length > 0 ? selectedEntry.records.map(
                            (
                              record,
                            ) => {
                              const editable =
                                isRecordEditable(
                                  record.createdAt,
                                );

                              return (
                                <View
                                  key={
                                    record.id
                                  }
                                  style={{
                                    marginTop: 10,
                                    padding: 14,
                                    borderRadius: 14,
                                    borderWidth: 1,
                                    borderColor:
                                      "#ddd",
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontWeight:
                                        "bold",
                                      fontSize: 16,
                                    }}
                                  >
                                    {
                                      record.type
                                    }
                                  </Text>

                                  {record.subtype ? (
                                    <Text
                                      style={{
                                        marginTop: 4,
                                        color:
                                          "#555",
                                      }}
                                    >
                                      Subtipo:{" "}
                                      {
                                        record.subtype
                                      }
                                    </Text>
                                  ) : undefined}

                                  {record.value !==
                                    undefined ? (
                                    <Text
                                      style={{
                                        marginTop: 4,
                                        color:
                                          "#555",
                                      }}
                                    >
                                      Valor:{" "}
                                      {
                                        record.value
                                      }{" "}
                                      {
                                        record.unit ??
                                        ""
                                      }
                                    </Text>
                                  ) : undefined}

                                  {record.note ? (
                                    <Text
                                      style={{
                                        marginTop: 4,
                                        color:
                                          "#555",
                                      }}
                                    >
                                      {
                                        record.note
                                      }
                                    </Text>
                                  ) : undefined}

                                  <Text
                                    style={{
                                      marginTop: 6,
                                      color:
                                        "#888",
                                      fontSize: 12,
                                    }}
                                  >
                                    {record.createdAt.toLocaleString(
                                      "pt-BR",
                                    )}
                                  </Text>

                                  {isTutor &&
                                    editable ? (
                                    <View
                                      style={{
                                        flexDirection:
                                          "row",
                                        gap: 10,
                                        marginTop: 10,
                                      }}
                                    >
                                      <TouchableOpacity
                                        onPress={() =>
                                          openEditRecord(
                                            record,
                                          )
                                        }
                                        style={{
                                          flex: 1,
                                          padding: 9,
                                          borderRadius:
                                            10,
                                          borderWidth:
                                            1,
                                          borderColor:
                                            "#E53935",
                                          alignItems:
                                            "center",
                                        }}
                                      >
                                        <Text
                                          style={{
                                            color:
                                              "#E53935",
                                            fontWeight:
                                              "bold",
                                          }}
                                        >
                                          ✎ Editar registro
                                        </Text>
                                      </TouchableOpacity>

                                      <TouchableOpacity
                                        onPress={() =>
                                          handleDeleteRecord(
                                            record,
                                          )
                                        }
                                        style={{
                                          flex: 1,
                                          padding: 9,
                                          borderRadius:
                                            10,
                                          borderWidth:
                                            1,
                                          borderColor:
                                            "#B71C1C",
                                          alignItems:
                                            "center",
                                        }}
                                      >
                                        <Text
                                          style={{
                                            color:
                                              "#B71C1C",
                                            fontWeight:
                                              "bold",
                                          }}
                                        >
                                          🗑 Excluir registro
                                        </Text>
                                      </TouchableOpacity>
                                    </View>
                                  ) : undefined}

                                  {isTutor &&
                                    !editable ? (
                                    <Text
                                      style={{
                                        marginTop: 10,
                                        color:
                                          "#999",
                                        fontSize: 12,
                                      }}
                                    >
                                      Registro encerrado. Alterações não são mais permitidas após a meia-noite.
                                    </Text>
                                  ) : undefined}
                                </View>
                              );
                            },
                          ) : undefined}
                        </View>
                      ) : undefined}
                    </>
                  ) : undefined}

                  <TouchableOpacity
                    style={[
                      styles_th.button,
                      {
                        width:
                          "100%",
                        marginLeft:
                          0,
                        marginTop:
                          20,
                        borderRadius:
                          16,
                      },
                    ]}
                    onPress={() =>
                      setSelectedEntryId(
                        undefined,
                      )
                    }
                  >
                    <Text
                      style={{
                        color:
                          "#fff",
                        fontWeight:
                          "bold",
                        textAlign:
                          "center",
                      }}
                    >
                      Fechar
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </View>
          </Modal>

          <RecordFormModal
            visible={
              recordModalVisible
            }
            initialData={
              recordBeingEdited
                ? {
                  type:
                    recordBeingEdited.type,
                  subtype:
                    recordBeingEdited.subtype,
                  value:
                    recordBeingEdited.value,
                  unit:
                    recordBeingEdited.unit,
                  note:
                    recordBeingEdited.note,
                }
                : undefined
            }
            onClose={() => {
              setRecordModalVisible(
                false,
              );
              setRecordBeingEdited(
                undefined,
              );
            }}
            onSubmit={
              handleSaveRecord
            }
          />

          <DiaryEntryEditModal
            visible={
              diaryEditVisible
            }
            initialText={
              diaryBeingEdited?.title ??
              ""
            }
            onClose={() => {
              setDiaryEditVisible(
                false,
              );
              setDiaryBeingEdited(
                undefined,
              );
            }}
            onSubmit={
              handleEditDiary
            }
          />
        </>
      )}
    </View>
  );
};

export default Diary;