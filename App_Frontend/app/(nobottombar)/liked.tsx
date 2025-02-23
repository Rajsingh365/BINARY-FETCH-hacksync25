import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Podcast } from "@/data/dummy";
import { useGlobal } from "@/context/GlobalProvider";
import PodcastCard from "@/components/DownAndOffCard";

export default function Liked() {
  const { liked, setLiked } = useGlobal();
  return (
    <SafeAreaView>
      <Text>Liked Podcasts</Text>
      <View>
        <FlatList
          data={liked}
          keyExtractor={(item) => item.title}
          renderItem={({ item }) => (
            <PodcastCard
              episode={item}
              // onOpen={() => setOpenPlayer(true)}
              // onSelected={() => setSelectedPodcast(item)}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}