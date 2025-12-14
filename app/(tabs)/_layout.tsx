import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: "#272727" },
        headerTintColor: "#ffffff",
        tabBarStyle: {
          backgroundColor: "#272727",
          borderTopColor: "#272727",
          borderTopWidth: 0,
        },
        sceneStyle: { backgroundColor: "#272727" },
        tabBarActiveBackgroundColor: "#444444",
        tabBarInactiveBackgroundColor: "#272727",
        tabBarActiveTintColor: "#d4ba0dff",
        tabBarInactiveTintColor: "#888888",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: "Sticker Smash",
          headerTitleAlign: "center",
          tabBarIcon: ({ focused, color }) =>
            focused ? (
              <Ionicons name="home-sharp" size={30} color={color} />
            ) : (
              <Ionicons name="home-outline" size={30} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          headerTitle: "About Header",
          headerTitleAlign: "center",
          tabBarIcon: ({ focused, color }) =>
            focused ? (
              <Ionicons
                name="information-circle-sharp"
                size={30}
                color={color}
              />
            ) : (
              <Ionicons
                name="information-circle-outline"
                size={30}
                color={color}
              />
            ),
        }}
      />
    </Tabs>
  );
}
