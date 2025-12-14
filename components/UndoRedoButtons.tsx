import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../context/ThemeContext";

interface UndoRedoButtonsProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

export default function UndoRedoButtons({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: UndoRedoButtonsProps) {
  const { theme } = useTheme();
  const { colors } = theme;

  const handleUndo = () => {
    if (canUndo) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onUndo();
    }
  };

  const handleRedo = () => {
    if (canRedo) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onRedo();
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: canUndo
              ? colors.glassBackground
              : colors.surfaceVariant,
            borderColor: canUndo ? colors.glassBorder : colors.textTertiary,
            shadowColor: colors.shadowColor,
            transform: [{ scale: pressed && canUndo ? 0.94 : 1 }],
            opacity: canUndo ? 1 : 0.5,
          },
        ]}
        onPress={handleUndo}
        disabled={!canUndo}
      >
        <MaterialIcons
          name="undo"
          size={18}
          color={canUndo ? colors.primary : colors.textTertiary}
        />
        <Text
          style={[
            styles.buttonText,
            { color: canUndo ? colors.text : colors.textTertiary },
          ]}
        >
          Undo
        </Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: canRedo
              ? colors.glassBackground
              : colors.surfaceVariant,
            borderColor: canRedo ? colors.glassBorder : colors.textTertiary,
            shadowColor: colors.shadowColor,
            transform: [{ scale: pressed && canRedo ? 0.94 : 1 }],
            opacity: canRedo ? 1 : 0.5,
          },
        ]}
        onPress={handleRedo}
        disabled={!canRedo}
      >
        <MaterialIcons
          name="redo"
          size={18}
          color={canRedo ? colors.primary : colors.textTertiary}
        />
        <Text
          style={[
            styles.buttonText,
            { color: canRedo ? colors.text : colors.textTertiary },
          ]}
        >
          Redo
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    gap: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
