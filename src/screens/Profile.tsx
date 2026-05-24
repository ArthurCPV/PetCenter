import React from "react";
import {
  View,
  Text,
  ScrollView,
} from "react-native";

import { styles_th } from "../styles/theme";

const Profile = () => {
  return (
    <ScrollView
      contentContainerStyle={{
        padding: 22,
        paddingBottom: 40,
      }}
    >
      <View
        style={{
          alignItems: "center",
          marginTop: 30,
        }}
      >
        <View
          style={{
            width: 110,
            height: 110,
            borderRadius: 55,
            backgroundColor: "#E53935",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 42,
              color: "#fff",
            }}
          >
            👤
          </Text>
        </View>

        <Text
          style={[
            styles_th.title,
            {
              marginTop: 18,
            },
          ]}
        >
          USERNAME
        </Text>

        <Text
          style={{
            color: "#777",
            marginTop: 6,
          }}
        >
          Usuário Premium
        </Text>
      </View>

      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 20,
          padding: 22,
          marginTop: 30,
        }}
      >
        <Text
          style={{
            fontWeight: "700",
            fontSize: 17,
            marginBottom: 16,
          }}
        >
          Estatísticas
        </Text>

        <Text style={{ marginBottom: 10 }}>
          🐶 Pets cadastrados: 3
        </Text>

        <Text style={{ marginBottom: 10 }}>
          📝 Registros criados: 48
        </Text>

        <Text style={{ marginBottom: 10 }}>
          🎾 Atividades registradas: 26
        </Text>

        <Text>
          ⚠️ Alertas recebidos: 5
        </Text>
      </View>
    </ScrollView>
  );
};

export default Profile;