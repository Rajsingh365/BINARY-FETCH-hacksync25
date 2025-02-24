import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const CARD_SIZE = (width - 48) / 2; // Adjusted for side-by-side layout

export default function Library() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFBF5" }}>
      <View style={styles.container}>
        {/* Favorites Box */}
        <View style={styles.cardWrapper}>
          <TouchableOpacity
            style={styles.squareCard}
            onPress={() => router.push("/liked")}
          >
            <Text>
            <AntDesign name="hearto" size={50} color="#7743DB" />
            </Text> 
          </TouchableOpacity>
          <Text style={styles.cardTitle}>Liked Podcasts</Text>
        </View>

        {/* Offline Podcasts Box */}
        <View style={styles.cardWrapper}>
          <TouchableOpacity
            style={styles.squareCard}
            onPress={() => router.push("/offline")}
          >
            <Text>
            <MaterialCommunityIcons
              name="cloud-download-outline"
              size={50}
              color="#7743DB" // Updated icon color
            />
            </Text>
          </TouchableOpacity>
          <Text style={styles.cardTitle}>Offline Podcasts</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 16,
  },
  cardWrapper: {
    alignItems: "center",
    marginBottom: 16,
  },
  squareCard: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    backgroundColor: "#F7EFE5", // Updated card background color
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#C3ACD0", // Updated shadow color
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  cardTitle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#7743DB", // Updated text color
  },
});