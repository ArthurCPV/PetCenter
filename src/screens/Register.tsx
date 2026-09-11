import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import {
  createVeterinarianProfile,
  login,
  registerUser,
} from "../api/auth";
import type { UserRole } from "../auth/AuthContext";
import { styles_th } from "../styles/theme";
import type { HomeStack } from "../types/navigation";

type NavigationProp = NativeStackNavigationProp<HomeStack, "Login">;

type FieldErrors = {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  crmv: string;
  especialidade: string;
  descricao: string;
};

const emptyErrors: FieldErrors = {
  nome: "",
  email: "",
  senha: "",
  telefone: "",
  crmv: "",
  especialidade: "",
  descricao: "",
};

/**
 * Mantém somente os números do telefone.
 */
const onlyPhoneNumbers = (value: string): string => {
  return value.replace(/\D/g, "").slice(0, 11);
};

/**
 * Formata automaticamente números de telefone brasileiros.
 *
 * Exemplos:
 * 11999999999 -> (11) 99999-9999
 * 1133334444  -> (11) 3333-4444
 */
const formatPhone = (value: string): string => {
  const numbers = onlyPhoneNumbers(value);

  if (numbers.length === 0) {
    return "";
  }

  if (numbers.length <= 2) {
    return `(${numbers}`;
  }

  if (numbers.length <= 7) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  }

  /*
   * Com 11 dígitos, consideramos celular:
   * (XX) XXXXX-XXXX
   */
  if (numbers.length === 11) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(
      2,
      7,
    )}-${numbers.slice(7)}`;
  }

  /*
   * Com 10 dígitos, consideramos telefone fixo:
   * (XX) XXXX-XXXX
   */
  return `(${numbers.slice(0, 2)}) ${numbers.slice(
    2,
    6,
  )}-${numbers.slice(6)}`;
};

const Register = () => {
  const navigation = useNavigation<NavigationProp>();

  const [role, setRole] = useState<UserRole>("TUTOR");

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [telefone, setTelefone] = useState("");

  const [crmv, setCrmv] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [descricao, setDescricao] = useState("");

  const [fieldErrors, setFieldErrors] =
    useState<FieldErrors>(emptyErrors);

  const [requestError, setRequestError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearFieldError = (field: keyof FieldErrors) => {
    setFieldErrors((current) => ({
      ...current,
      [field]: "",
    }));

    setRequestError("");
  };

  const validateForm = (): boolean => {
    const errors: FieldErrors = {
      ...emptyErrors,
    };

    const trimmedNome = nome.trim();
    const trimmedEmail = email.trim();
    const phoneNumbers = onlyPhoneNumbers(telefone);
    const trimmedCrmv = crmv.trim();
    const trimmedEspecialidade =
      especialidade.trim();
    const trimmedDescricao = descricao.trim();

    if (!trimmedNome) {
      errors.nome = "Informe seu nome.";
    } else if (
      trimmedNome.length < 3 ||
      trimmedNome.length > 100
    ) {
      errors.nome =
        "O nome deve ter entre 3 e 100 caracteres.";
    }

    if (!trimmedEmail) {
      errors.email = "Informe seu e-mail.";
    } else {
      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(trimmedEmail)) {
        errors.email =
          "Informe um e-mail válido.";
      } else if (trimmedEmail.length > 150) {
        errors.email =
          "O e-mail deve ter no máximo 150 caracteres.";
      }
    }

    if (!senha) {
      errors.senha = "Informe sua senha.";
    } else if (
      senha.length < 6 ||
      senha.length > 8
    ) {
      errors.senha =
        "A senha deve ter entre 6 e 8 caracteres.";
    }

    if (!phoneNumbers) {
      errors.telefone =
        "Informe seu telefone.";
    } else if (
      phoneNumbers.length !== 10 &&
      phoneNumbers.length !== 11
    ) {
      errors.telefone =
        "Informe um telefone válido com DDD.";
    }

    if (role === "VETERINARIO") {
      if (!trimmedCrmv) {
        errors.crmv = "Informe seu CRMV.";
      } else if (
        trimmedCrmv.length < 4 ||
        trimmedCrmv.length > 20
      ) {
        errors.crmv =
          "O CRMV deve ter entre 4 e 20 caracteres.";
      }

      if (!trimmedEspecialidade) {
        errors.especialidade =
          "Informe sua especialidade.";
      } else if (
        trimmedEspecialidade.length < 3 ||
        trimmedEspecialidade.length > 100
      ) {
        errors.especialidade =
          "A especialidade deve ter entre 3 e 100 caracteres.";
      }

      if (
        trimmedDescricao &&
        (trimmedDescricao.length < 10 ||
          trimmedDescricao.length > 500)
      ) {
        errors.descricao =
          "A descrição deve ter entre 10 e 500 caracteres.";
      }
    }

    setFieldErrors(errors);

    const hasErrors = Object.values(errors).some(
      (message) => message !== "",
    );

    return !hasErrors;
  };

  const handleRegister = async () => {
    setRequestError("");

    if (!validateForm()) {
      return;
    }

    const trimmedNome = nome.trim();
    const trimmedEmail = email.trim();

    /*
     * A API recebe o telefone sem os caracteres da máscara.
     *
     * Exemplo:
     * "(11) 99999-9999"
     *          ↓
     * "11999999999"
     */
    const phoneNumbers =
      onlyPhoneNumbers(telefone);

    const trimmedCrmv = crmv.trim();
    const trimmedEspecialidade =
      especialidade.trim();
    const trimmedDescricao = descricao.trim();

    setIsSubmitting(true);

    try {
      await registerUser({
        nome: trimmedNome,
        email: trimmedEmail,
        senha,
        telefone: phoneNumbers,
        tipoUsuario: role,
      });

      if (role === "VETERINARIO") {
        /*
         * O backend exige autenticação para POST /api/veterinarios.
         * Como acabamos de criar o usuário veterinário,
         * fazemos login antes de criar o perfil profissional.
         */
        await login({
          email: trimmedEmail,
          senha,
        });

        await createVeterinarianProfile({
          crmv: trimmedCrmv,
          especialidade: trimmedEspecialidade,
          descricao:
            trimmedDescricao || undefined,
        });
      }

      navigation.navigate("Login");
    } catch (requestError) {
      setRequestError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível criar a conta.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 25,
      }}
    >
      <Text style={styles_th.title}>
        Criar conta
      </Text>

      <Text
        style={{
          marginTop: 20,
          marginBottom: 10,
          fontWeight: "600",
        }}
      >
        Tipo de conta
      </Text>

      <View
        style={{
          flexDirection: "row",
          gap: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setRole("TUTOR");
            setFieldErrors(emptyErrors);
            setRequestError("");
          }}
          style={{
            flex: 1,
            padding: 14,
            borderRadius: 12,
            borderWidth: 1,
            borderColor:
              role === "TUTOR"
                ? "#E53935"
                : "#ccc",
            alignItems: "center",
          }}
        >
          <Text>Tutor</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setRole("VETERINARIO");
            setFieldErrors(emptyErrors);
            setRequestError("");
          }}
          style={{
            flex: 1,
            padding: 14,
            borderRadius: 12,
            borderColor:
              role === "VETERINARIO"
                ? "#E53935"
                : "#ccc",
            borderWidth: 1,
            alignItems: "center",
          }}
        >
          <Text>Veterinário</Text>
        </TouchableOpacity>
      </View>

      {/* NOME */}
      <TextInput
        placeholder="Nome"
        value={nome}
        onChangeText={(value) => {
          setNome(value);
          clearFieldError("nome");
        }}
        style={[
          styles_th.input,
          {
            marginTop: 15,
            flex: 0,
            borderColor: fieldErrors.nome
              ? "#E53935"
              : undefined,
          },
        ]}
      />

      {fieldErrors.nome ? (
        <Text
          style={{
            marginTop: 5,
            color: "#E53935",
          }}
        >
          {fieldErrors.nome}
        </Text>
      ) : null}

      {/* EMAIL */}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(value) => {
          setEmail(value);
          clearFieldError("email");
        }}
        autoCapitalize="none"
        keyboardType="email-address"
        style={[
          styles_th.input,
          {
            marginTop: 10,
            flex: 0,
            borderColor: fieldErrors.email
              ? "#E53935"
              : undefined,
          },
        ]}
      />

      {fieldErrors.email ? (
        <Text
          style={{
            marginTop: 5,
            color: "#E53935",
          }}
        >
          {fieldErrors.email}
        </Text>
      ) : null}

      {/* SENHA */}
      <TextInput
        placeholder="Senha (6 a 8 caracteres)"
        value={senha}
        onChangeText={(value) => {
          setSenha(value);
          clearFieldError("senha");
        }}
        secureTextEntry
        style={[
          styles_th.input,
          {
            marginTop: 10,
            flex: 0,
            borderColor: fieldErrors.senha
              ? "#E53935"
              : undefined,
          },
        ]}
      />

      {fieldErrors.senha ? (
        <Text
          style={{
            marginTop: 5,
            color: "#E53935",
          }}
        >
          {fieldErrors.senha}
        </Text>
      ) : null}

      {/* TELEFONE */}
      <TextInput
        placeholder="Telefone"
        value={telefone}
        onChangeText={(value) => {
          const formattedPhone =
            formatPhone(value);

          setTelefone(formattedPhone);
          clearFieldError("telefone");
        }}
        keyboardType="phone-pad"
        maxLength={15}
        style={[
          styles_th.input,
          {
            marginTop: 10,
            flex: 0,
            borderColor: fieldErrors.telefone
              ? "#E53935"
              : undefined,
          },
        ]}
      />

      {fieldErrors.telefone ? (
        <Text
          style={{
            marginTop: 5,
            color: "#E53935",
          }}
        >
          {fieldErrors.telefone}
        </Text>
      ) : null}

      {/* CAMPOS DO VETERINÁRIO */}
      {role === "VETERINARIO" ? (
        <>
          {/* CRMV */}
          <TextInput
            placeholder="CRMV"
            value={crmv}
            onChangeText={(value) => {
              setCrmv(value);
              clearFieldError("crmv");
            }}
            style={[
              styles_th.input,
              {
                marginTop: 10,
                flex: 0,
                borderColor:
                  fieldErrors.crmv
                    ? "#E53935"
                    : undefined,
              },
            ]}
          />

          {fieldErrors.crmv ? (
            <Text
              style={{
                marginTop: 5,
                color: "#E53935",
              }}
            >
              {fieldErrors.crmv}
            </Text>
          ) : null}

          {/* ESPECIALIDADE */}
          <TextInput
            placeholder="Especialidade"
            value={especialidade}
            onChangeText={(value) => {
              setEspecialidade(value);
              clearFieldError(
                "especialidade",
              );
            }}
            style={[
              styles_th.input,
              {
                marginTop: 10,
                flex: 0,
                borderColor:
                  fieldErrors.especialidade
                    ? "#E53935"
                    : undefined,
              },
            ]}
          />

          {fieldErrors.especialidade ? (
            <Text
              style={{
                marginTop: 5,
                color: "#E53935",
              }}
            >
              {fieldErrors.especialidade}
            </Text>
          ) : null}

          {/* DESCRIÇÃO */}
          <TextInput
            placeholder="Descrição profissional (opcional)"
            value={descricao}
            onChangeText={(value) => {
              setDescricao(value);
              clearFieldError("descricao");
            }}
            multiline
            style={[
              styles_th.input,
              {
                marginTop: 10,
                minHeight: 120,
                flex: 0,
                textAlignVertical: "top",
                borderColor:
                  fieldErrors.descricao
                    ? "#E53935"
                    : undefined,
              },
            ]}
          />

          {fieldErrors.descricao ? (
            <Text
              style={{
                marginTop: 5,
                color: "#E53935",
              }}
            >
              {fieldErrors.descricao}
            </Text>
          ) : null}
        </>
      ) : null}

      {requestError ? (
        <Text
          style={{
            marginTop: 15,
            color: "#E53935",
          }}
        >
          {requestError}
        </Text>
      ) : null}

      <TouchableOpacity
        disabled={isSubmitting}
        onPress={() => void handleRegister()}
        style={[
          styles_th.button,
          {
            width: "100%",
            marginLeft: 0,
            marginTop: 20,
            borderRadius: 16,
            opacity: isSubmitting
              ? 0.6
              : 1,
          },
        ]}
      >
        <Text
          style={{
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          {isSubmitting
            ? "Criando..."
            : "Criar conta"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Login")
        }
        style={{
          marginTop: 15,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#E53935",
          }}
        >
          Já tenho uma conta
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Register;