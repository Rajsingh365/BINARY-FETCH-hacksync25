import { AudioProvider } from "@/context/AudioContext";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <AudioProvider>
    <GestureHandlerRootView>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="(nobottombar)"
          options={{
            headerShown: true,
            headerTitle: "",
          }}
        />
      </Stack>
    </GestureHandlerRootView>
     </AudioProvider>
  );
}
