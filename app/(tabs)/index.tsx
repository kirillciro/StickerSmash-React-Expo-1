import domtoimage from "dom-to-image";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  ImageSourcePropType,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { captureRef } from "react-native-view-shot";

import Button from "@/components/Button";
import CameraButton from "@/components/CameraButton";
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
  const { height: screenHeight } = Dimensions.get("window");
  const isLargeIPhone = Platform.OS === "ios" && screenHeight > 800;

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
    {
      image: string | undefined;
      emoji: ImageSourcePropType | undefined;
      filter: string;
    }[]
  >([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [cameraPermission, requestCameraPermission] =
    ImagePicker.useCameraPermissions();
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
    if (!cameraPermission?.granted) {
      requestCameraPermission();
    }
  }, [
    permissionResponse?.granted,
    requestPermission,
    cameraPermission?.granted,
    requestCameraPermission,
  ]);

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

  const takePictureAsync = async () => {
    if (!cameraPermission?.granted) {
      const permission = await requestCameraPermission();
      if (!permission.granted) {
        alert("Camera permission is required to take photos.");
        return;
      }
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
      saveToHistory();
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
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top", "left", "right"]}
    >
      <GestureHandlerRootView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View
          style={[
            styles.headerControls,
            isLargeIPhone && styles.headerControlsLarge,
          ]}
        >
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
          <View
            style={[
              styles.footerSection,
              isLargeIPhone && styles.footerSectionLarge,
            ]}
          >
            <View style={styles.buttonRow}>
              <FilterButton
                onApplyFilter={handleFilterApply}
                currentFilter={currentFilter}
              />
            </View>
            <View style={styles.buttonRow}>
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
          <View
            style={[
              styles.footerSection,
              isLargeIPhone && styles.footerSectionLarge,
            ]}
          >
            <View style={styles.buttonRow}>
              <Button
                theme="primary"
                label="Choose Photo"
                onPress={pickImageAsync}
              />
              <CameraButton onPress={takePictureAsync} />
            </View>
            <Button
              label="Use this photo"
              onPress={() => setShowAppOptions(true)}
            />
          </View>
        )}
        {isModalVisible && (
          <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
            <EmojiList
              onSelect={(emoji) => {
                setPickedEmoji(emoji);
                saveToHistory();
              }}
              onCloseModal={onModalClose}
            />
          </EmojiPicker>
        )}
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  headerControls: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    zIndex: 100,
  },
  headerControlsLarge: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  imageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 180,
  },
  footerSection: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 120 : 100,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: "center",
    gap: 10,
    zIndex: 100,
  },
  footerSectionLarge: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 34,
    gap: 12,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
});
