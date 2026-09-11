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
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    const trimmedNome = nome.trim();
    const trimmedEmail = email.trim();
    const trimmedTelefone = telefone.trim();
    const trimmedCrmv = crmv.trim();
    const trimmedEspecialidade = especialidade.trim();
    const trimmedDescricao = descricao.trim();

    if (!trimmedNome || !trimmedEmail || !senha || !trimmedTelefone) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    if (senha.length < 6 || senha.length > 8) {
      setError("A senha deve ter entre 6 e 8 caracteres.");
      return;
    }

    if (role === "VETERINARIO") {
      if (!trimmedCrmv || !trimmedEspecialidade) {
        setError("Preencha o CRMV e a especialidade.");
        return;
      }

      if (trimmedCrmv.length < 4 || trimmedCrmv.length > 20) {
        setError("O CRMV deve ter entre 4 e 20 caracteres.");
        return;
      }

      if (trimmedEspecialidade.length < 3 || trimmedEspecialidade.length > 100) {
        setError("A especialidade deve ter entre 3 e 100 caracteres.");
        return;
      }

      if (trimmedDescricao && (trimmedDescricao.length < 10 || trimmedDescricao.length > 500)) {
        setError("A descrição deve ter entre 10 e 500 caracteres.");
        return;
      }
    }

    setError("");
    setIsSubmitting(true);

    try {
      await registerUser({
        nome: trimmedNome,
        email: trimmedEmail,
        senha,
        telefone: trimmedTelefone,
        tipoUsuario: role,
      });

      if (role === "VETERINARIO") {
        // O backend permite POST /api/veterinarios apenas para ROLE_VETERINARIO.
        // Portanto, o usuário recém-criado precisa fazer login antes de criar
        // seu perfil profissional.
        await login({
          email: trimmedEmail,
          senha,
        });

        await createVeterinarianProfile({
          crmv: trimmedCrmv,
          especialidade: trimmedEspecialidade,
          descricao: trimmedDescricao || undefined,
        });
      }

      navigation.navigate("Login");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível criar a conta.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 25 }}>
      <Text style={styles_th.title}>Criar conta</Text>

      <Text style={{ marginTop: 20, marginBottom: 10, fontWeight: "600" }}>
        Tipo de conta
      </Text>

      <View style={{ flexDirection: "row", gap: 10 }}>
        <TouchableOpacity
          onPress={() => setRole("TUTOR")}
          style={{
            flex: 1,
            padding: 14,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: role === "TUTOR" ? "#E53935" : "#ccc",
            alignItems: "center",
          }}
        >
          <Text>Tutor</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setRole("VETERINARIO")}
          style={{
            flex: 1,
            padding: 14,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: role === "VETERINARIO" ? "#E53935" : "#ccc",
            alignItems: "center",
          }}
        >
          <Text>Veterinário</Text>
        </TouchableOpacity>
      </View>

      <TextInput placeholder="Nome" value={nome} onChangeText={setNome} style={[styles_th.input, { marginTop: 15, flex: 0 }]} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={[styles_th.input, { marginTop: 10, flex: 0 }]} />
      <TextInput placeholder="Senha (6 a 8 caracteres)" value={senha} onChangeText={setSenha} secureTextEntry style={[styles_th.input, { marginTop: 10, flex: 0 }]} />
      <TextInput placeholder="Telefone" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" style={[styles_th.input, { marginTop: 10, flex: 0 }]} />

      {role === "VETERINARIO" ? (
        <>
          <TextInput placeholder="CRMV" value={crmv} onChangeText={setCrmv} style={[styles_th.input, { marginTop: 10, flex: 0 }]} />
          <TextInput placeholder="Especialidade" value={especialidade} onChangeText={setEspecialidade} style={[styles_th.input, { marginTop: 10, flex: 0 }]} />
          <TextInput placeholder="Descrição profissional (opcional)" value={descricao} onChangeText={setDescricao} multiline style={[styles_th.input, { marginTop: 10, minHeight: 120, flex: 0, textAlignVertical: "top" }]} />
        </>
      ) : null}

      {error ? (
        <Text style={{ marginTop: 10, color: "#E53935" }}>{error}</Text>
      ) : null}

      <TouchableOpacity
        disabled={isSubmitting}
        onPress={() => void handleRegister()}
        style={[styles_th.button, { width: "100%", marginLeft: 0, marginTop: 20, borderRadius: 16, opacity: isSubmitting ? 0.6 : 1 }]}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>
          {isSubmitting ? "Criando..." : "Criar conta"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Login")}
        style={{ marginTop: 15, alignItems: "center" }}
      >
        <Text style={{ color: "#E53935" }}>Já tenho uma conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Register;
