import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import {AntDesign,MaterialCommunityIcons} from '@expo/vector-icons';


export default function Library() {

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        {/* Favorites Box */}
        <TouchableOpacity
          onPress={() => router.push("/liked")}
        >
          <AntDesign name="hearto" size={24} color="black" />
          <Text>Liked Podcast</Text>
        </TouchableOpacity>

        {/* Offline Podcasts Box */}
        <TouchableOpacity
          onPress={() => router.push("/offline")}
        >
          <MaterialCommunityIcons name="cloud-download-outline" size={24} color="black" />
          <Text>Offline Podcast</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


