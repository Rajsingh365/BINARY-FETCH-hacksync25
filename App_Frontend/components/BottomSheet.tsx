import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Podcast } from "@/data/dummy";
import { useAudio } from "@/context/AudioContext";

export const BottomDrawer = ({
  onClose,
  playpodcast,
}: {
  onClose: () => void;
  playpodcast: Podcast | null;
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { isPlaying, playAudio, togglePlayPause, stopAudio } = useAudio();

  // Load audio when playpodcast changes
  useEffect(() => {
    if (playpodcast?.audio) {
      playAudio(playpodcast.audio);
    }

    // Cleanup audio when BottomSheet unmounts
    return () => {
      stopAudio();
    };
  }, [playpodcast]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={["15%", "99%"]}
      enablePanDownToClose
      onClose={() => {
        stopAudio(); // Stop audio when sheet closes
        onClose();
      }}
      handleIndicatorStyle={{ height: 0 }}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.playerContainer}>
          {/* Thumbnail */}
          <Image
            source={{ uri: playpodcast?.thumbnail }}
            style={styles.thumbnail}
          />

          {/* Title and Creator */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>{playpodcast?.title}</Text>
            <Text style={styles.creator}>{playpodcast?.contentCreator}</Text>
          </View>

          {/* Play/Pause Button */}
          <TouchableOpacity onPress={togglePlayPause} style={styles.playButton}>
            <Text style={styles.playButtonText}>
              {isPlaying ? "Pause" : "Play"}
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  playerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  creator: {
    fontSize: 14,
    color: "#666",
  },
  playButton: {
    backgroundColor: "#1DB954",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  playButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
