import React, {
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
} from "react-native";

import { styles_th } from "../styles/theme";

type Props = {
    visible: boolean;
    initialText: string;
    onClose: () => void;
    onSubmit: (
        text: string,
    ) => Promise<void>;
};

const MAX_ENTRY_LENGTH =
    1000;

const DiaryEntryEditModal = ({
    visible,
    initialText,
    onClose,
    onSubmit,
}: Props) => {
    const [
        text,
        setText,
    ] = useState(
        initialText,
    );

    const [
        error,
        setError,
    ] = useState("");

    const [
        isSubmitting,
        setIsSubmitting,
    ] = useState(false);

    useEffect(() => {
        if (visible) {
            setText(initialText);
            setError("");
        }
    }, [
        initialText,
        visible,
    ]);

    const handleSubmit =
        async (): Promise<void> => {
            const trimmedText =
                text.trim();

            if (!trimmedText) {
                setError(
                    "Escreva como seu pet está.",
                );
                return;
            }

            setIsSubmitting(true);
            setError("");

            try {
                await onSubmit(
                    trimmedText,
                );

                onClose();
            } catch (
            requestError
            ) {
                setError(
                    requestError instanceof
                        Error
                        ? requestError.message
                        : "Não foi possível editar o diário.",
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
                    }}
                >
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
                            Editar diário
                        </Text>

                        <TouchableOpacity
                            onPress={() => {
                                if (!isSubmitting) {
                                    onClose();
                                }
                            }}
                            accessibilityLabel="Fechar"
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
                                        "#777",
                                    fontWeight:
                                        "bold",
                                }}
                            >
                                ×
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        value={text}
                        onChangeText={(
                            value,
                        ) => {
                            setText(value);

                            if (error) {
                                setError("");
                            }
                        }}
                        placeholder="Como seu pet está?"
                        placeholderTextColor="#888"
                        multiline
                        maxLength={
                            MAX_ENTRY_LENGTH
                        }
                        style={{
                            width: "100%",
                            minHeight: 180,
                            marginTop: 20,
                            padding: 15,
                            borderWidth: 1,
                            borderColor:
                                error
                                    ? "#E53935"
                                    : "#C9C9C9",
                            borderRadius: 14,
                            backgroundColor:
                                "#FFFFFF",
                            color: "#222222",
                            fontSize: 16,
                            textAlignVertical:
                                "top",
                        }}
                    />

                    <Text
                        style={{
                            marginTop: 6,
                            textAlign:
                                "right",
                            color:
                                text.length >=
                                    MAX_ENTRY_LENGTH
                                    ? "#E53935"
                                    : "#777",
                            fontSize: 12,
                        }}
                    >
                        {text.length}/
                        {
                            MAX_ENTRY_LENGTH
                        }
                    </Text>

                    {error ? (
                        <Text
                            style={{
                                marginTop: 8,
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
                        style={[
                            styles_th.button,
                            {
                                width:
                                    "100%",
                                marginLeft:
                                    0,
                                marginTop:
                                    20,
                                borderRadius:
                                    16,
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
                                textAlign:
                                    "center",
                            }}
                        >
                            {isSubmitting
                                ? "Salvando..."
                                : "Salvar alterações"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default DiaryEntryEditModal;