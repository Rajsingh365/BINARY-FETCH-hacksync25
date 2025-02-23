// import { Podcast } from "@/data/dummy";
import { Podcast } from "@/context/GlobalProvider";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";


export default function PodcastCard({
  episode,
  // onOpen,
  // onSelected,
}: {
  episode: Podcast;
  // onOpen: () => void;
  // onSelected: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={() => {
        console.log("Pressed inside like");        // onOpen();
        // onSelected();
      }}
    >
      <View style={styles.podcast_cardcontainer}>
        <Image
          source={{ uri: episode.thumbnail }}
          style={styles.thumbnailImg}
        />
        <View style={styles.card_textcontainer}>
          <Text numberOfLines={1} style={styles.cardtext}>
            {episode.title}
          </Text>
          <Text numberOfLines={1} style={styles.cardtext}>
            {episode.creator.name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}



const styles = StyleSheet.create({
  podcast_cardcontainer: {
    flexDirection: "row",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    alignItems: "center",
    width: 310,
  },
  card_textcontainer: {
    marginLeft: 20,
    gap: 2,
  },
  cardtext: {
    fontSize: 15,
  },
  thumbnailImg: {
    width: 60,
    height: 60,
    borderRadius: 5,
  },
});