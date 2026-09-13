import {
    useEffect,
    useState,
} from "react";

import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Pressable,
    ScrollView,
} from "react-native";

import { styles_th } from "../styles/theme";

import type {
    CreateRecordData,
} from "../types";

type Props = {
    visible: boolean;
    initialData?: CreateRecordData;
    onClose: () => void;
    onSubmit: (
        data: CreateRecordData,
    ) => Promise<void>;
};

const RecordFormModal = ({
    visible,
    initialData,
    onClose,
    onSubmit,
}: Props) => {
    const [
        type,
        setType,
    ] = useState("");

    const [
        subtype,
        setSubtype,
    ] = useState("");

    const [
        value,
        setValue,
    ] = useState("");

    const [
        unit,
        setUnit,
    ] = useState("");

    const [
        note,
        setNote,
    ] = useState("");

    const [
        error,
        setError,
    ] = useState("");

    const [
        isSubmitting,
        setIsSubmitting,
    ] = useState(false);

    useEffect(() => {
        setType(
            initialData?.type ?? "",
        );

        setSubtype(
            initialData?.subtype ?? "",
        );

        setValue(
            initialData?.value !==
                undefined
                ? String(initialData.value)
                : "",
        );

        setUnit(
            initialData?.unit ?? "",
        );

        setNote(
            initialData?.note ?? "",
        );

        setError("");
    }, [
        initialData,
        visible,
    ]);

    const handleSubmit =
        async (): Promise<void> => {
            const trimmedType =
                type.trim();

            if (!trimmedType) {
                setError(
                    "Informe o tipo do registro.",
                );
                return;
            }

            let numericValue:
                number | undefined;

            if (value.trim()) {
                numericValue =
                    Number(
                        value.replace(
                            ",",
                            ".",
                        ),
                    );

                if (
                    Number.isNaN(
                        numericValue,
                    )
                ) {
                    setError(
                        "Informe um valor numérico válido.",
                    );
                    return;
                }
            }

            setIsSubmitting(true);
            setError("");

            try {
                await onSubmit({
                    type: trimmedType,
                    subtype:
                        subtype.trim() ||
                        undefined,
                    value: numericValue,
                    unit:
                        unit.trim() ||
                        undefined,
                    note:
                        note.trim() ||
                        undefined,
                });

                onClose();
            } catch (requestError) {
                setError(
                    requestError instanceof
                        Error
                        ? requestError.message
                        : "Não foi possível salvar o registro.",
                );
            } finally {
                setIsSubmitting(false);
            }
        };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={() => {
                if (!isSubmitting) {
                    onClose();
                }
            }}
        >
            <View
                style={{
                    flex: 1,
                    backgroundColor:
                        "rgba(0,0,0,0.4)",
                    justifyContent: "center",
                    padding: 20,
                }}
            >
                <Pressable
                    style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                    }}
                    onPress={() => {
                        if (!isSubmitting) {
                            onClose();
                        }
                    }}
                />

                <View
                    style={{
                        backgroundColor:
                            "#fff",
                        borderRadius: 20,
                        padding: 20,
                        maxHeight: "90%",
                    }}
                >
                    <ScrollView>
                        <View
                            style={{
                                flexDirection:
                                    "row",
                                justifyContent:
                                    "space-between",
                                alignItems:
                                    "center",
                            }}
                        >
                            <Text
                                style={
                                    styles_th.title
                                }
                            >
                                {initialData
                                    ? "Editar registro"
                                    : "Novo registro"}
                            </Text>

                            <TouchableOpacity
                                onPress={
                                    onClose
                                }
                            >
                                <Text
                                    style={{
                                        fontSize: 26,
                                        color:
                                            "#777",
                                    }}
                                >
                                    ×
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            placeholder="Tipo *"
                            value={type}
                            onChangeText={setType}
                            style={[
                                styles_th.input,
                                {
                                    marginTop: 20,
                                    flex: 0,
                                },
                            ]}
                        />

                        <TextInput
                            placeholder="Subtipo"
                            value={subtype}
                            onChangeText={
                                setSubtype
                            }
                            style={[
                                styles_th.input,
                                {
                                    marginTop: 10,
                                    flex: 0,
                                },
                            ]}
                        />

                        <TextInput
                            placeholder="Valor"
                            value={value}
                            onChangeText={
                                setValue
                            }
                            keyboardType="decimal-pad"
                            style={[
                                styles_th.input,
                                {
                                    marginTop: 10,
                                    flex: 0,
                                },
                            ]}
                        />

                        <TextInput
                            placeholder="Unidade"
                            value={unit}
                            onChangeText={setUnit}
                            style={[
                                styles_th.input,
                                {
                                    marginTop: 10,
                                    flex: 0,
                                },
                            ]}
                        />

                        <TextInput
                            placeholder="Observações"
                            value={note}
                            onChangeText={setNote}
                            multiline
                            style={[
                                styles_th.input,
                                {
                                    marginTop: 10,
                                    minHeight: 100,
                                    flex: 0,
                                    textAlignVertical:
                                        "top",
                                },
                            ]}
                        />

                        {error ? (
                            <Text
                                style={{
                                    color:
                                        "#E53935",
                                    marginTop: 10,
                                }}
                            >
                                {error}
                            </Text>
                        ) : undefined}

                        <TouchableOpacity
                            disabled={
                                isSubmitting
                            }
                            onPress={() => {
                                void handleSubmit();
                            }}
                            style={[
                                styles_th.button,
                                {
                                    width:
                                        "100%",
                                    marginLeft: 0,
                                    marginTop: 20,
                                    borderRadius: 16,
                                    opacity:
                                        isSubmitting
                                            ? 0.6
                                            : 1,
                                },
                            ]}
                        >
                            <Text
                                style={{
                                    color:
                                        "#fff",
                                    fontWeight:
                                        "bold",
                                }}
                            >
                                {isSubmitting
                                    ? "Salvando..."
                                    : "Salvar"}
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default RecordFormModal;