import { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useAuth } from "../auth/AuthContext";

import { styles_th } from "../styles/theme";

import type { HomeStack } from "../types/navigation";

type NavigationProp = NativeStackNavigationProp<
  HomeStack,
  "Login"
>;

const isValidEmail = (
  value: string,
): boolean => {
  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(value);
};

const Login = () => {
  const navigation =
    useNavigation<NavigationProp>();

  const { loginUser } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const handleLogin = async (): Promise<void> => {
    const trimmedEmail = email.trim();

    setError("");

    if (!trimmedEmail) {
      setError("Informe seu e-mail.");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setError("Informe um e-mail válido.");
      return;
    }

    if (!senha) {
      setError("Informe sua senha.");
      return;
    }

    if (senha.length < 6) {
      setError(
        "A senha deve ter pelo menos 6 caracteres.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await loginUser(
        trimmedEmail,
        senha,
      );

      navigation.reset({
        index: 0,
        routes: [
          {
            name: "Home",
          },
        ],
      });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível realizar o login.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles_th.container}>
      <View style={{ padding: 25 }}>
        <Text style={styles_th.title}>
          Entrar
        </Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(value) => {
            setEmail(value);
            setError("");
          }}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          style={[
            styles_th.input,
            {
              marginTop: 30,
              marginBottom: 15,
              paddingTop: 15,
              flex: 0,
              paddingHorizontal: 10,
              height: 55,
              borderColor: error
                ? "#E53935"
                : undefined,
            },
          ]}
        />

        <TextInput
          placeholder="Senha"
          value={senha}
          onChangeText={(value) => {
            setSenha(value);
            setError("");
          }}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          style={[
            styles_th.input,
            {
              paddingTop: 15,
              flex: 0,
              paddingHorizontal: 10,
              height: 55,
              borderColor: error
                ? "#E53935"
                : undefined,
            },
          ]}
        />

        {error ? (
          <Text
            style={{
              marginTop: 8,
              color: "#E53935",
            }}
          >
            {error}
          </Text>
        ) : undefined}

        <TouchableOpacity
          disabled={isSubmitting}
          style={[
            styles_th.button,
            {
              width: "100%",
              marginLeft: 0,
              marginTop: 25,
              borderRadius: 18,
              opacity: isSubmitting ? 0.6 : 1,
            },
          ]}
          onPress={() => {
            void handleLogin();
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            {isSubmitting
              ? "Entrando..."
              : "Entrar"}
          </Text>
        </TouchableOpacity>

        <View
          style={{
            alignItems: "center",
            marginTop: 25,
          }}
        >
          <Text
            style={{
              color: "#666",
              marginBottom: 8,
            }}
          >
            Ainda não possui uma conta?
          </Text>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate(
                "Register",
              );
            }}
          >
            <Text
              style={{
                color: "#E53935",
                fontWeight: "bold",
              }}
            >
              Criar uma conta
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;