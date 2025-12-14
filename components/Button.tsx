import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as Haptics from "expo-haptics";
import { Pressable, StyleSheet, Text } from "react-native";
import { useTheme } from "../context/ThemeContext";

type props = {
  label: string;
  theme?: "primary";
  onPress?: () => void;
};

export default function Button({ label, theme, onPress }: props) {
  const { theme: appTheme } = useTheme();
  const { colors } = appTheme;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  if (theme === "primary") {
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
          name="picture-o"
          size={22}
          color={colors.background}
          style={styles.buttonIcon}
        />
        <Text style={[styles.buttonLabel, { color: colors.background }]}>
          {label}
        </Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.buttonContainer,
        {
          backgroundColor: colors.glassBackground,
          borderColor: colors.glassBorder,
          transform: [{ scale: pressed ? 0.96 : 1 }],
        },
      ]}
      onPress={handlePress}
    >
      <Text style={[styles.buttonLabel, { color: colors.text }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 280,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 28,
    flexDirection: "row",
    gap: 12,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 1,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
