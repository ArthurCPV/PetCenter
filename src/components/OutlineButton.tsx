import type { StyleProp, ViewStyle } from "react-native";
import { Text, TouchableOpacity } from "react-native";

type Props = {
  label: string;
  onPress: () => void;
  color?: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

const OutlineButton = ({
  label,
  onPress,
  color = "#E53935",
  style,
  disabled = false,
}: Props) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    style={[
      {
        padding: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: color,
        alignItems: "center",
        opacity: disabled ? 0.6 : 1,
      },
      style,
    ]}
  >
    <Text style={{ color, fontWeight: "bold" }}>{label}</Text>
  </TouchableOpacity>
);

export default OutlineButton;
