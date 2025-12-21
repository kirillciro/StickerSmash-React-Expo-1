import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider, useTheme } from "../context/ThemeContext";

function AppContent() {
  const { theme } = useTheme();

  useEffect(() => {
    // Hide splash screen after app is fully loaded
    const hideSplash = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // 1.5 seconds
      await SplashScreen.hideAsync();
    };
    hideSplash();
  }, []);

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
