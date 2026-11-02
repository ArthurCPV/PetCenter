import { useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { styles_gb } from "../styles/global";
import { styles_th } from "../styles/theme";

type Analysis = {
  icon: string;
  title: string;
  text: string;
};

const fakeAnalyses: Analysis[] = [
  {
    icon: "🐾",
    title: "Rotina consistente",
    text: "Os registros indicam uma rotina estável para o seu pet.",
  },
  {
    icon: "💤",
    title: "Atenção ao descanso",
    text: "Observe se o seu pet está descansando o suficiente ao longo do dia.",
  },
  {
    icon: "🍽️",
    title: "Acompanhe a alimentação",
    text: "Manter horários regulares pode ajudar a identificar mudanças no apetite.",
  },
];

const AI = () => {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  const generateAnalysis = () => {
    const random =
      fakeAnalyses[
      Math.floor(Math.random() * fakeAnalyses.length)
      ];

    setAnalysis(random);
  };

  return (
    <View style={styles_gb.center}>
      <Text style={styles_th.placeholderTitle}>
        IA em desenvolvimento
      </Text>
      <Text style={styles_th.placeholderSub}>
        (Ainda estamos treinando o cérebro dela...)
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
    </View>
  );
};

export default AI;