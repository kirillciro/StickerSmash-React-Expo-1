import domtoimage from "dom-to-image";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useRef, useState } from "react";
import { ImageSourcePropType, Platform, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { captureRef } from "react-native-view-shot";

import Button from "@/components/Button";
import CircleButton from "@/components/CircleButton";
import EmojiList from "@/components/EmojiList";
import EmojiPicker from "@/components/EmojiPicker";
import FilterButton from "@/components/FilterButton";
import IconButton from "@/components/IconButton";
import ImageViewer from "@/components/ImageViewer";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import UndoRedoButtons from "@/components/UndoRedoButtons";

import EmojiSticker from "@/components/EmojiSticker";
import { useTheme } from "@/context/ThemeContext";

const PlaceholderImage = require("@/assets/images/background-image.png");

export default function Index() {
  const { theme } = useTheme();
  const { colors } = theme;

  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );
  const [showAppOptions, setShowAppOptions] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [pickedEmoji, setPickedEmoji] = useState<
    ImageSourcePropType | undefined
  >(undefined);
  const [currentFilter, setCurrentFilter] = useState<string>("none");
  const [history, setHistory] = useState<
    Array<{
      image: string | undefined;
      emoji: ImageSourcePropType | undefined;
      filter: string;
    }>
  >([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const imageRef = useRef<View>(null);

  const saveToHistory = () => {
    const newState = {
      image: selectedImage,
      emoji: pickedEmoji,
      filter: currentFilter,
    };
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const previousState = history[historyIndex - 1];
      setSelectedImage(previousState.image);
      setPickedEmoji(previousState.emoji);
      setCurrentFilter(previousState.filter);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setSelectedImage(nextState.image);
      setPickedEmoji(nextState.emoji);
      setCurrentFilter(nextState.filter);
      setHistoryIndex(historyIndex + 1);
    }
  };

  const handleFilterApply = (filter: string) => {
    setCurrentFilter(filter);
    // Save to history with the new filter value
    const newState = {
      image: selectedImage,
      emoji: pickedEmoji,
      filter: filter, // Use the new filter value directly
    };
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  useEffect(() => {
    if (!permissionResponse?.granted) {
      requestPermission();
    }
  }, [permissionResponse?.granted, requestPermission]);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
      saveToHistory();
    } else {
      alert("You did not select any image.");
    }
  };

  const onReset = () => {
    setShowAppOptions(false);
    setSelectedImage(undefined);
    setPickedEmoji(undefined);
    setCurrentFilter("none");
    setHistory([]);
    setHistoryIndex(-1);
  };

  const onAddSticker = () => {
    setIsModalVisible(true);
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  const onSaveImageAsync = async () => {
    if (Platform.OS === "web") {
      try {
        const dataUrl = await domtoimage.toJpeg(imageRef.current, {
          quality: 0.95,
          width: 320,
          height: 440,
        });

        let link = document.createElement("a");
        link.download = "sticker-smash.jpeg";
        link.href = dataUrl;
        link.click();
        alert("Saved!");
      } catch (e) {
        console.log(e);
        alert("An error occurred while saving the image.");
      }
    } else {
      try {
        if (permissionResponse?.status !== "granted") {
          const permission = await requestPermission();
          if (permission.status !== "granted") {
            alert("Sorry, we need camera roll permissions to save the image.");
            return;
          }
        }

        const localUri = await captureRef(imageRef, {
          height: 440,
          quality: 1,
        });

        await MediaLibrary.saveToLibraryAsync(localUri);
        if (localUri) {
          alert("Saved!");
        }
      } catch (e) {
        console.log(e);
        alert("An error occurred while saving the image.");
      }
    }
  };

  return (
    <GestureHandlerRootView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.headerControls}>
        <UndoRedoButtons
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          onUndo={handleUndo}
          onRedo={handleRedo}
        />
        <ThemeToggleButton />
      </View>

      <View style={styles.imageContainer}>
        <View ref={imageRef} collapsable={false}>
          <ImageViewer
            imgSource={PlaceholderImage}
            selectedImage={selectedImage}
            currentFilter={currentFilter}
          />
          {pickedEmoji && (
            <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />
          )}
        </View>
      </View>

      {showAppOptions ? (
        <View style={styles.optionsSection}>
          <FilterButton
            onApplyFilter={handleFilterApply}
            currentFilter={currentFilter}
          />
          <View
            style={[
              styles.optionsRow,
              {
                backgroundColor: colors.glassBackground,
                borderColor: colors.glassBorder,
              },
            ]}
          >
            <IconButton icon="refresh" label="Reset" onPress={onReset} />
            <CircleButton onPress={onAddSticker} />
            <IconButton
              icon="save-alt"
              label="Save"
              onPress={onSaveImageAsync}
            />
          </View>
        </View>
      ) : (
        <View style={styles.footerSection}>
          <Button
            theme="primary"
            label="Choose a photo"
            onPress={pickImageAsync}
          />
          <Button
            label="Use this photo"
            onPress={() => setShowAppOptions(true)}
          />
        </View>
      )}
      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        <EmojiList
          onSelect={(emoji) => {
            setPickedEmoji(emoji);
            saveToHistory();
          }}
          onCloseModal={onModalClose}
        />
      </EmojiPicker>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  imageContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  optionsSection: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    alignItems: "center",
    gap: 16,
  },
  footerSection: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: "center",
    gap: 16,
  },
  optionsRow: {
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 32,
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 24,
    borderWidth: 1,
  },
});
