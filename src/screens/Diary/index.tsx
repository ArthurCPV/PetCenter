import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Modal,
  TouchableOpacity,
} from "react-native";

import { styles_th } from "../../styles/theme";
import { useDiary } from "../../store/useDiary";

import {
  DiaryEntry,
  PetDiary,
} from "../../types";

import CreatePetModal from "../../components/CreatePetModal";
import PetCard from "../../components/PetCard";
import Form from "../../components/Form";
import EntryCard from "../../components/EntryCard";

const isSameDay = (
  dateA: Date,
  dateB: Date,
): boolean => {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
};

const getEntryTitle = (
  createdAt: Date,
): string => {
  const today = new Date();

  if (isSameDay(createdAt, today)) {
    return "Registro de hoje";
  }

  const yesterday = new Date();
  yesterday.setDate(
    yesterday.getDate() - 1,
  );

  if (isSameDay(createdAt, yesterday)) {
    return "Registro de ontem";
  }

  return `Registro de ${createdAt.toLocaleDateString()}`;
};

const Diary = () => {
  const {
    pets,
    addPet,
    addEntry,
    updateEntry,
  } = useDiary();

  const [selectedPetId, setSelectedPetId] =
    useState<string | undefined>(undefined);

  const [selectedEntry, setSelectedEntry] =
    useState<DiaryEntry | undefined>(
      undefined,
    );

  const [modalVisible, setModalVisible] =
    useState(false);

  const selectedPet: PetDiary | undefined =
    useMemo(
      () =>
        pets.find(
          (pet) => pet.id === selectedPetId,
        ),
      [pets, selectedPetId],
    );

  const todayEntry =
    selectedPet?.entries.find((entry) =>
      isSameDay(
        new Date(entry.createdAt),
        new Date(),
      ),
    );

  const handleEntrySubmit = (
    text: string,
  ) => {
    if (!selectedPet) {
      return;
    }

    if (todayEntry) {
      updateEntry(
        selectedPet.id,
        todayEntry.id,
        text,
      );

      return;
    }

    addEntry(
      selectedPet.id,
      text,
    );
  };

  return (
    <View style={styles_th.container}>
      {/* HEADER */}
      <View style={styles_th.header}>
        <Text style={styles_th.title}>
          PetCenter
        </Text>

        <Text style={styles_th.subtitle}>
          Diário inteligente do seu pet
        </Text>
      </View>

      {!selectedPet ? (
        <>
          {/* BOTÃO DE CRIAR DIÁRIO */}
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
            onPress={() =>
              setModalVisible(true)
            }
          >
            <Text
              style={{
                color: "#fff",
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              + Criar Diário
            </Text>
          </TouchableOpacity>

          {/* MODAL DE CRIAÇÃO */}
          <CreatePetModal
            visible={modalVisible}
            onClose={() =>
              setModalVisible(false)
            }
            onCreate={addPet}
          />

          {/* LISTA DE PETS */}
          <FlatList
            data={pets}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <PetCard
                pet={item}
                onPress={() =>
                  setSelectedPetId(
                    item.id,
                  )
                }
              />
            )}
            ListEmptyComponent={
              <Text
                style={styles_th.emptyText}
              >
                Nenhum diário criado ainda ✨
              </Text>
            }
          />
        </>
      ) : (
        <>
          {/* VOLTAR */}
          <TouchableOpacity
            onPress={() =>
              setSelectedPetId(
                undefined,
              )
            }
            style={{
              marginLeft: 20,
              marginBottom: 10,
            }}
          >
            <Text
              style={{
                color: "#E53935",
                fontWeight: "600",
              }}
            >
              ← Voltar
            </Text>
          </TouchableOpacity>

          {/* TÍTULO */}
          <Text
            style={[
              styles_th.sectionTitle,
              {
                fontSize: 20,
              },
            ]}
          >
            Diário de {selectedPet.name}
          </Text>

          {/* FORMULÁRIO */}
          <Form
            initialText={
              todayEntry?.title ?? ""
            }
            hasTodayEntry={
              todayEntry !== undefined
            }
            onSubmit={
              handleEntrySubmit
            }
          />

          {/* LISTA DE ENTRADAS */}
          <FlatList
            data={selectedPet.entries}
            keyExtractor={(item) =>
              item.id
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  setSelectedEntry(item)
                }
              >
                <EntryCard
                  entry={item}
                />
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text
                style={styles_th.emptyText}
              >
                Nenhum registro ainda.
              </Text>
            }
          />

          {/* MODAL DO REGISTRO */}
          <Modal
            visible={
              selectedEntry !==
              undefined
            }
            transparent
            animationType="fade"
            onRequestClose={() =>
              setSelectedEntry(
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
              <View
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 20,
                  padding: 20,
                }}
              >
                <Text
                  style={styles_th.title}
                >
                  {selectedEntry
                    ? getEntryTitle(
                      new Date(
                        selectedEntry.createdAt,
                      ),
                    )
                    : "Registro"}
                </Text>

                <Text
                  style={{
                    marginTop: 20,
                    fontSize: 16,
                    lineHeight: 24,
                  }}
                >
                  {selectedEntry?.title}
                </Text>

                <Text
                  style={{
                    marginTop: 15,
                    color: "#777",
                  }}
                >
                  {selectedEntry
                    ? new Date(
                      selectedEntry.createdAt,
                    ).toLocaleString()
                    : ""}
                </Text>

                <TouchableOpacity
                  style={[
                    styles_th.button,
                    {
                      width: "100%",
                      marginLeft: 0,
                      marginTop: 20,
                      borderRadius: 16,
                    },
                  ]}
                  onPress={() =>
                    setSelectedEntry(
                      undefined,
                    )
                  }
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                  >
                    Fechar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
};

export default Diary;