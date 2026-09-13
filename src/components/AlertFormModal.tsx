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

import {
    styles_th,
} from "../styles/theme";

import type {
    ApiAlertType,
} from "../types/api";

import type {
    CreateAlertData,
    PetDiary,
} from "../types";

type Props = {
    visible: boolean;
    pets: PetDiary[];
    onClose: () => void;
    onSubmit: (
        data: CreateAlertData,
    ) => Promise<void>;
};

const alertTypes: Array<{
    value: ApiAlertType;
    label: string;
}> = [
        {
            value: "CONSULTA",
            label: "Consulta",
        },
        {
            value: "REMEDIO",
            label: "Remédio",
        },
        {
            value: "ALIMENTACAO",
            label: "Alimentação",
        },
        {
            value: "EXERCICIO",
            label: "Exercício",
        },
        {
            value: "OUTROS",
            label: "Outros",
        },
    ];

const toLocalDateTime =
    (
        date: Date,
    ): string => {
        const pad = (
            value: number,
        ): string =>
            String(value).padStart(
                2,
                "0",
            );

        return `${date.getFullYear()}-${pad(
            date.getMonth() + 1,
        )}-${pad(
            date.getDate(),
        )}T${pad(
            date.getHours(),
        )}:${pad(
            date.getMinutes(),
        )}:00`;
    };

