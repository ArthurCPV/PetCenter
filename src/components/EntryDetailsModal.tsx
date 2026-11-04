import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import type { DiaryEntry, Registro } from "../types";
import { styles_th } from "../styles/theme";
import { formatDateTime, getEntryTitle } from "../utils/date";
import ModalShell from "./ModalShell";
import OutlineButton from "./OutlineButton";

type Props = {
  visible: boolean;
  entry: DiaryEntry;
  isTutor: boolean;
  onClose: () => void;
  isEntryEditable: (entry: DiaryEntry) => boolean;
  isRecordEditable: (createdAt: Date) => boolean;
  onEditRecord: (record: Registro) => void;
  onDeleteRecord: (record: Registro) => void;
};

const EntryDetailsModal = ({
  visible,
  entry,
  isTutor,
  onClose,
  isEntryEditable,
  isRecordEditable,
  onEditRecord,
  onDeleteRecord,
}: Props) => (
  <ModalShell
    visible={visible}
    title={getEntryTitle(new Date(entry.createdAt))}
    onClose={onClose}
  >
    <ScrollView
      style={{ flexShrink: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <Text
        style={{
          marginTop: 20,
          fontSize: 16,
          lineHeight: 24,
        }}
      >
        {entry.title}
      </Text>

      <Text style={{ marginTop: 10, color: "#777" }}>
        {formatDateTime(entry.createdAt)}
      </Text>

      {entry.records.length > 0 ? (
        <View style={{ marginTop: 25 }}>
          {entry.records.map((record) => {
            const editable =
              isEntryEditable(entry) &&
              isRecordEditable(record.createdAt);

            return (
              <View
                key={record.id}
                style={{
                  marginTop: 10,
                  padding: 14,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: "#ddd",
                }}
              >
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                  {record.type}
                </Text>

                {record.subtype ? (
                  <Text style={{ marginTop: 4, color: "#555" }}>
                    Subtipo: {record.subtype}
                  </Text>
                ) : undefined}

                {record.value !== undefined ? (
                  <Text style={{ marginTop: 4, color: "#555" }}>
                    Valor: {record.value} {record.unit ?? ""}
                  </Text>
                ) : undefined}

                {record.note ? (
                  <Text style={{ marginTop: 4, color: "#555" }}>
                    {record.note}
                  </Text>
                ) : undefined}

                <Text style={{ marginTop: 6, color: "#888", fontSize: 12 }}>
                  {formatDateTime(record.createdAt)}
                </Text>

                {isTutor && editable ? (
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      marginTop: 10,
                    }}
                  >
                    <OutlineButton
                      label="✎ Editar registro"
                      onPress={() => onEditRecord(record)}
                      style={{ flex: 1, padding: 9, borderRadius: 10 }}
                    />
                    <OutlineButton
                      label="🗑 Excluir registro"
                      onPress={() => onDeleteRecord(record)}
                      color="#B71C1C"
                      style={{ flex: 1, padding: 9, borderRadius: 10 }}
                    />
                  </View>
                ) : undefined}

                {isTutor && !editable ? (
                  <Text style={{ marginTop: 10, color: "#999", fontSize: 12 }}>
                    Registro encerrado. Alterações não são mais permitidas após
                    a meia-noite.
                  </Text>
                ) : undefined}
              </View>
            );
          })}
        </View>
      ) : undefined}
    </ScrollView>

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
      onPress={onClose}
    >
      <Text style={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}>
        Fechar
      </Text>
    </TouchableOpacity>
  </ModalShell>
);

export default EntryDetailsModal;
