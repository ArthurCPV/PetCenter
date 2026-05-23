import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { styles_th } from "../styles/theme";
import { styles_gb } from "../styles/global";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    petAte?: string;
    whatAte?: string;
    petSlept?: string;
    observations?: string;
    concerns?: string;
  }) => void;
};

const DailyEntryModal: React.FC<Props> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [petAte, setPetAte] = useState("");
  const [whatAte, setWhatAte] = useState("");
  const [petSlept, setPetSlept] = useState("");
  const [observations, setObservations] = useState("");
  const [concerns, setConcerns] = useState("");
  const [freeText, setFreeText] = useState("");

  const validateForm = () => {
    return !!(
      petAte.trim() ||
      whatAte.trim() ||
      petSlept.trim() ||
      observations.trim() ||
      concerns.trim() ||
      freeText.trim()
    );
  };

  const resetForm = () => {
    setPetAte("");
    setWhatAte("");
    setPetSlept("");
    setObservations("");
    setConcerns("");
    setFreeText("");
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    onSubmit({
      title: freeText || "Registro do dia",
      petAte: petAte.trim() || undefined,
      whatAte: whatAte.trim() || undefined,
      petSlept: petSlept.trim() || undefined,
      observations: observations.trim() || undefined,
      concerns: concerns.trim() || undefined,
    });

    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles_gb.modalOverlay}>
        <ScrollView
          style={styles_gb.modalContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles_th.title}>Registro do Dia</Text>

          <Text
            style={{
              marginTop: 20,
              marginBottom: 12,
              fontSize: 14,
              fontWeight: "600",
              color: "#666",
            }}
          >
            Quanto o pet comeu? <Text style={{ color: "#999" }}>(opcional)</Text>
          </Text>
          <TextInput
            style={styles_th.input}
            placeholder="Ex: 2 xícaras, uma tigela..."
            value={petAte}
            onChangeText={setPetAte}
          />

          <Text
            style={{
              marginTop: 16,
              marginBottom: 12,
              fontSize: 14,
              fontWeight: "600",
              color: "#666",
            }}
          >
            O que comeu? <Text style={{ color: "#999" }}>(opcional)</Text>
          </Text>
          <TextInput
            style={styles_th.input}
            placeholder="Ex: ração, carne, cenoura..."
            value={whatAte}
            onChangeText={setWhatAte}
          />

          <Text
            style={{
              marginTop: 16,
              marginBottom: 12,
              fontSize: 14,
              fontWeight: "600",
              color: "#666",
            }}
          >
            Quanto dormiu? <Text style={{ color: "#999" }}>(opcional)</Text>
          </Text>
          <TextInput
            style={styles_th.input}
            placeholder="Ex: 8 horas, o dia todo..."
            value={petSlept}
            onChangeText={setPetSlept}
          />

          <Text
            style={{
              marginTop: 16,
              marginBottom: 12,
              fontSize: 14,
              fontWeight: "600",
              color: "#666",
            }}
          >
            Observações <Text style={{ color: "#999" }}>(opcional)</Text>
          </Text>
          <TextInput
            style={[styles_th.input, { minHeight: 80, paddingTop: 12 }]}
            placeholder="Comportamento, atividades do dia..."
            multiline
            value={observations}
            onChangeText={setObservations}
          />

          <Text
            style={{
              marginTop: 16,
              marginBottom: 12,
              fontSize: 14,
              fontWeight: "600",
              color: "#666",
            }}
          >
            Preocupações <Text style={{ color: "#999" }}>(opcional)</Text>
          </Text>
          <TextInput
            style={[styles_th.input, { minHeight: 80, paddingTop: 12 }]}
            placeholder="Sintomas, mudanças de comportamento..."
            multiline
            value={concerns}
            onChangeText={setConcerns}
          />

          <Text
            style={{
              marginTop: 16,
              marginBottom: 12,
              fontSize: 14,
              fontWeight: "600",
              color: "#666",
            }}
          >
            Escrever livremente <Text style={{ color: "#999" }}>(opcional)</Text>
          </Text>
          <TextInput
            style={[styles_th.input, { minHeight: 100, paddingTop: 12 }]}
            placeholder="Escreva o que quiser sobre o seu pet..."
            multiline
            value={freeText}
            onChangeText={setFreeText}
          />

          <View
            style={{
              flexDirection: "row",
              gap: 12,
              marginTop: 20,
              marginBottom: 40,
            }}
          >
            <TouchableOpacity
              style={[styles_th.button, { flex: 1, backgroundColor: "#999" }]}
              onPress={handleClose}
            >
              <Text style={styles_th.buttonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles_th.button,
                { flex: 1, opacity: validateForm() ? 1 : 0.5 },
              ]}
              onPress={handleSubmit}
              disabled={!validateForm()}
            >
              <Text style={styles_th.buttonText}>Registrar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default DailyEntryModal;
