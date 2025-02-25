import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobal } from "@/context/GlobalProvider";
import PodcastCard from "@/components/DownAndOffCard";

export default function Offline() {
  const { downloaded } = useGlobal();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Offline Podcasts</Text>

      {/* List of Downloaded Podcasts */}
      <FlatList
        data={downloaded}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <PodcastCard
            episode={item}
            // onOpen={() => setOpenPlayer(true)}
            // onSelected={() => setSelectedPodcast(item)}
          />
        )}
        contentContainerStyle={styles.flatListContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFBF5", // Background color for the entire screen
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#7743DB", // Header text color
    padding: 16,
  },
  flatListContainer: {
    paddingHorizontal: 16,
  },
});