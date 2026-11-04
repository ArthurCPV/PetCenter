import { Text, View } from "react-native";

type Props = {
  label: string;
  value: string | number;
};

const InfoCard = ({ label, value }: Props) => (
  <View
    style={{
      padding: 16,
      borderRadius: 14,
      backgroundColor: "#fff",
      borderWidth: 1,
      borderColor: "#e5e5e5",
      elevation: 1,
    }}
  >
    <Text
      style={{
        color: "#777",
        fontSize: 13,
        marginBottom: 5,
      }}
    >
      {label}
    </Text>

    <Text style={{ fontSize: 16, fontWeight: "600" }}>{value}</Text>
  </View>
);

export default InfoCard;
