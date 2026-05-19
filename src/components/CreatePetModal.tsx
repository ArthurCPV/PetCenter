import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { styles_th, colors } from "../styles/theme";

type Props = {
  visible: boolean;
  onClose: () => void;
  onCreate: (
    name: string,
    species: string,
    breed?: string,
    birthDate?: string
  ) => void;
};

const CreatePetModal: React.FC<Props> = ({
  visible,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [birthDate, setBirthDate] = useState("");

  const handleCreate = () => {
    if (!name.trim() || !species.trim()) return;

    onCreate(name, species, breed, birthDate);

    setName("");
    setSpecies("");
    setBreed("");
    setBirthDate("");

    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.45)",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 24,
            padding: 20,
          }}
        >
          {/* BOTÃO FECHAR */}
          <TouchableOpacity
            onPress={onClose}
            style={{
              position: "absolute",
              top: 18,
              left: 18,
              zIndex: 10,
            }}
          >
            <Text
              style={{
                fontSize: 28,
                color: colors.primary,
                fontWeight: "bold",
              }}
            >
              ←
            </Text>
          </TouchableOpacity>

          {/* TÍTULO */}
          <Text
            style={[
              styles_th.title,
              {
                textAlign: "center",
                marginTop: 10,
              },
            ]}
          >
            Novo Diário
          </Text>

          {/* INPUTS */}
          <TextInput
            placeholder="Nome do pet *"
            placeholderTextColor="#999"
            style={[
              styles_th.input,
              {
                marginTop: 25,
                height: 58,
                flex: 0,
                paddingHorizontal: 15,
              },
            ]}
            value={name}
            onChangeText={setName}
          />

          <TextInput
            placeholder="Espécie *"
            placeholderTextColor="#999"
            style={[
              styles_th.input,
              {
                marginTop: 10,
                height: 58,
                flex: 0,
                paddingHorizontal: 15,
              },
            ]}
            value={species}
            onChangeText={setSpecies}
          />

          <TextInput
            placeholder="Raça"
            placeholderTextColor="#999"
            style={[
              styles_th.input,
              {
                marginTop: 10,
                height: 58,
                flex: 0,
                paddingHorizontal: 15,
              },
            ]}
            value={breed}
            onChangeText={setBreed}
          />

          <TextInput
            placeholder="Data de nascimento"
            placeholderTextColor="#999"
            style={[
              styles_th.input,
              {
                marginTop: 10,
                height: 58,
                flex: 0,
                paddingHorizontal: 15,
              },
            ]}
            value={birthDate}
            onChangeText={setBirthDate}
          />

          {/* BOTÃO */}
          <TouchableOpacity
            style={[
              styles_th.button,
              {
                width: "100%",
                marginLeft: 0,
                marginTop: 22,
                borderRadius: 18,
                height: 58,
              },
            ]}
            onPress={handleCreate}
          >
            <Text
              style={{
                color: "#fff",
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              Criar Diário
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CreatePetModal;