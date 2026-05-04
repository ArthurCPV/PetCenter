// src/styles/global.ts
import { StyleSheet } from "react-native";
import { colors } from "./theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 50,
  },

  header: {
    paddingHorizontal: 20,
    marginBottom: 10,
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

  form: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 15,
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

  // 🔥 TAB BAR (novo)
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },

  tabItem: {
    alignItems: "center",
  },

  tabIcon: {
    width: 28,
    height: 28,
  },

  tabText: {
    fontSize: 10,
    marginTop: 2,
    color: colors.text,
  },
});