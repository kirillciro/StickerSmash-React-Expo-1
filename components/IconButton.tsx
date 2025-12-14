import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Haptics from "expo-haptics";
import { Pressable, StyleSheet, Text } from "react-native";
import { useTheme } from "../context/ThemeContext";

type Props = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
};

export default function IconButton({ icon, label, onPress }: Props) {
  const { theme } = useTheme();
  const { colors } = theme;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.iconButton,
        {
          backgroundColor: colors.glassBackground,
          borderColor: colors.glassBorder,
          shadowColor: colors.shadowColor,
          transform: [{ scale: pressed ? 0.9 : 1 }],
        },
      ]}
      onPress={handlePress}
    >
      <MaterialIcons name={icon} size={24} color={colors.primary} />
      <Text style={[styles.iconButtonLabel, { color: colors.text }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  iconButtonLabel: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
});
