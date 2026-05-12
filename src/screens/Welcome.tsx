import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { styles_th } from "../styles/theme";

const Welcome = ({ navigation }: any) => {
  return (
    <View
      style={[
        styles_th.container,
        {
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 30,
        },
      ]}
    >
      <Image
        source={require("../../assets/icons/pokecenter-4.png")}
        style={{
          width: 120,
          height: 120,
          marginBottom: 20,
        }}
      />

      <Text
        style={[
          styles_th.title,
          {
            fontSize: 38,
            textAlign: "center",
          },
        ]}
      >
        PetCenter
      </Text>

      <Text
        style={{
          marginTop: 15,
          textAlign: "center",
          color: "#666",
          fontSize: 16,
        }}
      >
        O diário inteligente do seu pet ✨
      </Text>

      <TouchableOpacity
        style={[
          styles_th.button,
          {
            width: 220,
            height: 60,
            borderRadius: 30,
            marginTop: 50,
          },
        ]}
        onPress={() => navigation.navigate("Login")}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          Vamos começar
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Welcome;