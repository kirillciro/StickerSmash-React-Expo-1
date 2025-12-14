import { Image } from "expo-image";
import { StyleSheet } from "react-native";

type props = {
  imgSource: string;
};

export default function ImageViewer({ imgSource }: props) {
  return <Image source={imgSource} style={styles.image} />;
}
const styles = StyleSheet.create({
  image: {
    width: 320,
    height: 440,
    borderRadius: 20,
  },
});
