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

  backCard: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginLeft: 20,
    marginBottom: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 26,
    backgroundColor: "#FFF1F1",
    borderWidth: 1,
    borderColor: "#F4C2C2",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },

  backIconWrapper: {
    width: 30,
    height: 30,
    borderRadius: 16,
    backgroundColor: "#FDE8E8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  backIcon: {
    fontSize: 18,
    color: "#E53935",
    fontWeight: "700",
  },

  backCardText: {
    color: "#E53935",
    fontWeight: "700",
    fontSize: 16,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 22,
  },

  inputGroupInput: {
    flex: 1,
    height: 56,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#F0DADA",
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
    borderRightWidth: 0,
    paddingHorizontal: 16,
    justifyContent: "center",
  },

  inputGroupButton: {
    width: 58,
    height: 56,
    backgroundColor: "#E53935",
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
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
  maxHeight: "90%",
  alignSelf: "stretch",
},

  /* TAB BAR */

  tabBar: {
    height: 88,
    paddingTop: 8,
    paddingBottom: 8,
  },

  tabLabel: {
    fontSize: 11,
    marginTop: 6,
  },

  tabIconContainer: {
    marginTop: 2,
  },
});