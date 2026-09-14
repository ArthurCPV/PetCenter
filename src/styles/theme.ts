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
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 15,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: colors.primary,
  },

  subtitle: {
    fontSize: 14,
    color: "#777",
  },

  placeholderTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.primary,
    textAlign: "center",
  },

  placeholderSub: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
    textAlign: "center",
  },

  input: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
  },

  button: {
    backgroundColor: colors.primary,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    elevation: 3,
  },

  buttonText: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
  },

  emptyText: {
    textAlign: "center",
    marginTop: 30,
    color: "#999",
  },

  sectionTitle: {
    marginLeft: 20,
    marginTop: 15,
    marginBottom: 5,
    fontWeight: "600",
    color: colors.primary,
  },

  item: {
    backgroundColor: colors.card,
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },

  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },

  itemDate: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },
});
