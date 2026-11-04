import type { ReactNode } from "react";
import {
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type { StyleProp, ViewStyle } from "react-native";

import { styles_th } from "../styles/theme";

type Props = {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  isSubmitting?: boolean;
  cardStyle?: StyleProp<ViewStyle>;
};

const ModalShell = ({
  visible,
  title,
  onClose,
  children,
  isSubmitting = false,
  cardStyle,
}: Props) => {
  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.4)",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Fechar modal"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          }}
          onPress={handleClose}
        />

        <View
          style={[
            {
              backgroundColor: "#fff",
              borderRadius: 20,
              padding: 20,
              maxHeight: "90%",
            },
            cardStyle,
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={[styles_th.title, { flexShrink: 1 }]}
            >
              {title}
            </Text>

            <TouchableOpacity
              onPress={handleClose}
              disabled={isSubmitting}
              accessibilityRole="button"
              accessibilityLabel="Fechar"
              style={{
                width: 40,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 26,
                  color: "#777",
                  fontWeight: "bold",
                }}
              >
                ×
              </Text>
            </TouchableOpacity>
          </View>

          {children}
        </View>
      </View>
    </Modal>
  );
};

export default ModalShell;
