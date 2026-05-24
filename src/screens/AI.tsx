import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { styles_gb } from "../styles/global";
import { styles_th } from "../styles/theme";

const fakeAnalyses = [
  {
    title: "Padrão de sono saudável",
    text: "Seu pet manteve um padrão consistente de sono nos últimos dias.",
    icon: "😴",
  },
  {
    title: "Possível ansiedade",
    text: "Foram registrados comportamentos agitados em horários próximos.",
    icon: "⚠️",
  },
  {
    title: "Boa rotina alimentar",
    text: "A alimentação parece equilibrada e consistente.",
    icon: "🍖",
  },
  {
    title: "Nível alto de atividade",
    text: "Seu pet está bastante ativo e responsivo.",
    icon: "🎾",
  },
];

const AI = () => {
  const [analysis, setAnalysis] = useState<any>(null);

  const generateAnalysis = () => {
    const random =
      fakeAnalyses[
        Math.floor(Math.random() * fakeAnalyses.length)
      ];

    setAnalysis(random);
  };

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 22,
        paddingBottom: 40,
      }}
    >
      <Text style={styles_th.title}>
        Assistente IA
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
        Simulação de análises inteligentes baseadas
        nos registros do pet.
      </Text>

      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 20,
          padding: 22,
          marginTop: 28,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            marginBottom: 10,
          }}
        >
          O que a IA pode analisar?
        </Text>

        <Text style={{ lineHeight: 24, color: "#555" }}>
          • Mudanças comportamentais{"\n"}
          • Rotina alimentar{"\n"}
          • Qualidade do sono{"\n"}
          • Sintomas recorrentes{"\n"}
          • Padrões emocionais
        </Text>
      </View>

      {analysis && (
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 20,
            padding: 22,
            marginTop: 24,
            borderWidth: 1,
            borderColor: "#eee",
          }}
        >
          <Text style={{ fontSize: 34 }}>
            {analysis.icon}
          </Text>

          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              marginTop: 12,
              marginBottom: 10,
            }}
          >
            {analysis.title}
          </Text>

          <Text
            style={{
              color: "#555",
              lineHeight: 22,
            }}
          >
            {analysis.text}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles_th.button,
          {
            marginTop: 30,
          },
        ]}
        onPress={generateAnalysis}
      >
        <Text style={styles_th.buttonText}>
          Gerar análise
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AI;