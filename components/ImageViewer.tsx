import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../context/ThemeContext";

type props = {
  imgSource: string;
  selectedImage?: string;
  currentFilter?: string;
};

export default function ImageViewer({
  imgSource,
  selectedImage,
  currentFilter = "none",
}: props) {
  const { theme } = useTheme();
  const { colors } = theme;

  const imageSource = selectedImage ? { uri: selectedImage } : imgSource;

  // Modern, tasteful filter effects with enhanced contrast
  const getFilterOverlay = () => {
    if (currentFilter === "none") return null;

    let overlayStyle = {};
    let secondaryOverlay = null;
    let badgeText =
      currentFilter.charAt(0).toUpperCase() + currentFilter.slice(1);

    switch (currentFilter) {
      case "sepia":
        overlayStyle = {
          backgroundColor: "rgba(218, 165, 32, 0.25)",
        };
        secondaryOverlay = {
          backgroundColor: "rgba(139, 69, 19, 0.15)",
          mixBlendMode: "multiply" as const,
        };
        break;
      case "blur":
        overlayStyle = {
          backgroundColor: "rgba(255, 255, 255, 0.12)",
          backdropFilter: "blur(2px)",
        };
        secondaryOverlay = {
          backgroundColor: "rgba(200, 220, 255, 0.08)",
          mixBlendMode: "soft-light" as const,
        };
        break;
      case "grayscale":
        overlayStyle = {
          backgroundColor: "rgba(0, 0, 0, 0.18)",
        };
        secondaryOverlay = {
          backgroundColor: "rgba(255, 255, 255, 0.06)",
          mixBlendMode: "overlay" as const,
        };
        break;
      case "invert":
        overlayStyle = {
          backgroundColor: "rgba(70, 130, 255, 0.22)",
        };
        secondaryOverlay = {
          backgroundColor: "rgba(255, 100, 150, 0.08)",
          mixBlendMode: "difference" as const,
        };
        break;
      default:
        return null;
    }

    return (
      <>
        <View style={[styles.fullFilterOverlay, overlayStyle]} />
        {secondaryOverlay && (
          <View style={[styles.fullFilterOverlay, secondaryOverlay]} />
        )}
        <View
          style={[
            styles.filterBadge,
            {
              backgroundColor: colors.glassBackground,
              borderColor: colors.glassBorder,
              position: "absolute",
              top: 16,
              right: 16,
            },
          ]}
        >
          <Text style={[styles.filterLabel, { color: colors.primary }]}>
            {badgeText}
          </Text>
        </View>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Image
        source={imageSource}
        style={[styles.image, { shadowColor: colors.shadowColor }]}
      />
      {getFilterOverlay()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  image: {
    width: 280,
    height: 380,
    borderRadius: 20,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  filterOverlay: {
    position: "absolute",
    top: 12,
    right: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  fullFilterOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  filterBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
});
