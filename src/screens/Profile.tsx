import {
  useCallback,
  useState,
} from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { useAuth } from "../auth/AuthContext";
import { listPetsByUser } from "../api/pets";
import { styles_gb } from "../styles/global";
import InfoCard from "../components/InfoCard";

type PetCountState =
  | { status: "loading" }
  | { status: "ready"; count: number }
  | { status: "error" };

const formatDate = (value: string): string => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Data não disponível";
  }

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const Profile = () => {
  const { user, logoutUser } = useAuth();

  const [petCountState, setPetCountState] =
    useState<PetCountState>({ status: "loading" });

  const loadPetCount = useCallback(async () => {
    if (!user || user.tipoUsuario !== "TUTOR") {
      setPetCountState({ status: "ready", count: 0 });
      return;
    }

    setPetCountState({ status: "loading" });

    try {
      const pets = await listPetsByUser(user.id);
      setPetCountState({
        status: "ready",
        count: pets.length,
      });
    } catch {
      setPetCountState({ status: "error" });
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      void loadPetCount();
    }, [loadPetCount]),
  );

  if (!user) {
    return (
      <View
        style={[
          styles_gb.center,
          { padding: 24 },
        ]}
      >
        <Text style={styles_gb.placeholderTitle}>
          Nenhum usuário autenticado
        </Text>

        <Text
          style={[
            styles_gb.placeholderSub,
            {
              marginTop: 8,
              textAlign: "center",
            },
          ]}
        >
          Faça login novamente para visualizar seu perfil.
        </Text>
      </View>
    );
  }

  const isVeterinarian = user.tipoUsuario === "VETERINARIO";

  const handleLogout = async () => {
    await logoutUser();
  };

  const petCountText =
    petCountState.status === "loading"
      ? "Carregando..."
      : petCountState.status === "error"
        ? "Não disponível"
        : String(petCountState.count);

  return (
    <ScrollView
      contentContainerStyle={{
        paddingTop: 48,
        paddingHorizontal: 24,
        paddingBottom: 48,
      }}
    >
      <View
        style={{
          alignItems: "center",
          marginBottom: 28,
        }}
      >
        <View
          style={{
            width: 96,
            height: 96,
            borderRadius: 48,
            backgroundColor: "#E53935",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 14,
            elevation: 3,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 34,
              fontWeight: "bold",
            }}
          >
            {user.nome.charAt(0).toUpperCase()}
          </Text>
        </View>

        <Text
          style={[
            styles_gb.placeholderTitle,
            {
              fontSize: 24,
              textAlign: "center",
            },
          ]}
        >
          {user.nome}
        </Text>

        <Text
          style={[
            styles_gb.placeholderSub,
            {
              marginTop: 6,
              textAlign: "center",
            },
          ]}
        >
          {isVeterinarian ? "Veterinário" : "Tutor"}
        </Text>
      </View>

      {isVeterinarian ? undefined : (
        <View
          style={{
            padding: 18,
            borderRadius: 16,
            backgroundColor: "#FFF7F7",
            borderWidth: 1,
            borderColor: "#F2CACA",
            marginBottom: 14,
            elevation: 1,
          }}
        >
          <Text
            style={{
              color: "#777",
              fontSize: 13,
              marginBottom: 4,
            }}
          >
            Pets cadastrados
          </Text>

          <Text
            style={{
              color: "#222",
              fontSize: 28,
              fontWeight: "700",
            }}
          >
            {petCountText}
          </Text>
        </View>
      )}

      <View style={{ gap: 14 }}>
        <InfoCard label="Nome" value={user.nome} />
        <InfoCard label="E-mail" value={user.email} />
        <InfoCard label="Telefone" value={user.telefone} />
        <InfoCard
          label="Tipo de conta"
          value={isVeterinarian ? "Veterinário" : "Tutor"}
        />
        <InfoCard label="ID do usuário" value={user.id} />
        <InfoCard
          label="Conta criada em"
          value={formatDate(user.dataCriacao)}
        />
      </View>

      <TouchableOpacity
        onPress={() => void handleLogout()}
        style={{
          marginTop: 30,
          padding: 16,
          borderRadius: 16,
          backgroundColor: "#E53935",
          elevation: 2,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontWeight: "bold",
            textAlign: "center",
            fontSize: 16,
          }}
        >
          Sair da conta
        </Text>
      </TouchableOpacity>

      <Text
        style={{
          marginTop: 12,
          textAlign: "center",
          color: "#888",
          fontSize: 12,
        }}
      >
        Ao sair, a sessão salva no dispositivo é removida.
      </Text>
    </ScrollView>
  );
};

export default Profile;
