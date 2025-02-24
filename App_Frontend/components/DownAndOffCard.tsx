import { Podcast } from "@/context/GlobalProvider";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PodcastCard({
  episode,
}: {
  episode: Podcast;
}) {
  return (
    <TouchableOpacity
      onPress={() => {
        console.log("Pressed inside like");
      }}
    >
      <View style={styles.podcast_cardcontainer}>
        <Image
          source={{ uri: episode.thumbnail }}
          style={styles.thumbnailImg}
        />
        <View style={styles.card_textcontainer}>
          <Text numberOfLines={1} style={styles.cardtext}>
            {episode.title || "Untitled Podcast"} {/* Fallback for undefined title */}
          </Text>
          <Text numberOfLines={1} style={styles.cardSubtext}>
            {episode.creator.name || "Unknown Creator"} {/* Fallback for undefined creator */}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  podcast_cardcontainer: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0D7F5", // Softened border color
    alignItems: "center",
    backgroundColor: "#FFFBF5", // Card background color
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: "#C3ACD0", // Shadow color
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  card_textcontainer: {
    marginLeft: 16,
    gap: 4,
    flex: 1,
  },
  cardtext: {
    fontSize: 16,
    fontWeight: "600",
    color: "#7743DB", // Title color
  },
  cardSubtext: {
    fontSize: 14,
    color: "#C3ACD0", // Subtitle color
  },
  thumbnailImg: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
});