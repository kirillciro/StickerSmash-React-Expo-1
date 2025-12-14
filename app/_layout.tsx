import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import RocketSplash from "../components/RocketSplash";

export default function RootLayout() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    SplashScreen.preventAutoHideAsync().catch(() => {});
  }, []);

  if (!loaded) {
    return (
      <>
        <StatusBar style="light" />
        <RocketSplash onFinish={() => setLoaded(true)} />
      </>
    );
  }

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="light" />
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
