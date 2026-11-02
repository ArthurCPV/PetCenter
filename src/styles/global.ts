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

  screenPadding: {
    paddingHorizontal: 20,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    padding: 20,
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

  /* TEXT AND CARDS */

  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: colors.primary,
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

  item: {
    backgroundColor: colors.card,
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },

  itemTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },

  itemDate: {
    fontSize: 13,
    color: "#777",
    marginTop: 5,
  },
});
