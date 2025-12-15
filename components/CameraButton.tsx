import { FontAwesome } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Pressable, Text } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { styles } from "./Button";

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
