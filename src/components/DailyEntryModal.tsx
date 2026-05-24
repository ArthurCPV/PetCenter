import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";

import { styles_th } from "../styles/theme";
import { styles_gb } from "../styles/global";

export type RecordItem = {
  id: string;
  type: string;
  subtype?: string;
  quantity?: string;
  unit?: string;
  time?: string;
  note?: string;
};

export type DailyEntryData = {
  summary?: string;
  mood?: string;
  records?: RecordItem[];
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: DailyEntryData) => void;
  initialValues?: DailyEntryData;
};

const createDefaultDraft = (): RecordItem => ({
  id: "",
  type: "Alimentação",
  subtype: "Ração",
  quantity: "",
  unit: "",
  time: "",
  note: "",
});

const subtypeOptions: Record<string, string[]> = {
  Alimentação: [
    "Natural",
    "Ração",
    "Petisco",
    "Outro",
  ],

  Comportamento: [
    "Carinhoso",
    "Agitado",
    "Ansioso",
    "Estressado",
    "Apático",
    "Agressivo",
    "Assustado",
  ],

  Atividade: [
    "Passeio",
    "Brincadeira",
    "Enriquecimento ambiental",
    "Socialização",
    "Adestramento",
  ],

    Sintoma: [
    "Vômito",
    "Diarreia",
    "Falta de apetite",
    "Coceira",
    "Febre",
    "Tosse",
    "Espirro",
    "Dor",
    "Letargia",
    "Tremores",
  ],
};

