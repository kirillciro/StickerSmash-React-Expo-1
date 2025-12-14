import { SplashScreen } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

export default function RocketSplash({ onFinish }: { onFinish: () => void }) {
  const hasFinished = useRef(false);
  const squareFade = useRef(new Animated.Value(0)).current;
  const squareRotate = useRef(new Animated.Value(0)).current;
  const textFade = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const [percent, setPercent] = useState(0);

  const handleFinish = async () => {
    if (hasFinished.current) return;
    hasFinished.current = true;
    await SplashScreen.hideAsync();
    onFinish();
  };

  useEffect(() => {
    // Ensure fresh values on mount (helps with Expo Go reloads)
    squareFade.setValue(0);
    squareRotate.setValue(0);
    textFade.setValue(0);
    progress.setValue(0);

    // Step 1: Square fades in and rotates
    Animated.sequence([
      Animated.parallel([
        Animated.timing(squareFade, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(squareRotate, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      // Step 2: After rotation, fade in text
      Animated.timing(textFade, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Progress bar: 0 -> 100% over 4s
    const progressAnim = Animated.timing(progress, {
      toValue: 1,
      duration: 4000,
      useNativeDriver: false, // width animation can't use native driver
    });
    progressAnim.start();

    const subId = progress.addListener(({ value }) => {
      setPercent(Math.min(100, Math.round(value * 100)));
    });

    const timeout = setTimeout(handleFinish, 4000);
    return () => {
      clearTimeout(timeout);
      progress.removeListener(subId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rotation = squareRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.square,
          {
            opacity: squareFade,
            transform: [{ rotate: rotation }],
          },
        ]}
      >
        <Animated.Text style={[styles.title, { opacity: textFade }]}>
          Sticker Smash
        </Animated.Text>
      </Animated.View>
      <View style={styles.progressTrack}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 250],
              }),
            },
          ]}
        />
      </View>
      <Text style={styles.progressText}>{percent}%</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#272727",
    alignItems: "center",
    justifyContent: "center",
  },
  square: {
    width: 250,
    height: 250,
    backgroundColor: "#0edee2ff",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000000",
    letterSpacing: 1,
    textAlign: "center",
  },
  progressTrack: {
    width: 250,
    height: 10,
    backgroundColor: "#3a3a3a",
    borderRadius: 5,
    marginTop: 150,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#d4ba0dff",
  },
  progressText: {
    marginTop: 8,
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});