const AlertFormModal = ({
    visible,
    pets,
    onClose,
    onSubmit,
}: Props) => {
    const [
        selectedPetId,
        setSelectedPetId,
    ] = useState<
        string | undefined
    >(pets[0]?.id);

    const [
        type,
        setType,
    ] =
        useState<ApiAlertType>(
            "OUTROS",
        );

    const [
        title,
        setTitle,
    ] = useState("");

    const [
        description,
        setDescription,
    ] = useState("");

    const [
        frequency,
        setFrequency,
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
        if (
            selectedPetId &&
            pets.some(
                (pet) =>
                    pet.id ===
                    selectedPetId,
            )
        ) {
            return;
        }

        setSelectedPetId(
            pets[0]?.id,
        );
    }, [
        pets,
        selectedPetId,
    ]);

    const handleSubmit =
        async (): Promise<void> => {
            if (!selectedPetId) {
                setError(
                    "Selecione um pet.",
                );
                return;
            }

            if (!title.trim()) {
                setError(
                    "Informe o título.",
                );
                return;
            }

            let frequencyHours:
                | number
                | undefined;

            if (
                frequency.trim()
            ) {
                frequencyHours =
                    Number(
                        frequency,
                    );

                if (
                    !Number.isInteger(
                        frequencyHours,
                    ) ||
                    frequencyHours <=
                    0
                ) {
                    setError(
                        "Informe uma frequência em horas válida.",
                    );
                    return;
                }
            }

            setIsSubmitting(
                true,
            );

            setError("");

            try {
                await onSubmit({
                    petId:
                        selectedPetId,
                    type,
                    title:
                        title.trim(),
                    description:
                        description.trim() ||
                        undefined,
                    startDate:
                        toLocalDateTime(
                            new Date(),
                        ),
                    frequencyHours,
                });

                setTitle("");
                setDescription("");
                setFrequency("");

                onClose();
            } catch (
            submitError
            ) {
                setError(
                    submitError instanceof
                        Error
                        ? submitError.message
                        : "Não foi possível criar o alerta.",
                );
            } finally {
                setIsSubmitting(
                    false,
                );
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
                    justifyContent:
                        "center",
                    padding: 20,
                }}
            >
                <Pressable
                    style={{
                        position:
                            "absolute",
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
                        maxHeight:
                            "90%",
                    }}
                >
                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator
                        contentContainerStyle={{
                            paddingBottom: 5,
                        }}
                    >
                        <View
                            style={{
                                flexDirection:
                                    "row",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "space-between",
                            }}
                        >
                            <Text
                                style={
                                    styles_th.title
                                }
                            >
                                Novo alerta
                            </Text>

                            <TouchableOpacity
                                onPress={() => {
                                    if (
                                        !isSubmitting
                                    ) {
                                        onClose();
                                    }
                                }}
                                style={{
                                    width: 40,
                                    height: 40,
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "center",
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 26,
                                        color:
                                            "#666",
                                        fontWeight:
                                            "bold",
                                    }}
                                >
                                    ×
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <Text
                            style={{
                                marginTop: 20,
                                fontWeight:
                                    "bold",
                            }}
                        >
                            Pet
                        </Text>

                        {pets.map(
                            (pet) => (
                                <TouchableOpacity
                                    key={
                                        pet.id
                                    }
                                    onPress={() =>
                                        setSelectedPetId(
                                            pet.id,
                                        )
                                    }
                                    style={{
                                        marginTop: 8,
                                        padding: 12,
                                        borderRadius: 12,
                                        borderWidth: 1,
                                        borderColor:
                                            selectedPetId ===
                                                pet.id
                                                ? "#E53935"
                                                : "#ccc",
                                    }}
                                >
                                    <Text>
                                        {
                                            pet.name
                                        }
                                    </Text>
                                </TouchableOpacity>
                            ),
                        )}

                        <Text
                            style={{
                                marginTop: 20,
                                fontWeight:
                                    "bold",
                            }}
                        >
                            Tipo
                        </Text>

                        {alertTypes.map(
                            (
                                alertType,
                            ) => (
                                <TouchableOpacity
                                    key={
                                        alertType.value
                                    }
                                    onPress={() =>
                                        setType(
                                            alertType.value,
                                        )
                                    }
                                    style={{
                                        marginTop: 8,
                                        padding: 12,
                                        borderRadius: 12,
                                        borderWidth: 1,
                                        borderColor:
                                            type ===
                                                alertType.value
                                                ? "#E53935"
                                                : "#ccc",
                                    }}
                                >
                                    <Text>
                                        {
                                            alertType.label
                                        }
                                    </Text>
                                </TouchableOpacity>
                            ),
                        )}

                        <TextInput
                            placeholder="Título *"
                            value={title}
                            onChangeText={(
                                value,
                            ) => {
                                setTitle(value);

                                if (
                                    value.trim()
                                ) {
                                    setError("");
                                }
                            }}
                            style={[
                                styles_th.input,
                                {
                                    marginTop: 15,
                                    flex: 0,
                                },
                            ]}
                        />

                        <TextInput
                            placeholder="Descrição"
                            value={
                                description
                            }
                            onChangeText={
                                setDescription
                            }
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

                        <TextInput
                            placeholder="Frequência em horas (opcional)"
                            value={
                                frequency
                            }
                            onChangeText={
                                setFrequency
                            }
                            keyboardType="numeric"
                            style={[
                                styles_th.input,
                                {
                                    marginTop: 10,
                                    flex: 0,
                                },
                            ]}
                        />

                        <Text
                            style={{
                                marginTop: 12,
                                color:
                                    "#777",
                                fontSize: 13,
                            }}
                        >
                            O alerta será iniciado imediatamente.
                        </Text>
                    </ScrollView>

                    {error ? (
                        <Text
                            style={{
                                marginTop: 10,
                                color:
                                    "#E53935",
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
                        style={{
                            width: "100%",
                            minHeight: 54,
                            marginTop: 15,
                            borderRadius: 16,
                            backgroundColor:
                                "#E53935",
                            alignItems:
                                "center",
                            justifyContent:
                                "center",
                            opacity:
                                isSubmitting
                                    ? 0.6
                                    : 1,
                        }}
                    >
                        <Text
                            style={{
                                color:
                                    "#FFFFFF",
                                fontWeight:
                                    "bold",
                                fontSize: 16,
                            }}
                        >
                            {isSubmitting
                                ? "Criando..."
                                : "Criar alerta"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default AlertFormModal;