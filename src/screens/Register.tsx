import { useState } from "react";

import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import type {
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";

import {
  createVeterinarianProfile,
  deleteUserAccount,
  getUserByEmail,
  login as loginJava,
  logout as logoutJava,
  registerUser,
} from "../api/auth";

import {
  ApiHttpError,
} from "../api/api";

import {
  FirebaseEmailAlreadyInUseError,
  deleteCurrentFirebaseUser,
  logoutFirebaseUser,
  registerFirebaseUser,
} from "../api/firebaseAuth";

import { useAuth } from "../auth/AuthContext";

import type {
  UserRole,
} from "../auth/AuthContext";

import { styles_th } from "../styles/theme";

import type {
  HomeStack,
} from "../types/navigation";

type NavigationProp =
  NativeStackNavigationProp<
    HomeStack,
    "Login"
  >;

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

const onlyPhoneNumbers = (
  value: string,
): string => {
  return value
    .replace(/\D/g, "")
    .slice(0, 11);
};

const formatPhone = (
  value: string,
): string => {
  const numbers =
    onlyPhoneNumbers(value);

  if (numbers.length === 0) {
    return "";
  }

  if (numbers.length <= 2) {
    return `(${numbers}`;
  }

  if (numbers.length <= 7) {
    return `(${numbers.slice(
      0,
      2,
    )}) ${numbers.slice(2)}`;
  }

  if (numbers.length === 11) {
    return `(${numbers.slice(
      0,
      2,
    )}) ${numbers.slice(
      2,
      7,
    )}-${numbers.slice(7)}`;
  }

  return `(${numbers.slice(
    0,
    2,
  )}) ${numbers.slice(
    2,
    6,
  )}-${numbers.slice(6)}`;
};

const Register = () => {
  const navigation =
    useNavigation<NavigationProp>();

  const {
    runAuthOperation,
  } = useAuth();

  const [role, setRole] =
    useState<UserRole>("TUTOR");

  const [nome, setNome] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [senha, setSenha] =
    useState("");

  const [telefone, setTelefone] =
    useState("");

  const [crmv, setCrmv] =
    useState("");

  const [especialidade, setEspecialidade] =
    useState("");

  const [descricao, setDescricao] =
    useState("");

  const [fieldErrors, setFieldErrors] =
    useState<FieldErrors>(
      emptyErrors,
    );

  const [requestError, setRequestError] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  let firebaseUserWasCreated = false;
  let javaUserWasCreated = false;

  const clearFieldError = (
    field: keyof FieldErrors,
  ): void => {
    setFieldErrors((current) => ({
      ...current,
      [field]: "",
    }));

    setRequestError("");
  };

  const validateForm =
    (): boolean => {
      const errors: FieldErrors = {
        ...emptyErrors,
      };

      const trimmedNome =
        nome.trim();

      const trimmedEmail =
        email.trim();

      const phoneNumbers =
        onlyPhoneNumbers(telefone);

      const trimmedCrmv =
        crmv.trim();

      const trimmedEspecialidade =
        especialidade.trim();

      const trimmedDescricao =
        descricao.trim();

      if (!trimmedNome) {
        errors.nome =
          "Informe seu nome.";
      } else if (
        trimmedNome.length < 3 ||
        trimmedNome.length > 100
      ) {
        errors.nome =
          "O nome deve ter entre 3 e 100 caracteres.";
      }

      if (!trimmedEmail) {
        errors.email =
          "Informe seu e-mail.";
      } else {
        const emailRegex =
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
          !emailRegex.test(
            trimmedEmail,
          )
        ) {
          errors.email =
            "Informe um e-mail válido.";
        } else if (
          trimmedEmail.length > 150
        ) {
          errors.email =
            "O e-mail deve ter no máximo 150 caracteres.";
        }
      }

      if (!senha) {
        errors.senha =
          "Informe sua senha.";
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
          errors.crmv =
            "Informe seu CRMV.";
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
          (
            trimmedDescricao.length < 10 ||
            trimmedDescricao.length > 500
          )
        ) {
          errors.descricao =
            "A descrição deve ter entre 10 e 500 caracteres.";
        }
      }

      setFieldErrors(errors);

      return !Object.values(
        errors,
      ).some(
        (message) => message !== "",
      );
    };

  const handleRegister =
    async (): Promise<void> => {
      setRequestError("");

      if (!validateForm()) {
        return;
      }

      const trimmedNome =
        nome.trim();

      const trimmedEmail =
        email.trim();

      const phoneNumbers =
        onlyPhoneNumbers(telefone);

      const trimmedCrmv =
        crmv.trim();

      const trimmedEspecialidade =
        especialidade.trim();

      const trimmedDescricao =
        descricao.trim();

      setIsSubmitting(true);

      try {
        await runAuthOperation(
          async (): Promise<void> => {
            /*
             * --------------------------------------------------
             * 1. GARANTIR A CONTA FIREBASE
             * --------------------------------------------------
             *
             * Firebase é o primeiro passo.
             *
             * Se já existir, fazemos login em vez de criar
             * outra conta.
             */
            try {
              await registerFirebaseUser(
                trimmedEmail,
                senha,
              );

              firebaseUserWasCreated = true;
            } catch (firebaseError) {
              if (
                firebaseError instanceof
                FirebaseEmailAlreadyInUseError
              ) {
                throw new Error(
                  "Este e-mail já está cadastrado.",
                );
              } else {
                throw firebaseError;
              }
            }

            /*
             * --------------------------------------------------
             * 2. VERIFICAR O USUÁRIO NO JAVA
             * --------------------------------------------------
             *
             * Tentamos login primeiro.
             *
             * Se funcionar, o usuário já existe no Java.
             * Não fazemos POST duplicado.
             *
             * Se retornar 401/403, consideramos que o usuário
             * ainda não existe no Java e fazemos cadastro.
             */
            try {
              await loginJava({
                email: trimmedEmail,
                senha,
              });
              throw new Error(
                "Este e-mail já está cadastrado.",
              );
            } catch (javaError) {
              if (
                javaError instanceof
                ApiHttpError &&
                (
                  javaError.status === 401 ||
                  javaError.status === 403
                )
              ) {
                await registerUser({
                  nome: trimmedNome,
                  email: trimmedEmail,
                  senha,
                  telefone:
                    phoneNumbers,
                  tipoUsuario: role,
                });

                javaUserWasCreated = true;
              } else {
                throw javaError;
              }
            }

            /*
             * --------------------------------------------------
             * 3. PERFIL DE VETERINÁRIO
             * --------------------------------------------------
             *
             * Só criamos o perfil quando o usuário Java
             * realmente acabou de ser criado.
             *
             * Se a conta já existia, não tentamos criar o mesmo
             * perfil novamente.
             */
            if (
              role === "VETERINARIO" &&
              javaUserWasCreated
            ) {
              await loginJava({
                email: trimmedEmail,
                senha,
              });

              await createVeterinarianProfile({
                crmv: trimmedCrmv,
                especialidade:
                  trimmedEspecialidade,
                descricao:
                  trimmedDescricao ||
                  undefined,
              });
            }

            await logoutJava();

            /*
             * Cadastro concluído nos dois sistemas.
             */
            await logoutFirebaseUser();
          },
        );

        navigation.navigate("Login");
      } catch (registerError) {
        /*
         * Se esta tentativa criou a conta Firebase, desfazemos
         * essa criação quando o cadastro Java não conclui.
         * Assim evitamos uma conta órfã em apenas um sistema.
         */
        if (javaUserWasCreated) {
          try {
            await loginJava({
              email: trimmedEmail,
              senha,
            });

            const createdUser = await getUserByEmail(
              trimmedEmail,
            );

            await deleteUserAccount(createdUser.id);
          } catch {
            // Mantém o erro original do cadastro.
          }
        }

        if (firebaseUserWasCreated) {
          try {
            await deleteCurrentFirebaseUser();
          } catch {
            // Mantém o erro original do cadastro.
          }
        }

        try {
          await logoutJava();
        } catch {
          // Mantém o erro original.
        }

        try {
          await logoutFirebaseUser();
        } catch {
          // Mantém o erro original.
        }

        setRequestError(
          registerError instanceof Error
            ? registerError.message
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
            setFieldErrors(
              emptyErrors,
            );
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
            setRole(
              "VETERINARIO",
            );
            setFieldErrors(
              emptyErrors,
            );
            setRequestError("");
          }}
          style={{
            flex: 1,
            padding: 14,
            borderRadius: 12,
            borderWidth: 1,
            borderColor:
              role ===
                "VETERINARIO"
                ? "#E53935"
                : "#ccc",
            alignItems: "center",
          }}
        >
          <Text>
            Veterinário
          </Text>
        </TouchableOpacity>
      </View>

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
            borderColor:
              fieldErrors.nome
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
      ) : undefined}

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(value) => {
          setEmail(value);
          clearFieldError("email");
        }}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        style={[
          styles_th.input,
          {
            marginTop: 10,
            flex: 0,
            borderColor:
              fieldErrors.email
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
      ) : undefined}

      <TextInput
        placeholder="Senha (6 a 8 caracteres)"
        value={senha}
        onChangeText={(value) => {
          setSenha(value);
          clearFieldError("senha");
        }}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        style={[
          styles_th.input,
          {
            marginTop: 10,
            flex: 0,
            borderColor:
              fieldErrors.senha
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
      ) : undefined}

      <TextInput
        placeholder="Telefone"
        value={telefone}
        onChangeText={(value) => {
          setTelefone(
            formatPhone(value),
          );
          clearFieldError("telefone");
        }}
        keyboardType="phone-pad"
        maxLength={15}
        style={[
          styles_th.input,
          {
            marginTop: 10,
            flex: 0,
            borderColor:
              fieldErrors.telefone
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
      ) : undefined}

      {role ===
        "VETERINARIO" ? (
        <>
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
          ) : undefined}

          <TextInput
            placeholder="Especialidade"
            value={especialidade}
            onChangeText={(value) => {
              setEspecialidade(
                value,
              );
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
              {
                fieldErrors.especialidade
              }
            </Text>
          ) : undefined}

          <TextInput
            placeholder="Descrição profissional (opcional)"
            value={descricao}
            onChangeText={(value) => {
              setDescricao(value);
              clearFieldError(
                "descricao",
              );
            }}
            multiline
            style={[
              styles_th.input,
              {
                marginTop: 10,
                minHeight: 120,
                flex: 0,
                textAlignVertical:
                  "top",
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
              {
                fieldErrors.descricao
              }
            </Text>
          ) : undefined}
        </>
      ) : undefined}

      {requestError ? (
        <Text
          style={{
            marginTop: 15,
            color: "#E53935",
          }}
        >
          {requestError}
        </Text>
      ) : undefined}

      <TouchableOpacity
        disabled={isSubmitting}
        onPress={() => {
          void handleRegister();
        }}
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
        onPress={() => {
          navigation.navigate(
            "Login",
          );
        }}
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