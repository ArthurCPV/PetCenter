import { StyleSheet } from "react-native";

export const styles_gb = StyleSheet.create({
  /* CONTAINERS */

  container: {
    flex: 1,
  },

  screen: {
    flex: 1,
    paddingTop: 60,
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

  /* HEADER */

  header: {
    paddingHorizontal: 24,
    paddingBottom: 25,
  },

    spaceBetween: {
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

  /* MODAL */

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    padding: 20,
  },

  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
  },

  /* TAB BAR */

  tabBar: {
    height: 88,
    paddingTop: 8,
    paddingBottom: 8,
  },

  tabLabel: {
    fontSize: 11,
    marginTop: -4,
  },

  tabIconContainer: {
    marginTop: 2,
  },
});