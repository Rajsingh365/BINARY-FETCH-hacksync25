import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobal } from "@/context/GlobalProvider";
import PodcastCard from "@/components/DownAndOffCard";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for the heart icon

export default function Liked() {
  const { liked  = [] } = useGlobal();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Liked Podcasts</Text>

      {/* Featured Card with Heart Icon */}
      <View style={styles.featuredCard}>
        <View style={styles.heartIconContainer}>
          <Text>
          <Ionicons name="heart" size={60} color="#7743DB" /> {/* Big heart icon */}
          </Text>
        </View>
        <View style={styles.featuredTextContainer}>
          <Text style={styles.featuredTitle}>Your Favorites</Text>
          <Text style={styles.featuredSubtitle}>All your liked podcasts in one place</Text>
        </View>
      </View>

      {/* List of Liked Podcasts */}
      <FlatList
        data={liked}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <PodcastCard
            episode={item}
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
  featuredCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7EFE5", // Card background color
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#C3ACD0", // Shadow color
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  heartIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFBF5", // Background for the heart icon
  },
  featuredTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#7743DB", // Title color
  },
  featuredSubtitle: {
    fontSize: 14,
    color: "#C3ACD0", // Subtitle color
  },
  flatListContainer: {
    paddingHorizontal: 16,
  },
});