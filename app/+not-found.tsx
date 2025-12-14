import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function NotFoundPage() {
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Oops! Page Not Found",
          headerTitleAlign: "center",
        }}
      />
      <View style={styles.container}>
        <Text style={styles.text}>Page not found.</Text>
        <Link href="/" style={styles.button}>
          Go back to Home
        </Link>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#272727ff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#ffffff",
    fontSize: 20,
  },
  button: {
    fontSize: 18,
    marginTop: 20,
    padding: 10,
    backgroundColor: "#444444",
    borderRadius: 5,
    color: "#ffffff",
  },
});
