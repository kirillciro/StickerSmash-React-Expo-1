import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import RocketSplash from "../components/RocketSplash";
import { ThemeProvider, useTheme } from "../context/ThemeContext";

function AppContent() {
  const [loaded, setLoaded] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    SplashScreen.preventAutoHideAsync().catch(() => {});
  }, []);

  if (!loaded) {
    return (
      <>
        <StatusBar style={theme.mode === "dark" ? "light" : "dark"} />
        <RocketSplash onFinish={() => setLoaded(true)} />
      </>
    );
  }

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style={theme.mode === "dark" ? "light" : "dark"} />
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="+not-found"
            options={{
              title: "Not Found",
              headerShown: false,
            }}
          />
        </Stack>
      </GestureHandlerRootView>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
