import { StyleSheet } from "react-native";

export const colors = {
  background: "#FFF5F5",
  primary: "#E53935",
  secondary: "#FFCDD2",
  accent: "#EF5350",
  text: "#2D2D2D",
  card: "#FFFFFF",
  border: "#F0DADA",
};

export const styles_th = StyleSheet.create({
  /* BACKGROUND */

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 15,
  },

  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: colors.primary,
  },

  subtitle: {
    fontSize: 17,
    color: "#777",
    marginTop: 5,
  },

  sectionTitle: {
    marginHorizontal: 20,
    marginBottom: 14,
    fontSize: 24,
    fontWeight: "700",
    color: colors.primary,
  },

  emptyText: {
    textAlign: "center",
    marginTop: 50,
    color: "#999",
    fontSize: 15,
  },

  /* INPUT */

  input: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 44,
    color: colors.text,
    fontSize: 15,
  },

  /* BUTTON */

  button: {
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    padding: 13,
    borderRadius: 100,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  form: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  /* CARD */

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
