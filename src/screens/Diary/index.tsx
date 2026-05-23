import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { styles_th } from "../../styles/theme";
import { styles_gb } from "../../styles/global";

import { useDiary } from "../../store/useDiary";

import CreatePetModal from "../../components/CreatePetModal";
import PetCard from "../../components/PetCard";

const Diary = () => {
  const navigation = useNavigation<any>();
  const { pets, addPet } = useDiary();

  // ✅ controle do modal
  const [modalVisible, setModalVisible] = useState(false);


  return (
    <View style={styles_th.screen}>
      {/* HEADER */}
      <View style={styles_gb.header}>
        <Text style={[styles_th.title,{marginTop: 65}]}>PetCenter</Text>

        <Text style={[styles_th.subtitle, {marginBottom: 30}]}>
          Diário inteligente do seu pet
        </Text>
      </View>

      {/* ========================================= */}
      {/* LISTA DE DIÁRIOS */}
      {/* ========================================= */}

      <>
        {/* BOTÃO DE ABRIR MODAL */}
        <TouchableOpacity
          style={[
            styles_th.button,
            styles_gb.fullButton,
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

        {/* MODAL */}
        <CreatePetModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onCreate={addPet}
        />

        {/* LISTA DE PETS */}
        <FlatList
          data={pets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PetCard
              pet={item}
              onPress={() => navigation.navigate("PetDiary", { petId: item.id })}
            />
          )}
          ListEmptyComponent={
            <Text style={styles_th.emptyText}>
              Nenhum diário criado ainda.
            </Text>
          }
        />
      </>
    </View>
  );
};

export default Diary;