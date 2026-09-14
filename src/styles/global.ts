import { StyleSheet } from "react-native";

import { colors } from "./theme";

export const styles_gb = StyleSheet.create({
  /* CONTAINERS */

  container: {
    flex: 1,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

    screenPadding: {
    paddingHorizontal: 20,
  },

  header: {
    paddingHorizontal: 24,
    paddingBottom: 25,
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
    alignItems: "center",
    justifyContent: "space-between",
  },

  /* LAYOUTS */

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  formRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 22,
  },

  /* BUTTONS */

  fullButton: {
    width: "90%",
    alignSelf: "center",
    marginBottom: 20,
  },

  backButton: {
    marginLeft: 20,
    marginBottom: 15,
  },
});
