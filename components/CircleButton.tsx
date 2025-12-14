import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Haptics from "expo-haptics";
import { Pressable, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

type Props = {
  onPress: () => void;
};

export default function CircleButton({ onPress }: Props) {
  const { theme } = useTheme();
  const { colors } = theme;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.circleButton,
        {
          backgroundColor: colors.primary,
          shadowColor: colors.shadowColor,
          transform: [{ scale: pressed ? 0.9 : 1 }],
          shadowOpacity: pressed ? 0.15 : 0.3,
        },
      ]}
      onPress={handlePress}
    >
      <MaterialIcons name="add" size={28} color={colors.background} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  circleButton: {
    width: 72,
    height: 72,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 36,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowRadius: 20,
    elevation: 12,
  },
});
