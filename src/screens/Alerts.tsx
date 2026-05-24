import React from "react";
import {
  View,
  Text,
  ScrollView,
} from "react-native";

import { styles_th } from "../styles/theme";

const alerts = [
  {
    icon: "🍖",
    title: "Horário de alimentação",
    text: "Seu pet normalmente come às 08:00.",
  },
  {
    icon: "💧",
    title: "Pouca hidratação detectada",
    text: "Nenhum registro de água hoje.",
  },
  {
    icon: "⚠️",
    title: "Comportamento ansioso",
    text: "Foram registrados eventos de ansiedade.",
  },
  {
    icon: "💤",
    title: "Sono abaixo da média",
    text: "Seu pet dormiu menos que o habitual.",
  },
];

const Alerts = () => {
  return (
    <ScrollView
      contentContainerStyle={{
        padding: 22,
        paddingBottom: 40,
      }}
    >
      <Text style={styles_th.title}>
        Alertas Inteligentes
      </Text>

      <Text
        style={[
          styles_th.subtitle,
          {
            marginTop: 8,
            lineHeight: 22,
          },
        ]}
      >
        Simulação de notificações automáticas do sistema.
      </Text>

      {alerts.map((alert, index) => (
        <View
          key={index}
          style={{
            backgroundColor: "#fff",
            borderRadius: 18,
            padding: 18,
            marginTop: 18,
          }}
        >
          <Text style={{ fontSize: 30 }}>
            {alert.icon}
          </Text>

          <Text
            style={{
              fontSize: 17,
              fontWeight: "700",
              marginTop: 12,
              marginBottom: 8,
            }}
          >
            {alert.title}
          </Text>

          <Text
            style={{
              color: "#555",
              lineHeight: 22,
            }}
          >
            {alert.text}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default Alerts;