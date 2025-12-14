import { useTheme } from "@/context/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function AboutScreen() {
  const { theme } = useTheme();
  const { colors } = theme;

  const features = [
    {
      icon: "photo",
      title: "Image Selection",
      description: "Choose photos from your gallery or use the default image",
    },
    {
      icon: "emoji-emotions",
      title: "Emoji Stickers",
      description: "Add fun emoji stickers to your photos with touch gestures",
    },
    {
      icon: "palette",
      title: "Image Filters",
      description: "Apply sepia, blur, grayscale, and invert filters",
    },
    {
      icon: "undo",
      title: "Undo/Redo",
      description: "Full history management with undo and redo functionality",
    },
    {
      icon: "dark-mode",
      title: "Theme Switcher",
      description: "Toggle between warm light and cozy dark themes",
    },
    {
      icon: "vibration",
      title: "Haptic Feedback",
      description: "Tactile feedback for all interactions and gestures",
    },
    {
      icon: "save",
      title: "Save to Gallery",
      description:
        "Save your creations directly to your device's photo library",
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            StickerSmash
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Create amazing photo memories with stickers and filters
          </Text>
          <Text style={[styles.version, { color: colors.textTertiary }]}>
            Version 2.0 • 2025 Edition
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Features
          </Text>

          {features.map((feature, index) => (
            <View
              key={index}
              style={[
                styles.featureCard,
                {
                  backgroundColor: colors.glassBackground,
                  borderColor: colors.glassBorder,
                },
              ]}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: colors.primaryVariant },
                ]}
              >
                <MaterialIcons
                  name={feature.icon as any}
                  size={24}
                  color={colors.background}
                />
              </View>
              <View style={styles.featureText}>
                <Text style={[styles.featureTitle, { color: colors.text }]}>
                  {feature.title}
                </Text>
                <Text
                  style={[
                    styles.featureDescription,
                    { color: colors.textSecondary },
                  ]}
                >
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textTertiary }]}>
            Built with React Native & Expo
          </Text>
          <Text style={[styles.footerText, { color: colors.textTertiary }]}>
            Warm color palettes for a friendly experience
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 8,
  },
  version: {
    fontSize: 14,
    fontWeight: "500",
  },
  featuresContainer: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  featureCard: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    alignItems: "center",
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  footerText: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 4,
  },
});
