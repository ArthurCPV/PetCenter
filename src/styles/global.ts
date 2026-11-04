import { StyleSheet } from "react-native";

import { colors } from "./theme";

export const styles_gb = StyleSheet.create({
  /* CONTAINERS */

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  placeholderTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.primary,
    textAlign: "center",
  },

  placeholderSub: {
    fontSize: 14,
    color: "#777",
  },

});
