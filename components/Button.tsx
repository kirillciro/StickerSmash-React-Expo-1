import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as Haptics from "expo-haptics";
import { Dimensions, Pressable, StyleSheet, Text } from "react-native";
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
          size={16}
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
          backgroundColor: colors.primary,
          shadowColor: colors.shadowColor,
          transform: [{ scale: pressed ? 0.96 : 1 }],
        },
      ]}
      onPress={handlePress}
    >
      <Text style={[styles.buttonLabel, { color: colors.background }]}>
        {label}
      </Text>
    </Pressable>
  );
}

export const styles = StyleSheet.create({
  buttonContainer: {
    width: Math.min(180, (Dimensions.get("window").width - 32) / 2),
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
    paddingHorizontal: 10,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});
