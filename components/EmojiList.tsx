import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import {
  FlatList,
  ImageSourcePropType,
  Platform,
  Pressable,
  StyleSheet,
} from "react-native";
import { useTheme } from "../context/ThemeContext";

type Props = {
  onSelect: (image: ImageSourcePropType) => void;
  onCloseModal: () => void;
};

export default function EmojiList({ onSelect, onCloseModal }: Props) {
  const { theme } = useTheme();
  const { colors } = theme;

  const emoji = [
    require("../assets/images/emoji1.png"),
    require("../assets/images/emoji2.png"),
    require("../assets/images/emoji3.png"),
    require("../assets/images/emoji4.png"),
    require("../assets/images/emoji5.png"),
    require("../assets/images/emoji6.png"),
  ];

  const handleSelect = (item: ImageSourcePropType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(item);
    onCloseModal();
  };

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={Platform.OS === "web"}
      data={emoji}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item, index }) => (
        <Pressable
          style={({ pressed }) => [
            styles.emojiContainer,
            {
              backgroundColor: colors.glassBackground,
              borderColor: colors.glassBorder,
              transform: [{ scale: pressed ? 0.9 : 1 }],
            },
          ]}
          onPress={() => handleSelect(item)}
        >
          <Image source={item} key={index} style={styles.image} />
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  emojiContainer: {
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
  },
  image: {
    width: 80,
    height: 80,
  },
});
