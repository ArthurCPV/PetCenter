import { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { styles_th } from "../styles/theme";

import type { CreatePetData } from "../types";

type Props = {
  visible: boolean;
  onClose: () => void;
  onCreate: (data: CreatePetData) => void;
};

const CreatePetModal = ({
  visible,
  onClose,
  onCreate,
}: Props) => {
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [birthDate, setBirthDate] = useState("");

  const [breedUnknown, setBreedUnknown] = useState(false);
  const [birthDateUnknown, setBirthDateUnknown] = useState(false);

  const [nameError, setNameError] = useState("");
  const [speciesError, setSpeciesError] = useState("");

  const resetForm = () => {
    setName("");
    setSpecies("");
    setBreed("");
    setBirthDate("");

    setBreedUnknown(false);
    setBirthDateUnknown(false);

    setNameError("");
    setSpeciesError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleBreedUnknown = () => {
    setBreedUnknown((currentValue) => !currentValue);
    setBreed("");
  };

  const handleBirthDateUnknown = () => {
    setBirthDateUnknown((currentValue) => !currentValue);
    setBirthDate("");
  };

  const handleCreate = () => {
    const trimmedName = name.trim();
    const trimmedSpecies = species.trim();

    const hasNameError = trimmedName.length === 0;
    const hasSpeciesError = trimmedSpecies.length === 0;

    setNameError(
      hasNameError
        ? "Informe o nome do seu pet."
        : ""
    );

    setSpeciesError(
      hasSpeciesError
        ? "Informe a espécie do seu pet."
        : ""
    );

    if (hasNameError || hasSpeciesError) {
      return;
    }

    const data: CreatePetData = {
      name: trimmedName,
      species: trimmedSpecies,
      breed: breedUnknown
        ? "Raça desconhecida"
        : breed.trim() || undefined,
      birthDate: birthDateUnknown
        ? "Data de nascimento desconhecida"
        : birthDate.trim() || undefined,
    };

    onCreate(data);

    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
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
          {/* CABEÇALHO DO MODAL */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles_th.title}>
              Novo Diário
            </Text>

            <TouchableOpacity
              onPress={handleClose}
              accessibilityLabel="Fechar"
              style={{
                width: 40,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 26,
                  color: "#666",
                  fontWeight: "bold",
                }}
              >
                ×
              </Text>
            </TouchableOpacity>
          </View>

          {/* NOME */}
          <TextInput
            placeholder="Nome do pet"
            value={name}
            onChangeText={(value) => {
              setName(value);

              if (value.trim()) {
                setNameError("");
              }
            }}
            style={[
              styles_th.input,
              {
                marginTop: 20,
                height: 60,
                flex: 0,
                paddingHorizontal: 15,
                borderColor: nameError
                  ? "#E53935"
                  : undefined,
                borderWidth: nameError ? 1 : undefined,
              },
            ]}
          />

          {nameError ? (
            <Text
              style={{
                color: "#E53935",
                marginTop: 5,
                marginLeft: 5,
              }}
            >
              {nameError}
            </Text>
          ) : null}

          {/* ESPÉCIE */}
          <TextInput
            placeholder="Espécie (ex: Cachorro, Gato)"
            value={species}
            onChangeText={(value) => {
              setSpecies(value);

              if (value.trim()) {
                setSpeciesError("");
              }
            }}
            style={[
              styles_th.input,
              {
                marginTop: 10,
                height: 60,
                flex: 0,
                paddingHorizontal: 15,
                borderColor: speciesError
                  ? "#E53935"
                  : undefined,
                borderWidth: speciesError ? 1 : undefined,
              },
            ]}
          />

          {speciesError ? (
            <Text
              style={{
                color: "#E53935",
                marginTop: 5,
                marginLeft: 5,
              }}
            >
              {speciesError}
            </Text>
          ) : null}

          {/* RAÇA */}
          <TextInput
            placeholder="Raça (Ex: Labrador, Siamês)"
            value={breed}
            onChangeText={setBreed}
            editable={!breedUnknown}
            style={[
              styles_th.input,
              {
                marginTop: 10,
                height: 60,
                flex: 0,
                paddingHorizontal: 15,
                opacity: breedUnknown ? 0.5 : 1,
              },
            ]}
          />

          <TouchableOpacity
            onPress={handleBreedUnknown}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 8,
              marginLeft: 5,
            }}
          >
            <View
              style={{
                width: 22,
                height: 22,
                borderWidth: 2,
                borderColor: "#777",
                borderRadius: 5,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: breedUnknown
                  ? "#777"
                  : "#fff",
              }}
            >
              {breedUnknown ? (
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  ✓
                </Text>
              ) : null}
            </View>

            <Text
              style={{
                marginLeft: 8,
                color: "#555",
              }}
            >
              Não sei a raça
            </Text>
          </TouchableOpacity>

          <TextInput
            placeholder="Data de nascimento (DD/MM/AAAA)"
            value={birthDate}
            onChangeText={setBirthDate}
            editable={!birthDateUnknown}
            style={[
              styles_th.input,
              {
                marginTop: 10,
                height: 60,
                flex: 0,
                paddingHorizontal: 15,
                opacity: birthDateUnknown ? 0.5 : 1,
              },
            ]}
          />

          <TouchableOpacity
            onPress={handleBirthDateUnknown}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 8,
              marginLeft: 5,
            }}
          >
            <View
              style={{
                width: 22,
                height: 22,
                borderWidth: 2,
                borderColor: "#777",
                borderRadius: 5,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: birthDateUnknown
                  ? "#777"
                  : "#fff",
              }}
            >
              {birthDateUnknown ? (
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  ✓
                </Text>
              ) : null}
            </View>

            <Text
              style={{
                marginLeft: 8,
                color: "#555",
              }}
            >
              Não sei a data de nascimento
            </Text>
          </TouchableOpacity>

          {/* CRIAR */}
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
            onPress={handleCreate}
          >
            <Text
              style={{
                color: "#fff",
                fontWeight: "bold",
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