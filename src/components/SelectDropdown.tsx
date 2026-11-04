import { useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export type SelectOption = {
  value: string;
  label: string;
};

type Props = {
  value: string | undefined;
  options: SelectOption[];
  onChange: (value: string | undefined) => void;
  placeholder: string;
  allLabel?: string;
  selectedLabel?: string;
};

const SelectDropdown = ({
  value,
  options,
  onChange,
  placeholder,
  allLabel,
  selectedLabel,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);
  const canSelectAll = allLabel !== undefined;
  const hasSelection = selectedLabel !== undefined || selectedOption !== undefined;

  const selectValue = (nextValue: string | undefined): void => {
    onChange(nextValue);
    setIsOpen(false);
  };

  return (
    <View style={{ marginTop: 8 }}>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={placeholder}
        accessibilityState={{ expanded: isOpen }}
        onPress={() => setIsOpen((open) => !open)}
        style={{
          minHeight: 46,
          paddingHorizontal: 14,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: "#F0DADA",
          backgroundColor: "#fff",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ color: hasSelection ? "#2D2D2D" : "#999", fontSize: 14 }}>
          {selectedLabel ?? selectedOption?.label ?? placeholder}
        </Text>
        <Text style={{ color: "#777", fontSize: 18 }}>
          {isOpen ? "⌃" : "⌄"}
        </Text>
      </TouchableOpacity>

      {isOpen ? (
        <View
          style={{
            maxHeight: 220,
            marginTop: 6,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: "#F0DADA",
            backgroundColor: "#fff",
            overflow: "hidden",
          }}
        >
          <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
            {canSelectAll ? (
              <TouchableOpacity
                accessibilityRole="button"
                onPress={() => selectValue(undefined)}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 13,
                  borderBottomWidth: 1,
                  borderBottomColor: "#F5EAEA",
                }}
              >
                <Text
                  style={{
                    color: value === undefined ? "#E53935" : "#2D2D2D",
                    fontWeight: value === undefined ? "700" : "400",
                  }}
                >
                  {allLabel}
                </Text>
              </TouchableOpacity>
            ) : null}

            {options.map((option) => (
              <TouchableOpacity
                accessibilityRole="button"
                key={option.value}
                onPress={() => selectValue(option.value)}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 13,
                  borderBottomWidth: 1,
                  borderBottomColor: "#F5EAEA",
                }}
              >
                <Text
                  style={{
                    color: value === option.value ? "#E53935" : "#2D2D2D",
                    fontWeight: value === option.value ? "700" : "400",
                  }}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}

            {options.length === 0 && !canSelectAll ? (
              <Text
                style={{
                  padding: 14,
                  color: "#777",
                  textAlign: "center",
                }}
              >
                Nenhuma opção disponível.
              </Text>
            ) : null}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
};

export default SelectDropdown;
