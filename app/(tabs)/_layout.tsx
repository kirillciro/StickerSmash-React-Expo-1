import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Tabs } from "expo-router";
import { Platform, Pressable } from "react-native";

type TabBarButtonProps = {
  onPress?: () => void;
  children: React.ReactNode;
  accessibilityState?: {
    selected: boolean;
  };
  [key: string]: any;
};

function CustomTabBarButton({
  onPress,
  children,
  accessibilityState,
  ...props
}: TabBarButtonProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  return (
    <Pressable
      {...props}
      onPress={handlePress}
      style={({ pressed }) => [
        {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          transform: [{ scale: pressed ? 0.95 : 1 }],
        },
      ]}
    >
      {children}
    </Pressable>
  );
}

export default function RootLayout() {
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: CustomTabBarButton as any,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: colors.glassBackground,
          borderTopWidth: 1,
          borderTopColor: colors.glassBorder,
          height: Platform.OS === "ios" ? 88 : 70,
          paddingTop: 8,
          paddingBottom: Platform.OS === "ios" ? 28 : 12,
          paddingHorizontal: 20,
          marginHorizontal: 16,
          marginBottom: Platform.OS === "ios" ? 34 : 16,
          borderRadius: 24,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          letterSpacing: 0.5,
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Create",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "camera" : "camera-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={
                focused ? "information-circle" : "information-circle-outline"
              }
              size={22}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
