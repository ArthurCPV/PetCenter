import React, { useState, useEffect, useRef } from "react";
import {
  Animated,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

import { styles_th } from "../styles/theme";
import { styles_gb } from "../styles/global";

import { useDiary } from "../store/useDiary";
import Form from "../components/Form";
import DailyEntryModal from "../components/DailyEntryModal";
import EntryCard from "../components/EntryCard";

type RouteParams = {
  petId: string;
};

const PetDiary = () => {
  const navigation = useNavigation<any>();
  const { params } = useRoute();
  const { petId } = (params as RouteParams) || {};

  const { pets, addEntry, editEntry, getEntryForDate } = useDiary();
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const [showTodayEntryWarning, setShowTodayEntryWarning] = useState(false);
  const modalScale = useRef(new Animated.Value(0)).current;

  const pet = pets.find((item) => item.id === petId);
  const todayEntry = pet ? getEntryForDate(pet.id, new Date()) : undefined;

  useEffect(() => {
    if (selectedEntry) {
      Animated.spring(modalScale, {
        toValue: 1,
        friction: 8,
        tension: 80,
        useNativeDriver: true,
      }).start();
    } else {
      modalScale.setValue(0);
    }
  }, [selectedEntry, modalScale]);

  const handleFormOpenAttempt = (hasTodayEntry: boolean) => {
    if (!hasTodayEntry) return;
    setShowTodayEntryWarning(true);
  };

  if (!pet) {
    return (
      <View style={styles_th.screen}>
        <View style={styles_gb.header}>
          <Text style={styles_th.title}>Pet não encontrado</Text>
          <Text style={styles_th.subtitle}>Volte e selecione um pet existente.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles_th.screen}>
      <View style={[styles_gb.header, { marginTop: 28, paddingHorizontal: 14, paddingBottom: 12 }]}> 
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 18 }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
            style={[
              styles_gb.backCard,
              {
                width: 56,
                height: 56,
                padding: 0,
                borderRadius: 18,
                justifyContent: "center",
                alignItems: "center",
                marginRight: 10,
                marginLeft: 0,
              },
            ]}
            activeOpacity={0.85}
          >
            <Text style={[styles_gb.backIcon, { fontSize: 22 }]}>‹</Text>
          </TouchableOpacity>

          <View style={{ position: "absolute", left: 0, right: 0, alignItems: "center" }}>
            <Text
              style={[
                styles_th.sectionTitle,
                {
                  fontSize: 22,
                  marginBottom: 10,
                  marginHorizontal: 0,
                  textAlign: "center",
                },
              ]}
              pointerEvents="none"
            >
              Diário de {pet.name}
            </Text>
          </View>
        </View>
      </View>
      <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
        <Text style={[styles_th.subtitle, { lineHeight: 22 }]}>Registre uma única entrada por dia. Edite o registro de hoje sempre que precisar.</Text>
      </View>

      <View style={{ paddingHorizontal: 20, marginBottom: showTodayEntryWarning ? 12 : 0 }}>
        {showTodayEntryWarning && (
          <View
            style={{
              backgroundColor: "#FFF1F1",
              borderRadius: 18,
              borderWidth: 1,
              borderColor: "#F4C2C2",
              padding: 18,
              marginBottom: 16,
            }}
          >
            <Text style={{ color: "#E53935", fontWeight: "700", fontSize: 15, marginBottom: 8 }}>
              Registro diário já existe
            </Text>
            <Text style={{ color: "#555", fontSize: 14, lineHeight: 20, marginBottom: 16 }}>
              Você já registrou o dia de hoje. Edite o registro existente ou cancele para voltar.
            </Text>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity
                style={[styles_th.button, { flex: 1, backgroundColor: "#E53935" }]}
                onPress={() => setShowTodayEntryWarning(false)}
                activeOpacity={0.85}
              >
                <Text style={styles_th.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles_th.button, { flex: 1, backgroundColor: "#4CAF50" }]}
                onPress={() => {
                  setEditModalVisible(true);
                  setShowTodayEntryWarning(false);
                }}
                activeOpacity={0.85}
              >
                <Text style={styles_th.buttonText}>Editar registro</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <View style={{ paddingHorizontal: 20, marginBottom: 0, marginTop: 20 }}>
        <Form
          initialValues={todayEntry}
          onOpenAttempt={handleFormOpenAttempt}
          onSubmit={(data) => {
            const todayEntry = getEntryForDate(
              pet.id,
              new Date()
            );

            if (todayEntry) {
              editEntry(pet.id, todayEntry.id, {
                summary: data.summary,
                mood: data.mood,
                records: data.records,
              });
            } else {
              addEntry(
                pet.id,
                "",
                "",
                "",
                "",
                "",
                data.summary,
                data.mood,
                data.records
              );
            }
          }}
        />
      </View>

      <FlatList
        data={pet.entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedEntry(item)}>
            <EntryCard entry={item} />
          </TouchableOpacity>
        )}
        style={{ marginTop: 22 }}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={
          <Text style={styles_th.emptyText}>
            Nenhum registro ainda.
          </Text>
        }
      />

      <Modal visible={!!selectedEntry} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <Animated.View
            style={[
              {
                backgroundColor: "#fff",
                borderRadius: 20,
                padding: 20,
              },
              {
                transform: [{ scale: modalScale }],
                opacity: modalScale,
              },
            ]}
          >
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    backgroundColor: "#FCE4EC",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 12,
                  }}
                >
                  <Text style={{ fontSize: 22 }}>📝</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles_th.title, { fontSize: 20, marginBottom: 4 }]}> {selectedEntry?.title || "Registro do dia"} </Text>
                  <Text style={{ color: "#777", fontSize: 13, lineHeight: 18 }}>
                    {selectedEntry && new Date().toDateString() === new Date(selectedEntry.createdAt).toDateString()
                      ? "Visualize seus detalhes e edite o registro de hoje."
                      : "Visualize os detalhes do registro antigo."}
                  </Text>
                </View>
              </View>
              {selectedEntry && new Date().toDateString() === new Date(selectedEntry.createdAt).toDateString() && (
                <View
                  style={{
                    backgroundColor: "#E53935",
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 12,
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}>
                    HOJE
                  </Text>
                </View>
              )}
            </View>

            {selectedEntry?.petAte && (
              <View style={{ marginTop: 20 }}>
                <Text style={{ fontWeight: "600", color: "#E53935", marginBottom: 4 }}>
                  Quanto comeu:
                </Text>
                <Text style={{ fontSize: 15, color: "#333" }}>{selectedEntry.petAte}</Text>
              </View>
            )}

            {selectedEntry?.whatAte && (
              <View style={{ marginTop: 12 }}>
                <Text style={{ fontWeight: "600", color: "#E53935", marginBottom: 4 }}>
                  O que comeu:
                </Text>
                <Text style={{ fontSize: 15, color: "#333" }}>{selectedEntry.whatAte}</Text>
              </View>
            )}

            {selectedEntry?.petSlept && (
              <View style={{ marginTop: 12 }}>
                <Text style={{ fontWeight: "600", color: "#E53935", marginBottom: 4 }}>
                  Quanto dormiu:
                </Text>
                <Text style={{ fontSize: 15, color: "#333" }}>{selectedEntry.petSlept}</Text>
              </View>
            )}

            {(selectedEntry?.summary || selectedEntry?.observations) && (
              <View style={{ marginTop: 12 }}>
                <Text style={{ fontWeight: "600", color: "#E53935", marginBottom: 4 }}>
                  Resumo do dia:
                </Text>
                <Text style={{ fontSize: 15, color: "#333", lineHeight: 22 }}>{selectedEntry.summary || selectedEntry.observations}</Text>
              </View>
            )}

            {selectedEntry?.mood && (
              <View style={{ marginTop: 12 }}>
                <Text style={{ fontWeight: "600", color: "#E53935", marginBottom: 4 }}>
                  Humor geral:
                </Text>
                <Text style={{ fontSize: 15, color: "#333", lineHeight: 22 }}>{selectedEntry.mood}</Text>
              </View>
            )}

            {selectedEntry?.records && selectedEntry.records.length ? (
              <View style={{ marginTop: 12 }}>
                <Text style={{ fontWeight: "600", color: "#E53935", marginBottom: 8 }}>Registros estruturados</Text>
                {selectedEntry.records.map((r: any) => (
                  <View key={r.id} style={{ marginBottom: 8, padding: 8, backgroundColor: "#fafafa", borderRadius: 8 }}>
                    <Text style={{ fontWeight: "700" }}>{r.type}{r.subtype ? ` • ${r.subtype}` : ""}</Text>
                    {r.quantity ? <Text>Quantidade: {r.subtype === 'Petisco' ? `${r.quantity} unidade(s)` : `${r.quantity} g`}</Text> : null}
                    {r.time ? <Text>Horário: {r.time}</Text> : null}
                    {r.note ? <Text>Nota: {r.note}</Text> : null}
                  </View>
                ))}
              </View>
            ) : null}

            {selectedEntry?.concerns && (
              <View style={{ marginTop: 12 }}>
                <Text style={{ fontWeight: "600", color: "#E53935", marginBottom: 4 }}>
                  Preocupações:
                </Text>
                <Text style={{ fontSize: 15, color: "#333", lineHeight: 22 }}>{selectedEntry.concerns}</Text>
              </View>
            )}

            

            <Text
              style={{
                marginTop: 15,
                color: "#777",
                fontSize: 13,
              }}
            >
              {selectedEntry?.createdAt
                ? new Date(selectedEntry.createdAt).toLocaleString("pt-BR")
                : ""}
            </Text>

            {/* Edit button only if entry is from today */}
            {selectedEntry && new Date().toDateString() === new Date(selectedEntry.createdAt).toDateString() && (
              <TouchableOpacity
                style={[
                  styles_th.button,
                  {
                    width: "100%",
                    marginLeft: 0,
                    marginTop: 12,
                    borderRadius: 16,
                    backgroundColor: "#4CAF50",
                  },
                ]}
                onPress={() => {
                  setEditingEntry(selectedEntry);
                  setEditModalVisible(true);
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  Editar
                </Text>
              </TouchableOpacity>
            )}

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
              onPress={() => setSelectedEntry(null)}
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
          </Animated.View>
        </View>
      </Modal>

      <DailyEntryModal
        visible={editModalVisible}
        initialValues={editingEntry ? {
          summary: editingEntry.summary || editingEntry.observations,
          mood: editingEntry.mood,
          records: editingEntry.records,
        } : undefined}
        onClose={() => {
          setEditModalVisible(false);
          setEditingEntry(null);
        }}
        onSubmit={(data) => {
          if (editingEntry) {
            editEntry(pet.id, editingEntry.id, {
              summary: data.summary,
              mood: data.mood,
              records: data.records,
            });
          }}}
      />
    </View>
  );
};

export default PetDiary;
