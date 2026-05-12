import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { styles_th } from "../styles/theme";

const Login = ({ navigation }: any) => {
  return (
    <View style={styles_th.container}>
      <View style={{ padding: 25 }}>
        <Text style={styles_th.title}>Entrar</Text>

        <TextInput
          placeholder="Email"
          style={[
            styles_th.input,
            {
              marginTop: 30,
              marginBottom: 15,
              paddingTop: 15,
              flex: 0,
              paddingHorizontal: 10,
              height: 55,
            },
          ]}
        />

        <TextInput
          placeholder="Senha"
          secureTextEntry
          style={[
            styles_th.input,
            {
              paddingTop: 15,
              flex: 0,
              paddingHorizontal: 10,
              height: 55,
            },
          ]}
        />

        <TouchableOpacity
          style={[
            styles_th.button,
            {
              width: "100%",
              marginLeft: 0,
              marginTop: 25,
              borderRadius: 18,
            },
          ]}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            Entrar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;