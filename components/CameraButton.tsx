import { FontAwesome } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Dimensions, Pressable, StyleSheet, Text } from "react-native";
import { useTheme } from "../context/ThemeContext";

interface CameraButtonProps {
  onPress?: () => void;
}

export default function CameraButton({ onPress }: CameraButtonProps) {
  const { theme } = useTheme();
  const { colors } = theme;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.buttonContainer,
        {
          backgroundColor: colors.primary,
          shadowColor: colors.shadowColor,
          transform: [{ scale: pressed ? 0.96 : 1 }],
        },
      ]}
      onPress={handlePress}
    >
      <FontAwesome
        name="camera"
        size={16}
        color={colors.background}
        style={styles.buttonIcon}
      />
      <Text
        style={[
          styles.buttonLabel,
          {
            color: colors.background,
            fontWeight: "600",
          },
        ]}
      >
        Take Photo
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: Math.min(140, (Dimensions.get("window").width - 32) / 2),
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    flexDirection: "row",
    gap: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 6,
    paddingHorizontal: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonLabel: {
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});
