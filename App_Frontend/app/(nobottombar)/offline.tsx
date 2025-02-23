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

export default function offline() {
  const { downloaded, setDownloaded } = useGlobal();
  return (
    <SafeAreaView>
      <View>
        <Text>Offline Podcasts</Text>
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
        />
      </View>
    </SafeAreaView>
  );
}
