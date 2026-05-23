import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { styles_th, colors } from "../styles/theme";
import { styles_gb } from "../styles/global";

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
  const [nameError, setNameError] = useState("");
  const [speciesError, setSpeciesError] = useState("");
  const [birthDateError, setBirthDateError] = useState("");

  const validateDate = (formatted: string) => {
    // Expecting dd/mm/yyyy when full
    const digits = formatted.replace(/\D/g, "");
    if (digits.length === 8) {
      const day = Number(digits.slice(0, 2));
      const month = Number(digits.slice(2, 4));
      const year = Number(digits.slice(4, 8));
      if (month < 1 || month > 12) return false;
      if (day < 1 || day > 31) return false;
      if (year < 1800 || year > 2100) return false;
    }
    return true;
  };

  const handleCreate = () => {
    let hasError = false;
    if (!name.trim()) {
      setNameError("Por favor, preencha o nome do pet.");
      hasError = true;
    }
    if (!species.trim()) {
      setSpeciesError("Por favor, preencha a espécie.");
      hasError = true;
    }
    if (birthDate) {
      // if user typed letters they were blocked, but double-check
      if (/[^0-9/]/.test(birthDate)) {
        setBirthDateError("Apenas números são permitidos na data.");
        hasError = true;
      } else if (!validateDate(birthDate)) {
        setBirthDateError("Data inválida. Use dd/mm/yyyy.");
        hasError = true;
      }
    }

    if (hasError) return;

    onCreate(name, species, breed, birthDate);

    setName("");
    setSpecies("");
    setBreed("");
    setBirthDate("");
    setNameError("");
    setSpeciesError("");
    setBirthDateError("");

    onClose();
  };

  const formatBirthDate = (text: string) => {
    // If user tries to enter letters, show error and ignore them
    if (/[A-Za-zÀ-ÿ]/.test(text)) {
      setBirthDateError("Apenas números são permitidos na data.");
      // remove letters
      text = text.replace(/[A-Za-zÀ-ÿ]/g, "");
    } else {
      setBirthDateError("");
    }

    // Keep only digits
    const digits = text.replace(/\D/g, "").slice(0, 8);

    let formatted = digits;
    if (digits.length > 4) {
      formatted = `${digits.slice(0,2)}/${digits.slice(2,4)}/${digits.slice(4)}`;
    } else if (digits.length > 2) {
      formatted = `${digits.slice(0,2)}/${digits.slice(2)}`;
    }

    setBirthDate(formatted);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={styles_gb.modalOverlay}
      >
        <View
          style={styles_gb.modalContainer}
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
            onChangeText={(t) => { setName(t); if (t.trim()) setNameError(""); }}
          />
          {nameError ? (
            <Text style={{ color: "#d9534f", marginTop: 6 }}>{nameError}</Text>
          ) : null}

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
            onChangeText={(t) => { setSpecies(t); if (t.trim()) setSpeciesError(""); }}
          />
          {speciesError ? (
            <Text style={{ color: "#d9534f", marginTop: 6 }}>{speciesError}</Text>
          ) : null}

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
            onChangeText={formatBirthDate}
            keyboardType="numeric"
          />
          {birthDateError ? (
            <Text style={{ color: "#d9534f", marginTop: 6 }}>{birthDateError}</Text>
          ) : null}

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