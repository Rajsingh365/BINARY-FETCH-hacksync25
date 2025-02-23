import { AudioProvider } from "@/context/AudioContext";
import { GlobalProvider } from "@/context/GlobalProvider";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GlobalProvider>
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
     </GlobalProvider>
  );
}
