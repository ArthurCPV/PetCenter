import React, { useState } from "react";
import {
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
import EntryCard from "../components/EntryCard";

type RouteParams = {
  petId: string;
};

const PetDiary = () => {
  const navigation = useNavigation<any>();
  const { params } = useRoute();
  const { petId } = (params as RouteParams) || {};

  const { pets, addEntry } = useDiary();
  const [selectedEntry, setSelectedEntry] = useState<any>(null);

  const pet = pets.find((item) => item.id === petId);

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
      <View
        style={{
          position: "relative",
          alignItems: "center",
          marginTop: 85,
          marginHorizontal: 0,
          marginBottom: 15,
          minHeight: 60,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[
            styles_gb.backCard,
            {
              position: "absolute",
              left: 0,
              width: 56,
              height: 56,   
              padding: 0,
              borderRadius: 50,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 0,
            },
          ]}
          activeOpacity={0.85}
        >
          <Text style={[styles_gb.backIcon, { fontSize: 22 }]}>‹</Text>
        </TouchableOpacity>

        <Text
          style={[
            styles_th.sectionTitle,
            {
              position: "absolute",
              top: 15,
              left: 0,
              right: 0,
              textAlign: "center",
              fontSize: 20,
            },
          ]}
        >
          Diário de {pet.name}
        </Text>
      </View>

      <View style={{ paddingHorizontal: 20, marginBottom: 28 }}>
        <Form
          onSubmit={(data) =>
            addEntry(
              pet.id,
              data.title,
              data.petAte,
              data.whatAte,
              data.petSlept,
              data.observations,
              data.concerns
            )
          }
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
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 20,
              padding: 20,
            }}
          >
            <Text style={styles_th.title}>Registro do dia</Text>

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

            {selectedEntry?.observations && (
              <View style={{ marginTop: 12 }}>
                <Text style={{ fontWeight: "600", color: "#E53935", marginBottom: 4 }}>
                  Observações:
                </Text>
                <Text style={{ fontSize: 15, color: "#333", lineHeight: 22 }}>{selectedEntry.observations}</Text>
              </View>
            )}

            {selectedEntry?.concerns && (
              <View style={{ marginTop: 12 }}>
                <Text style={{ fontWeight: "600", color: "#E53935", marginBottom: 4 }}>
                  Preocupações:
                </Text>
                <Text style={{ fontSize: 15, color: "#333", lineHeight: 22 }}>{selectedEntry.concerns}</Text>
              </View>
            )}

            {selectedEntry?.title && (
              <View style={{ marginTop: 12 }}>
                <Text style={{ fontWeight: "600", color: "#E53935", marginBottom: 4 }}>
                  Notas livres:
                </Text>
                <Text style={{ fontSize: 15, color: "#333", lineHeight: 22 }}>{selectedEntry.title}</Text>
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
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PetDiary;