const DailyEntryModal: React.FC<Props> = ({
  visible,
  onClose,
  onSubmit,
  initialValues,
}) => {
  const [summary, setSummary] = useState("");
  const [mood, setMood] = useState("");
  const [records, setRecords] = useState<RecordItem[]>([]);

  const [showRecordModal, setShowRecordModal] =
    useState(false);

  const [recordDraft, setRecordDraft] =
    useState<RecordItem>(createDefaultDraft());

  React.useEffect(() => {
    if (visible) {
      setSummary(initialValues?.summary || "");
      setMood(initialValues?.mood || "");
      setRecords(initialValues?.records || []);
    }

    if (!visible) {
      setSummary("");
      setMood("");
      setRecords([]);
      setShowRecordModal(false);
      setRecordDraft(createDefaultDraft());
    }
  }, [visible, initialValues]);

  const validateForm = () => {
    return (
      summary.trim().length > 0 ||
      mood.trim().length > 0 ||
      records.length > 0
    );
  };

  const validateTime = (time: string) => {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return regex.test(time);
  };

  const validateRecord = () => {
    if (!recordDraft.time || !validateTime(recordDraft.time)) {
      Alert.alert(
        "Horário inválido",
        "Digite um horário válido no formato HH:MM."
      );

      return false;
    }

    if (recordDraft.type === "Alimentação") {
      if (!recordDraft.quantity?.trim()) {
        Alert.alert(
          "Quantidade obrigatória",
          "Informe a quantidade."
        );

        return false;
      }
    }

    return true;
  };

  const handleQuantityChange = (text: string) => {
    const digits = text.replace(/[^0-9]/g, "");

    if (recordDraft.subtype === "Petisco") {
      setRecordDraft((prev) => ({
        ...prev,
        quantity: digits,
      }));

      return;
    }

    const formatted = digits ? `${digits}g` : "";

    setRecordDraft((prev) => ({
      ...prev,
      quantity: formatted,
    }));
  };

  const handleTimeChange = (text: string) => {
    const digits = text.replace(/\D/g, "").slice(0, 4);

    if (digits.length <= 2) {
      setRecordDraft((prev) => ({
        ...prev,
        time: digits,
      }));
    } else {
      setRecordDraft((prev) => ({
        ...prev,
        time: `${digits.slice(0, 2)}:${digits.slice(2)}`,
      }));
    }
  };

  const resetDraft = () => {
    setRecordDraft(createDefaultDraft());
  };

  const saveRecord = () => {
    if (!validateRecord()) return;

    const id = recordDraft.id || `${Date.now()}`;

    const newRecord = {
      ...recordDraft,
      id,
    };

    setRecords((prev) => {
      const exists = prev.find((p) => p.id === id);

      if (exists) {
        return prev.map((p) =>
          p.id === id ? newRecord : p
        );
      }

      return [...prev, newRecord];
    });

    setShowRecordModal(false);
    resetDraft();
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    onSubmit({
      summary: summary.trim() || undefined,
      mood: mood.trim() || undefined,
      records,
    });

    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles_gb.modalOverlay}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <View
          style={[
            styles_gb.modalContainer,
            {
              maxHeight: "88%",
            },
          ]}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 140,
            }}
          >
            <Text style={styles_th.title}>
              Editar registro do dia
            </Text>

            <Text
              style={{
                marginTop: 22,
                marginBottom: 12,
                fontSize: 18,
                fontWeight: "700",
                color: "#333",
              }}
            >
              Registros do dia
            </Text>

            {records.length === 0 && (
              <Text
                style={{
                  color: "#777",
                  marginBottom: 14,
                }}
              >
                Nenhum registro estruturado ainda.
              </Text>
            )}

            {records.map((r) => (
              <View
                key={r.id}
                style={{
                  backgroundColor: "#fafafa",
                  padding: 14,
                  borderRadius: 12,
                  marginBottom: 10,
                }}
              >
                <Text
                  style={{
                    fontWeight: "700",
                    fontSize: 16,
                  }}
                >
                  {r.type}
                  {r.subtype
                    ? ` • ${r.subtype}`
                    : ""}
                </Text>

                {!!r.quantity && (
                  <Text style={{ marginTop: 4 }}>
                    Quantidade: {r.quantity}
                    {r.subtype === "Petisco"
                      ? " unidade(s)"
                      : ""}
                  </Text>
                )}

                {!!r.time && (
                  <Text style={{ marginTop: 4 }}>
                    Horário: {r.time}
                  </Text>
                )}

                {!!r.note && (
                  <Text style={{ marginTop: 4 }}>
                    Nota: {r.note}
                  </Text>
                )}

                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setRecordDraft(r);
                      setShowRecordModal(true);
                    }}
                  >
                    <Text style={{ color: "#007AFF" }}>
                      Editar evento
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      setRecords((prev) =>
                        prev.filter(
                          (x) => x.id !== r.id
                        )
                      )
                    }
                    style={{ marginLeft: 18 }}
                  >
                    <Text style={{ color: "#FF3B30" }}>
                      Remover
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <TouchableOpacity
              style={[
                styles_th.button,
                {
                  backgroundColor: "#eee",
                  marginTop: 8,
                },
              ]}
              onPress={() => {
                resetDraft();
                setShowRecordModal(true);
              }}
            >
              <Text
                style={[
                  styles_th.buttonText,
                  { color: "#333" },
                ]}
              >
                Adicionar evento
              </Text>
            </TouchableOpacity>

            <Text
              style={{
                marginTop: 22,
                marginBottom: 10,
                fontWeight: "700",
                color: "#666",
              }}
            >
              Resumo do dia (opcional)
            </Text>

            <TextInput
              style={[
                styles_th.input,
                {
                  minHeight: 90,
                  paddingTop: 12,
                },
              ]}
              multiline
              value={summary}
              onChangeText={setSummary}
            />

            <Text
              style={{
                marginTop: 18,
                marginBottom: 10,
                fontWeight: "700",
                color: "#666",
              }}
            >
              Humor geral (opcional)
            </Text>

            <TextInput
              style={styles_th.input}
              value={mood}
              onChangeText={setMood}
            />
          </ScrollView>

          <View
            style={{
              flexDirection: "row",
              paddingTop: 16,
              borderTopWidth: 1,
              borderColor: "#eee",
              backgroundColor: "#fff",
            }}
          >
            <TouchableOpacity
              style={[
                styles_th.button,
                {
                  flex: 1,
                  backgroundColor: "#999",
                  marginRight: 12,
                },
              ]}
              onPress={onClose}
            >
              <Text style={styles_th.buttonText}>
                Cancelar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles_th.button,
                {
                  flex: 1,
                  opacity: validateForm()
                    ? 1
                    : 0.5,
                },
              ]}
              disabled={!validateForm()}
              onPress={handleSubmit}
            >
              <Text style={styles_th.buttonText}>
                Salvar
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Modal
          visible={showRecordModal}
          transparent
          animationType="fade"
        >
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
                borderRadius: 18,
                padding: 16,
                maxHeight: "85%",
              }}
            >
              <ScrollView
                showsVerticalScrollIndicator={false}
              >
                <Text
                  style={[
                    styles_th.title,
                    {
                      fontSize: 18,
                      marginBottom: 18,
                    },
                  ]}
                >
                  {recordDraft.id
                    ? "Editar evento"
                    : "Adicionar evento"}
                </Text>

                <Text
                  style={{
                    fontWeight: "700",
                    marginBottom: 10,
                  }}
                >
                  Tipo
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    marginBottom: 18,
                  }}
                >
                  {[
                    "Alimentação",
                    "Comportamento",
                    "Atividade",
                    "Sintoma",
                  ].map((t) => (
                    <TouchableOpacity
                      key={t}
                      onPress={() =>
                        setRecordDraft((prev) => ({
                          ...prev,
                          type: t,
                          subtype:
                            subtypeOptions[t]?.[0] ||
                            "",
                        }))
                      }
                      style={{
                        paddingHorizontal: 14,
                        paddingVertical: 10,
                        borderRadius: 10,
                        marginRight: 8,
                        marginBottom: 8,
                        backgroundColor:
                          recordDraft.type === t
                            ? "#E53935"
                            : "#f0f0f0",
                      }}
                    >
                      <Text
                        style={{
                          color:
                            recordDraft.type === t
                              ? "#fff"
                              : "#333",
                        }}
                      >
                        {t}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {subtypeOptions[
                  recordDraft.type
                ] && (
                  <>
                    <Text
                      style={{
                        fontWeight: "700",
                        marginBottom: 10,
                      }}
                    >
                      Subtipo
                    </Text>

                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        marginBottom: 14,
                      }}
                    >
                      {subtypeOptions[
                        recordDraft.type
                      ].map((s) => (
                        <TouchableOpacity
                          key={s}
                          onPress={() =>
                            setRecordDraft((prev) => ({
                              ...prev,
                              subtype: s,
                            }))
                          }
                          style={{
                            paddingHorizontal: 14,
                            paddingVertical: 10,
                            borderRadius: 10,
                            marginRight: 8,
                            marginBottom: 8,
                            backgroundColor:
                              recordDraft.subtype === s
                                ? "#E53935"
                                : "#f0f0f0",
                          }}
                        >
                          <Text
                            style={{
                              color:
                                recordDraft.subtype === s
                                  ? "#fff"
                                  : "#333",
                            }}
                          >
                            {s}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    {recordDraft.type ===
                      "Alimentação" && (
                      <>
                        <Text
                          style={{
                            fontWeight: "700",
                            marginBottom: 8,
                          }}
                        >
                          Quantidade
                        </Text>

                        <TextInput
                          style={styles_th.input}
                          keyboardType="numeric"
                          value={recordDraft.quantity}
                          onChangeText={
                            handleQuantityChange
                          }
                          placeholder={
                            recordDraft.subtype ===
                            "Petisco"
                              ? "Ex: 2 unidades"
                              : "Ex: 100g"
                          }
                        />
                      </>
                    )}
                  </>
                )}

                <Text
                  style={{
                    fontWeight: "700",
                    marginTop: 16,
                    marginBottom: 8,
                  }}
                >
                  Horário
                </Text>

                <TextInput
                  style={styles_th.input}
                  keyboardType="numeric"
                  placeholder="08:30"
                  value={recordDraft.time}
                  onChangeText={handleTimeChange}
                />

                <Text
                  style={{
                    fontWeight: "700",
                    marginTop: 16,
                    marginBottom: 8,
                  }}
                >
                  Nota (opcional)
                </Text>

                <TextInput
                  style={[
                    styles_th.input,
                    {
                      minHeight: 80,
                      paddingTop: 12,
                    },
                  ]}
                  multiline
                  value={recordDraft.note}
                  onChangeText={(v) =>
                    setRecordDraft((prev) => ({
                      ...prev,
                      note: v,
                    }))
                  }
                />
              </ScrollView>

              <View
                style={{
                  flexDirection: "row",
                  marginTop: 18,
                }}
              >
                <TouchableOpacity
                  style={[
                    styles_th.button,
                    {
                      flex: 1,
                      backgroundColor: "#999",
                      marginRight: 12,
                    },
                  ]}
                  onPress={() => {
                    setShowRecordModal(false);
                    resetDraft();
                  }}
                >
                  <Text style={styles_th.buttonText}>
                    Cancelar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles_th.button,
                    { flex: 1 },
                  ]}
                  onPress={saveRecord}
                >
                  <Text style={styles_th.buttonText}>
                    Salvar evento
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default DailyEntryModal;