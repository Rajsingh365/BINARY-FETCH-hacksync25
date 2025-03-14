import { Slot } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function nobottombar() {
  return (
    <SafeAreaView style={{flex: 1}}>
        <Slot />
    </SafeAreaView>
  );
}
