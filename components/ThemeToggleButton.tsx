import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../context/ThemeContext";

interface ThemeToggleButtonProps {
  style?: any;
}

export default function ThemeToggleButton({ style }: ThemeToggleButtonProps) {
  const { theme, toggleTheme } = useTheme();
  const { colors } = theme;
  const isDark = theme.mode === "dark";

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: colors.glassBackground,
          borderColor: colors.glassBorder,
          shadowColor: colors.shadowColor,
          transform: [{ scale: pressed ? 0.94 : 1 }],
        },
        style,
      ]}
      onPress={toggleTheme}
    >
      <View style={styles.iconContainer}>
        <MaterialIcons
          name={isDark ? "wb-sunny" : "nights-stay"}
          size={20}
          color={colors.primary}
        />
      </View>
      <Text style={[styles.text, { color: colors.text }]}>
        {isDark ? "Light" : "Dark"}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    gap: 8,
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
