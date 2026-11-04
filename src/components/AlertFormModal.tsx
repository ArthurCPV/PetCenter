import {
    useEffect,
    useState,
} from "react";

import {
    Text,
    TextInput,
    TouchableOpacity,
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
import { ALERT_TYPES } from "../constants/alerts";
import SelectDropdown from "./SelectDropdown";
import ModalShell from "./ModalShell";

type Props = {
    visible: boolean;
    pets: PetDiary[];
    onClose: () => void;
    onSubmit: (
        data: CreateAlertData,
    ) => Promise<void>;
};

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

    const petOptions = pets.map((pet) => ({
        value: pet.id,
        label: `${pet.name} · ID ${pet.id}`,
    }));

    const typeOptions = ALERT_TYPES.map((alertType) => ({
        value: alertType.value,
        label: alertType.label,
    }));

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
        <ModalShell
            visible={visible}
            title="Novo alerta"
            onClose={onClose}
            isSubmitting={isSubmitting}
        >
                    <ScrollView
                        style={{ flexShrink: 1 }}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator
                        contentContainerStyle={{
                            paddingBottom: 5,
                        }}
                    >
                        <Text
                            style={{
                                marginTop: 20,
                                fontWeight:
                                    "bold",
                            }}
                        >
                            Pet
                        </Text>

                        <SelectDropdown
                            value={selectedPetId}
                            options={petOptions}
                            onChange={setSelectedPetId}
                            placeholder="Selecionar pet"
                        />

                        <Text
                            style={{
                                marginTop: 20,
                                fontWeight:
                                    "bold",
                            }}
                        >
                            Tipo
                        </Text>

                        <SelectDropdown
                            value={type}
                            options={typeOptions}
                            onChange={(selectedValue) => {
                                const selectedType = ALERT_TYPES.find(
                                    (alertType) =>
                                        alertType.value === selectedValue,
                                );

                                if (selectedType) {
                                    setType(selectedType.value);
                                }
                            }}
                            placeholder="Selecionar tipo"
                        />

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
                            placeholder="Descrição (opcional)"
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
                            placeholder="Frequência em horas (número inteiro, opcional)"
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
                            {frequency.trim()
                                ? `O lembrete se repetirá a cada ${frequency} hora(s).`
                                : "Informe um número inteiro maior que zero. Sem frequência, o lembrete será enviado uma única vez."}
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
        </ModalShell>
    );
};

export default AlertFormModal;