import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { styles_th } from "../styles/theme";

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

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.4)",
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
          <Text style={styles_th.title}>Novo Diário</Text>

          <TextInput
            placeholder="Nome do pet"
            style={[styles_th.input, { marginTop: 20, height: 60, flex: 0, paddingHorizontal: 15 }]}
            value={name}
            onChangeText={setName}
          />

          <TextInput
            placeholder="Espécie"
            style={[styles_th.input, { marginTop: 10, height: 60, flex: 0, paddingHorizontal: 15 }]}
            value={species}
            onChangeText={setSpecies}
          />

          <TextInput
            placeholder="Raça"
            style={[styles_th.input, { marginTop: 10, height: 60, flex: 0, paddingHorizontal: 15 }]}
            value={breed}
            onChangeText={setBreed}
          />

          <TextInput
            placeholder="Data de nascimento"
            style={[styles_th.input, { marginTop: 10, height: 60, flex: 0, paddingHorizontal: 15 }]}
            value={birthDate}
            onChangeText={setBirthDate}
          />

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
            onPress={() => {
              onCreate(name, species, breed, birthDate);

              setName("");
              setSpecies("");
              setBreed("");
              setBirthDate("");

              onClose();
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              Criar Diário
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CreatePetModal;