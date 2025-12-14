import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Haptics from "expo-haptics";
import { PropsWithChildren } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../context/ThemeContext";

type Props = PropsWithChildren<{
  isVisible: boolean;
  onClose: () => void;
}>;

export default function EmojiPicker({ isVisible, children, onClose }: Props) {
  const { theme } = useTheme();
  const { colors } = theme;

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  return (
    <View>
      <Modal animationType="slide" transparent={true} visible={isVisible}>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: colors.surface,
                borderColor: colors.glassBorder,
              },
            ]}
          >
            <View
              style={[styles.handle, { backgroundColor: colors.textTertiary }]}
            />
            <View style={styles.titleContainer}>
              <Text style={[styles.title, { color: colors.text }]}>
                Choose a sticker
              </Text>
              <Pressable
                style={({ pressed }) => [
                  styles.closeButton,
                  {
                    backgroundColor: colors.glassBackground,
                    transform: [{ scale: pressed ? 0.9 : 1 }],
                  },
                ]}
                onPress={handleClose}
              >
                <MaterialIcons name="close" color={colors.primary} size={20} />
              </Pressable>
            </View>
            {children}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    height: "40%",
    width: "100%",
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  titleContainer: {
    height: 60,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});
