import { SplashScreen } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function RocketSplash({ onFinish }: { onFinish: () => void }) {
  const { theme } = useTheme();
  const { colors } = theme;

  const hasFinished = useRef(false);
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textFade = useRef(new Animated.Value(0)).current;
  const textSlide = useRef(new Animated.Value(30)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const backgroundOpacity = useRef(new Animated.Value(0)).current;
  const [percent, setPercent] = useState(0);

  const handleFinish = async () => {
    if (hasFinished.current) return;
    hasFinished.current = true;
    await SplashScreen.hideAsync();
    onFinish();
  };

  useEffect(() => {
    // Reset all animations for fresh start
    logoScale.setValue(0.5);
    logoOpacity.setValue(0);
    textFade.setValue(0);
    textSlide.setValue(30);
    progress.setValue(0);
    backgroundOpacity.setValue(0);

    // Modern entrance animation sequence
    Animated.sequence([
      // Background fade in
      Animated.timing(backgroundOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      // Logo entrance with spring effect
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 4,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // Text slides up and fades in
      Animated.parallel([
        Animated.timing(textFade, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(textSlide, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Progress animation over 4 seconds
    const progressAnim = Animated.timing(progress, {
      toValue: 1,
      duration: 4000,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    });
    progressAnim.start();

    // Update percentage display
    const progressListener = progress.addListener(({ value }) => {
      setPercent(Math.round(value * 100));
    });

    // Auto finish after 4 seconds
    const finishTimer = setTimeout(handleFinish, 4000);

    return () => {
      progress.removeListener(progressListener);
      clearTimeout(finishTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View
        style={[
          styles.backgroundOverlay,
          {
            opacity: backgroundOpacity,
            backgroundColor: colors.surface,
          },
        ]}
      />

      <View style={styles.content}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <View
            style={[
              styles.logo,
              {
                backgroundColor: colors.glassBackground,
                borderColor: colors.glassBorder,
              },
            ]}
          >
            <Text style={styles.logoIcon}>📸</Text>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: textFade,
              transform: [{ translateY: textSlide }],
            },
          ]}
        >
          <Text style={[styles.title, { color: colors.text }]}>
            StickerSmash
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Create amazing photo memories
          </Text>
        </Animated.View>

        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressTrack,
              {
                backgroundColor: colors.surfaceVariant,
              },
            ]}
          >
            <Animated.View
              style={[
                styles.progressBar,
                {
                  backgroundColor: colors.primary,
                  width: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                  }),
                },
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: colors.textTertiary }]}>
            {percent}%
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  logoIcon: {
    fontSize: 48,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 60,
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
    fontWeight: "400",
    letterSpacing: 0.5,
  },
  progressContainer: {
    width: "100%",
    alignItems: "center",
    gap: 16,
  },
  progressTrack: {
    width: "80%",
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 1,
  },
});
