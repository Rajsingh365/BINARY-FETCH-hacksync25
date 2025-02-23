import React, { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Podcast,Podcasts } from "@/data/dummy";
import { useAudio } from "@/context/AudioContext";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";

export const BottomDrawer = ({
  onClose,
  playpodcast,
}: {
  onClose: () => void;
  playpodcast: Podcast | null;
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const {
    isPlaying,
    playAudio,
    togglePlayPause,
    stopAudio,
    positionMillis,
    durationMillis,
    seekTo,
  } = useAudio();
  const snapPoints = useMemo(() => ["18%", "99%"], []);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSeeking, setIsSeeking] = useState<boolean>(false);
  const [seekPosition, setSeekPosition] = useState<number>(positionMillis);
  const [currentPodcast, setCurrentPodcast] = useState<Podcast | null>(playpodcast);

  useEffect(() => {
    setCurrentPodcast(playpodcast);
  }, [playpodcast]);

  useEffect(() => {
    if (currentPodcast?.audio) {
      playAudio(currentPodcast.audio);
    }
    return () => {
      stopAudio();
    };
  }, [currentPodcast]);

  useEffect(() => {
    if (!isSeeking) {
      setSeekPosition(positionMillis);
    }
  }, [positionMillis, isSeeking]);

  const handleSheetChanges = useCallback((index: number) => {
    setIsExpanded(index === 1);
  }, []);

  const formatTime = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleSeek = async (value: number) => {
    setIsSeeking(false);
    await seekTo(value);
  };

    // Get the current podcast index
    const currentIndex = Podcasts.findIndex((p) => p.title === currentPodcast?.title);

    // Handle Next Podcast
    const playNextPodcast = () => {
      let nextIndex = (currentIndex + 1) % Podcasts.length; // Loop back to first if last
      setCurrentPodcast(Podcasts[nextIndex]);
    };
  
    // Handle Previous Podcast
    const playPreviousPodcast = () => {
      let prevIndex = (currentIndex - 1 + Podcasts.length) % Podcasts.length; // Loop back to last if first
      setCurrentPodcast(Podcasts[prevIndex]);
    };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose
      onChange={handleSheetChanges}
      onClose={() => {
        stopAudio();
        onClose();
      }}
      handleIndicatorStyle={{ height: 0 }}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={[styles.playerContainer, isExpanded && styles.playerContainerExpanded]}>
          <Image
            source={{ uri: currentPodcast?.thumbnail }}
            style={[styles.thumbnail, isExpanded && styles.thumbnailExpanded]}
          />

          <View style={[styles.textContainer, isExpanded && styles.textContainerExpanded]}>
            <Text style={[styles.title, isExpanded && styles.titleExpanded]} numberOfLines={1}>
              {currentPodcast?.title}
            </Text>
            <Text style={[styles.creator, isExpanded && styles.creatorExpanded]} numberOfLines={1}>
              {currentPodcast?.contentCreator}
            </Text>
          </View>

          {/* Controls (Always Visible) */}
          <View style={styles.controlsContainer}>
            <TouchableOpacity onPress={playPreviousPodcast} style={styles.controlButton}>
              <Ionicons name="play-skip-back" size={isExpanded ? 25 : 15} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity onPress={togglePlayPause} style={styles.playButton} >
              <Ionicons name={isPlaying ? "pause" : "play"} size={isExpanded ? 28 : 18} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity onPress={playNextPodcast} style={styles.controlButton}>
              <Ionicons name="play-skip-forward" size={isExpanded ? 25 : 15} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Seek Bar (Absolute Positioned) */}
        <View style={[styles.seekBarContainer, isExpanded && styles.seekBarExpanded]}>
          <Text style={styles.timeText}>{formatTime(seekPosition)}</Text>
          <Slider
            style={{ flex: 1 }}
            value={seekPosition}
            minimumValue={0}
            maximumValue={durationMillis}
            onValueChange={(value) => {
              setIsSeeking(true);
              setSeekPosition(value);
            }}
            onSlidingComplete={(value) => handleSeek(value)}
            minimumTrackTintColor="#1DB954"
            maximumTrackTintColor="#ccc"
            thumbTintColor="#1DB954"
          />
          <Text style={styles.timeText}>{formatTime(durationMillis)}</Text>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 8,
    backgroundColor: "#fff",
  },
  playerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  playerContainerExpanded: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  thumbnailExpanded: {
    width: 180,
    height: 180,
    borderRadius: 12,
    marginBottom: 20,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  textContainerExpanded: {
    alignItems: "center",
    marginLeft: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  titleExpanded: {
    fontSize: 22,
    textAlign: "center",
  },
  creator: {
    fontSize: 14,
    color: "#666",
  },
  creatorExpanded: {
    fontSize: 16,
    textAlign: "center",
  },
  seekBarContainer: {
    position: "absolute",
    width: "100%",
    top:70,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10
  },
  seekBarExpanded: {
    bottom: 50,
  },
  timeText: {
    fontSize: 12,
    color: "#000",
    marginHorizontal: 8,
  },
  controlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  controlButton: {
    backgroundColor: "#1DB954",
    padding: 12,
    borderRadius: 40,
    zIndex: 100
  },
  playButton: {
    backgroundColor: "#1DB954",
    padding: 14,
    borderRadius: 40,
    zIndex: 100
  },
});


