import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Haptics from "expo-haptics";
import { PropsWithChildren, useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTheme } from "../context/ThemeContext";

type Props = PropsWithChildren<{
  isVisible: boolean;
  onClose: () => void;
}>;

export default function EmojiPicker({ isVisible, children, onClose }: Props) {
  const { theme } = useTheme();
  const { colors } = theme;
  const { height: screenHeight } = Dimensions.get("window");
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: screenHeight,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible, slideAnim, opacityAnim, screenHeight]);

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <Animated.View style={[styles.modalOverlay, { opacity: opacityAnim }]}>
      <Animated.View
        style={[
          styles.modalContent,
          {
            backgroundColor: colors.surface,
            borderColor: colors.glassBorder,
            transform: [{ translateY: slideAnim }],
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
        <View style={styles.emojiContainer}>{children}</View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
    zIndex: 10000,
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
  emojiContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  handle: {
    width: 40,
    height: 3,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  titleContainer: {
    height: 30,
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
