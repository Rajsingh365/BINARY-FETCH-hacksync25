import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const CARD_SIZE = (width - 48) / 2; // Adjusted for side-by-side layout

export default function Library() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9F9F9" }}>
      <View style={styles.container}>
        {/* Favorites Box */}
        <View style={styles.cardWrapper}>
          <TouchableOpacity
            style={styles.squareCard}
            onPress={() => router.push("/liked")}
          >
            <AntDesign name="hearto" size={50} color="#FF6B6B" />
          </TouchableOpacity>
          <Text style={styles.cardTitle}>Liked Podcasts</Text>
        </View>

        {/* Offline Podcasts Box */}
        <View style={styles.cardWrapper}>
          <TouchableOpacity
            style={styles.squareCard}
            onPress={() => router.push("/offline")}
          >
            <MaterialCommunityIcons
              name="cloud-download-outline"
              size={50}
              color="#4D96FF"
            />
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
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  cardTitle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
});
