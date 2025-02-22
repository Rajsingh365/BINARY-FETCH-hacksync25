import { BottomDrawer } from "@/components/BottomSheet";
import { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function home() {
  const [openPlayer, setOpenPlayer] = useState(false);
  return (
    <SafeAreaView style={{ flex: 1}}>
      <View style={{ flex: 1}}>
        <Text>home</Text>
        <TouchableOpacity onPress={() => setOpenPlayer(true)}>
          <Text>Open bottom drawer</Text>
        </TouchableOpacity>
        {openPlayer && <BottomDrawer onClose={() => setOpenPlayer(false)}/>}
      </View>
    </SafeAreaView>
  );
}
