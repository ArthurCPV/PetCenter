// src/styles/global.ts
import { StyleSheet } from "react-native";

import { colors } from "./theme";

export const styles_gb = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 50,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  header: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  logo: {
    width: 32,
    height: 32,
    resizeMode: "contain",
  },

  form: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
});
