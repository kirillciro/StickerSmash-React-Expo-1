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

  console.log("ImageViewer currentFilter:", currentFilter);

  const imageSource = selectedImage ? { uri: selectedImage } : imgSource;

  // Simple but visible filter effects
  const getFilterOverlay = () => {
    if (currentFilter === "none") return null;

    let overlayStyle = {};
    let badgeText =
      currentFilter.charAt(0).toUpperCase() + currentFilter.slice(1);

    switch (currentFilter) {
      case "sepia":
        overlayStyle = { backgroundColor: "rgba(139, 69, 19, 0.6)" };
        break;
      case "blur":
        overlayStyle = { backgroundColor: "rgba(255, 255, 255, 0.4)" };
        break;
      case "grayscale":
        overlayStyle = { backgroundColor: "rgba(0, 0, 0, 0.4)" };
        break;
      case "invert":
        overlayStyle = { backgroundColor: "rgba(100, 150, 255, 0.5)" };
        break;
      default:
        return null;
    }

    return (
      <View style={[styles.fullFilterOverlay, overlayStyle]}>
        <View
          style={[
            styles.filterBadge,
            {
              backgroundColor: colors.primary,
              position: "absolute",
              top: 16,
              right: 16,
            },
          ]}
        >
          <Text style={[styles.filterLabel, { color: colors.background }]}>
            {badgeText}
          </Text>
        </View>
      </View>
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
    width: 320,
    height: 440,
    borderRadius: 24,
    shadowOffset: {
      width: 0,
      height: 16,
    },
    shadowOpacity: 0.4,
    shadowRadius: 32,
    elevation: 16,
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
});
