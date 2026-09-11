import { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";

import { styles_th } from "../styles/theme";

import type { CreatePetData } from "../types";

type Props = {
  visible: boolean;
  onClose: () => void;
  onCreate: (data: CreatePetData) => void;
};

const isValidBirthDate = (value: string): boolean => {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    return false;
  }

  const [dayText, monthText, yearText] =
    value.split("/");

  const day = Number(dayText);
  const month = Number(monthText);
  const year = Number(yearText);

  if (
    day < 1 ||
    month < 1 ||
    month > 12 ||
    year < 1
  ) {
    return false;
  }

  const date = new Date(
    year,
    month - 1,
    day,
  );

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

const formatBirthDate = (
  value: string,
): string => {
  const numbersOnly = value
    .replace(/\D/g, "")
    .slice(0, 8);

  if (numbersOnly.length <= 2) {
    return numbersOnly;
  }

  if (numbersOnly.length <= 4) {
    return `${numbersOnly.slice(
      0,
      2,
    )}/${numbersOnly.slice(2)}`;
  }

  return `${numbersOnly.slice(
    0,
    2,
  )}/${numbersOnly.slice(2, 4)}/${numbersOnly.slice(
    4,
  )}`;
};

const CreatePetModal = ({
  visible,
  onClose,
  onCreate,
}: Props) => {
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [birthDate, setBirthDate] =
    useState("");

  const [breedUnknown, setBreedUnknown] =
    useState(false);

  const [
    birthDateUnknown,
    setBirthDateUnknown,
  ] = useState(false);

  const [nameError, setNameError] =
    useState("");

  const [speciesError, setSpeciesError] =
    useState("");

  const [breedError, setBreedError] =
    useState("");

  const [
    birthDateError,
    setBirthDateError,
  ] = useState("");

  const resetForm = () => {
    setName("");
    setSpecies("");
    setBreed("");
    setBirthDate("");

    setBreedUnknown(false);
    setBirthDateUnknown(false);

    setNameError("");
    setSpeciesError("");
    setBreedError("");
    setBirthDateError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleBreedUnknown = () => {
    setBreedUnknown((currentValue) => !currentValue);
    setBreed("");
    setBreedError("");
  };

  const handleBirthDateUnknown = () => {
    setBirthDateUnknown(
      (currentValue) => !currentValue,
    );

    setBirthDate("");
    setBirthDateError("");
  };

  const handleBirthDateChange = (
    value: string,
  ) => {
    const formattedValue =
      formatBirthDate(value);

    setBirthDate(formattedValue);

    if (formattedValue.length === 10) {
      if (isValidBirthDate(formattedValue)) {
        setBirthDateError("");
      } else {
        setBirthDateError(
          "Informe uma data de nascimento válida.",
        );
      }
    } else {
      setBirthDateError("");
    }
  };

  const handleCreate = () => {
    const trimmedName = name.trim();
    const trimmedSpecies = species.trim();
    const trimmedBreed = breed.trim();

    const hasNameError =
      trimmedName.length === 0;

    const hasSpeciesError =
      trimmedSpecies.length === 0;

    const hasBreedError =
      !breedUnknown &&
      trimmedBreed.length === 0;

    const hasBirthDateError =
      !birthDateUnknown &&
      !isValidBirthDate(birthDate);

    setNameError(
      hasNameError
        ? "Informe o nome do seu pet."
        : "",
    );

    setSpeciesError(
      hasSpeciesError
        ? "Informe a espécie do seu pet."
        : "",
    );

    setBreedError(
      hasBreedError
        ? 'Informe a raça ou marque "Não sei a raça".'
        : "",
    );

    setBirthDateError(
      hasBirthDateError
        ? birthDate.length === 0
          ? 'Informe a data de nascimento ou marque "Não sei a data de nascimento".'
          : "Informe uma data de nascimento válida."
        : "",
    );

    if (
      hasNameError ||
      hasSpeciesError ||
      hasBreedError ||
      hasBirthDateError
    ) {
      return;
    }

    const data: CreatePetData = {
      name: trimmedName,
      species: trimmedSpecies,
      breed: breedUnknown
        ? "Raça desconhecida"
        : trimmedBreed,
      birthDate: birthDateUnknown
        ? "Data de nascimento desconhecida"
        : birthDate,
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
        {/* FUNDO CLICÁVEL */}
        <Pressable
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          }}
          onPress={handleClose}
        />

        {/* POPUP */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 20,
            padding: 20,
          }}
        >
          {/* CABEÇALHO */}
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
                borderWidth: nameError
                  ? 2
                  : undefined,
              },
            ]}
          />

          {nameError ? (
            <Text
              style={{
                color: "#E53935",
                marginTop: 5,
                marginLeft: 5,
                fontSize: 14,
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
                borderWidth: speciesError
                  ? 2
                  : undefined,
              },
            ]}
          />

          {speciesError ? (
            <Text
              style={{
                color: "#E53935",
                marginTop: 5,
                marginLeft: 5,
                fontSize: 14,
              }}
            >
              {speciesError}
            </Text>
          ) : null}

          {/* RAÇA */}
          <TextInput
            placeholder="Raça (ex: Labrador, Siamês)"
            value={breed}
            onChangeText={(value) => {
              setBreed(value);

              if (value.trim()) {
                setBreedError("");
              }
            }}
            editable={!breedUnknown}
            style={[
              styles_th.input,
              {
                marginTop: 10,
                height: 60,
                flex: 0,
                paddingHorizontal: 15,
                opacity: breedUnknown ? 0.5 : 1,
                borderColor: breedError
                  ? "#E53935"
                  : undefined,
                borderWidth: breedError
                  ? 2
                  : undefined,
              },
            ]}
          />

          {breedError ? (
            <Text
              style={{
                color: "#E53935",
                marginTop: 5,
                marginLeft: 5,
                fontSize: 14,
              }}
            >
              {breedError}
            </Text>
          ) : null}

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
                backgroundColor:
                  breedUnknown
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

          {/* DATA DE NASCIMENTO */}
          <TextInput
            placeholder="Data de nascimento (DD/MM/AAAA)"
            value={birthDate}
            onChangeText={
              handleBirthDateChange
            }
            editable={!birthDateUnknown}
            keyboardType="numeric"
            maxLength={10}
            style={[
              styles_th.input,
              {
                marginTop: 10,
                height: 60,
                flex: 0,
                paddingHorizontal: 15,
                opacity: birthDateUnknown
                  ? 0.5
                  : 1,
                borderColor: birthDateError
                  ? "#E53935"
                  : undefined,
                borderWidth: birthDateError
                  ? 2
                  : undefined,
              },
            ]}
          />

          {birthDateError ? (
            <Text
              style={{
                color: "#E53935",
                marginTop: 5,
                marginLeft: 5,
                fontSize: 14,
              }}
            >
              {birthDateError}
            </Text>
          ) : null}

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
                backgroundColor:
                  birthDateUnknown
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