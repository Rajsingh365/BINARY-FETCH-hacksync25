import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Podcast } from "@/data/dummy";
import { useAudio } from "@/context/AudioContext";
import { Ionicons } from "@expo/vector-icons";

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

          {/* Controls */}
          <View style={styles.controlsContainer}>
            <TouchableOpacity style={styles.controlButton}>
              <Ionicons name="play-skip-back" size={15} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity onPress={togglePlayPause} style={styles.playButton}>
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={18}
                color="#fff"
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton}>
              <Ionicons name="play-skip-forward" size={15} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  playerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  thumbnail: {
    width: 55,
    height: 55,
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  creator: {
    fontSize: 14,
    color: "#777",
  },
  controlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  controlButton: {
    backgroundColor: "#1DB954",
    padding: 10,
    borderRadius: 20,
  },
  playButton: {
    backgroundColor: "#1DB954",
    padding: 12,
    borderRadius: 30,
  },
});
