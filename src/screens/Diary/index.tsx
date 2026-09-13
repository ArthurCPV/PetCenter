import React, {
  useCallback,
  useMemo,
  useState,
} from "react";

import {
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

import { useFocusEffect } from "@react-navigation/native";

import { styles_th } from "../../styles/theme";
import { useDiary } from "../../store/useDiary";
import { useAuth } from "../../auth/AuthContext";

import type {
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

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (isSameDay(createdAt, yesterday)) {
    return "Registro de ontem";
  }

  return `Registro de ${createdAt.toLocaleDateString("pt-BR")}`;
};

const Diary = () => {
  const {
    pets,
    addPet,
    addEntry,
    updateEntry,
    isLoading,
    isRefreshing,
    refresh,
  } = useDiary();

  const { user } = useAuth();

  const isTutor = user?.tipoUsuario === "TUTOR";

  const [selectedPetId, setSelectedPetId] =
    useState<string | undefined>(undefined);

  const [selectedEntry, setSelectedEntry] =
    useState<DiaryEntry | undefined>(undefined);

  const [modalVisible, setModalVisible] = useState(false);

  const selectedPet: PetDiary | undefined = useMemo(
    () =>
      pets.find((pet) => pet.id === selectedPetId),
    [pets, selectedPetId],
  );

  const todayEntry = selectedPet?.entries.find((entry) =>
    isSameDay(
      new Date(entry.createdAt),
      new Date(),
    ),
  );

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          if (selectedEntry !== undefined) {
            setSelectedEntry(undefined);
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
    }, [selectedEntry, selectedPetId]),
  );

  const handleEntrySubmit = (text: string) => {
    if (!selectedPet) {
      return;
    }

    if (todayEntry) {
      void updateEntry(
        selectedPet.id,
        todayEntry.id,
        text,
      );
      return;
    }

    void addEntry(selectedPet.id, text);
  };

  const handleSelectPet = (petId: string) => {
    setSelectedEntry(undefined);
    setSelectedPetId(petId);
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles_th.container,
          {
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <ActivityIndicator size="large" />
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
                onPress={() => setModalVisible(true)}
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

              <CreatePetModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onCreate={addPet}
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
              <Text
                style={{
                  color: "#666",
                  textAlign: "center",
                }}
              >
                Aqui você pode consultar os diários dos pets.
              </Text>
            </View>
          )}

          <FlatList
            data={pets}
            keyExtractor={(item) => item.id}
            refreshing={isRefreshing}
            onRefresh={() => void refresh()}
            renderItem={({ item }) => (
              <PetCard
                pet={item}
                onPress={() => handleSelectPet(item.id)}
              />
            )}
            ListEmptyComponent={
              <Text style={styles_th.emptyText}>
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
              setSelectedEntry(undefined);
              setSelectedPetId(undefined);
            }}
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

          <Text
            style={[
              styles_th.sectionTitle,
              { fontSize: 20 },
            ]}
          >
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

          <FlatList
            data={selectedPet.entries}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setSelectedEntry(item)}
              >
                <EntryCard entry={item} />
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles_th.emptyText}>
                Nenhum registro ainda.
              </Text>
            }
          />

          <Modal
            visible={selectedEntry !== undefined}
            transparent
            animationType="fade"
            onRequestClose={() => setSelectedEntry(undefined)}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.5)",
                justifyContent: "center",
                padding: 20,
              }}
            >
              <Pressable
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                }}
                onPress={() => setSelectedEntry(undefined)}
              />

              <View
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 20,
                  padding: 20,
                  maxHeight: "85%",
                }}
              >
                <Text style={styles_th.title}>
                  {selectedEntry
                    ? getEntryTitle(new Date(selectedEntry.createdAt))
                    : "Registro"}
                </Text>

                <ScrollView
                  style={{ marginTop: 20 }}
                  showsVerticalScrollIndicator
                >
                  <Text
                    style={{
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
                      ).toLocaleString("pt-BR")
                      : ""}
                  </Text>
                </ScrollView>

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
                  onPress={() => setSelectedEntry(undefined)}
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
