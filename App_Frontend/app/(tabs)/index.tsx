import { useState } from "react";
import { BottomDrawer } from "@/components/BottomSheet";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Podcast, Podcasts } from "@/data/dummy";

export default function Home() {
  const groupedPodcasts = makeGroups(Podcasts);
  const [openPlayer, setOpenPlayer] = useState(false);
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        {/* Quick Picks */}
        <View style={{ height: 350 }}>
          <View style={styles.headingsContainer}>
            <Text style={styles.headingtext}>Quick Picks</Text>
          </View>
          <View style={{ flex: 1 }}>
            <FlatList
              data={groupedPodcasts}
              keyExtractor={(_, index) => index.toString()}
              horizontal
              snapToInterval={310}
              decelerationRate="fast"
              renderItem={({ item: group }) => (
                <FlatList
                  data={group}
                  keyExtractor={(item) => item.title}
                  renderItem={({ item }) => (
                    <PodcastCard
                      episode={item}
                      onOpen={() => setOpenPlayer(true)}
                      onSelected={() => setSelectedPodcast(item)}
                    />
                  )}
                />
              )}
            />
          </View>
        </View>

        {/* Top Creators */}
        <View style={{ marginVertical: 5 }}>
          <View style={styles.headingsContainer}>
            <Text style={styles.headingtext}>Top Creators</Text>
          </View>
          <FlatList
            data={Podcasts}
            keyExtractor={(item) => item.contentCreator}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
            renderItem={({ item }) => <CreatorCard creator={item} />}
          />
        </View>

        {/* Creator's Special */}
        <View style={{ marginVertical: 5 }}>
          <View style={styles.headingsContainer}>
            <Text style={styles.headingtext}>Creator's Special</Text>
          </View>
          <FlatList
            data={Podcasts}
            keyExtractor={(item) => item.contentCreator}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
            renderItem={({ item }) => (
              <CreatorSpecialCard
                podcast={item}
                onOpen={() => setOpenPlayer(true)}
                onSelected={() => setSelectedPodcast(item)}
              />
            )}
          />
        </View>
      </ScrollView>
      {openPlayer && <BottomDrawer onClose={() => setOpenPlayer(false)} playpodcast={selectedPodcast} />}
    </SafeAreaView>
  );
}

function PodcastCard({
  episode,
  onOpen,
  onSelected,
}: {
  episode: Podcast;
  onOpen: () => void;
  onSelected: () => void;
}) {
  return (
    <TouchableOpacity onPress={() => {
      onOpen();
      onSelected();
    }}>
      <View style={styles.podcast_cardcontainer}>
        <Image
          source={{ uri: episode.thumbnail }}
          style={styles.thumbnailImg}
        />
        <View style={styles.card_textcontainer}>
          <Text numberOfLines={1} style={styles.cardtext}>{episode.title}</Text>
          <Text numberOfLines={1} style={styles.cardtext}>{episode.contentCreator}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function CreatorCard({ creator }: { creator: Podcast }) {
  return (
    <TouchableOpacity>
      <View style={styles.creator_card}>
        <Image source={{ uri: creator.thumbnail }} style={styles.creatorImg} />
        <View style={styles.creator_overlay}>
          <Text numberOfLines={1} style={styles.creator_text}>{creator.contentCreator}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function CreatorSpecialCard({
  podcast,
  onOpen,
  onSelected,
}: {
  podcast: Podcast;
  onOpen: () => void;
  onSelected: () => void;
}) {
  return (
    <TouchableOpacity onPress={() => {
      onOpen();
      onSelected();
    }}>
      <View style={styles.special_card}>
        <Image source={{ uri: podcast.thumbnail }} style={styles.specialImg} />
        <View style={styles.special_textContainer}>
          <Text
            style={styles.special_title}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {podcast.title}
          </Text>
          <Text
            style={styles.special_title}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {podcast.contentCreator}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function makeGroups(data: Podcast[]): Podcast[][] {
  let groupedData: Podcast[][] = [];
  let group: Podcast[] = [];

  for (let i = 0; i < data.length; i++) {
    group.push(data[i]);
    if (group.length === 3) {
      groupedData.push(group);
      group = [];
    }
  }

  if (group.length > 0) {
    groupedData.push(group);
  }

  return groupedData;
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
  headingsContainer: {
    padding: 2,
  },
  headingtext: {
    fontSize: 20,
    padding: 4,
  },

  creator_card: {
    width: 130,
    height: 130,
    borderRadius: 10,
    overflow: "hidden",
    marginRight: 10,
    position: "relative",
  },
  creatorImg: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  creator_overlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    paddingVertical: 5,
    alignItems: "center",
  },
  creator_text: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },

  // Creator's Special Card (Same as Top Creator Card)
  special_card: {
    width: 130,
    height: 130,
    borderRadius: 10,
    overflow: "hidden",
    marginRight: 10,
    position: "relative",
  },
  specialImg: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  special_textContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    paddingVertical: 5,
    alignItems: "center",
  },
  special_title: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
