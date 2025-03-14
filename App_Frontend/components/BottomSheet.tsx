import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Podcast } from "@/context/GlobalProvider";
import { useAudio } from "@/context/AudioContext";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useGlobal } from "@/context/GlobalProvider";
import { useDownload } from "@/hooks/useDownload";

export const BottomDrawer = ({
  onClose,
  playpodcast,
}: {
  onClose: () => void;
  playpodcast: Podcast | null;
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { isPlaying, playAudio, togglePlayPause, stopAudio, positionMillis, durationMillis } = useAudio();
  const snapPoints = useMemo(() => ["18%", "99%"], []);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPodcast, setCurrentPodcast] = useState<Podcast | null>(playpodcast);
  const { liked, setLiked, downloaded, setDownloaded, AllPodcast: Podcasts } = useGlobal();
  const { downloadPodcast } = useDownload();

  const isLiked = currentPodcast
    ? liked.some((pod) => pod.title === currentPodcast.title)
    : false;

  const isDownload = currentPodcast
    ? downloaded.some((pod) => pod.title === currentPodcast.title)
    : false;

  useEffect(() => {
    setCurrentPodcast(playpodcast);
  }, [playpodcast]);

  useEffect(() => {
    if (currentPodcast?.audioUrl) {
      playAudio(currentPodcast.audioUrl);
    }
    return () => {
      stopAudio();
    };
  }, [currentPodcast]);

  const handleSheetChanges = useCallback((index: number) => {
    setIsExpanded(index === 1);
  }, []);

  const formatTime = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const currentIndex = Podcasts.findIndex(
    (p) => p.title === currentPodcast?.title
  );

  const playNextPodcast = () => {
    let nextIndex = (currentIndex + 1) % Podcasts.length;
    setCurrentPodcast(Podcasts[nextIndex]);
  };

  const playPreviousPodcast = () => {
    let prevIndex = (currentIndex - 1 + Podcasts.length) % Podcasts.length;
    setCurrentPodcast(Podcasts[prevIndex]);
  };

  const toggleLike = () => {
    if (currentPodcast) {
      const isCurrentlyLiked = liked.some((pod) => pod.title === currentPodcast.title);
      if (!isCurrentlyLiked) {
        setLiked([...liked, currentPodcast]);
      } else {
        setLiked(liked.filter((pod) => pod.title !== currentPodcast.title));
      }
    }
  };

  const Download = async () => {
    if (!currentPodcast) {
      Alert.alert("Error", "No podcast selected for download.");
      return;
    }
  
    const isCurrentlyDownloaded = downloaded.some((pod) => pod._id === currentPodcast._id);
  
    if (isCurrentlyDownloaded) {
      Alert.alert("Already Downloaded", "This podcast is already in your downloads.");
      return;
    }
  
    try {
      // Update the state first to reflect UI changes
      setDownloaded((prev) => [...prev, currentPodcast]);
  
      // Use an async function inside setTimeout to avoid blocking UI
      setTimeout(async () => {
        await downloadPodcast(currentPodcast);
      }, 100);
  
      Alert.alert("Download Started", "Your podcast is downloading in the background.");
    } catch (error) {
      console.error("Download failed:", error);
      Alert.alert("Download Failed", "Something went wrong while downloading.");
    }
  };
  
  
  

  const truncate = () => {
    if (currentPodcast && currentPodcast?.title.length > 10) {
      return currentPodcast?.title.substring(0, 10) + '...';
    }
    return currentPodcast?.title;
  };

  const shortTitle = truncate();

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
        <View
          style={[
            styles.playerContainer,
            isExpanded && styles.playerContainerExpanded,
          ]}
        >
          <Image
            source={{ uri: currentPodcast?.thumbnail }}
            style={[styles.thumbnail, isExpanded && styles.thumbnailExpanded]}
          />
          <View style={{ display: "flex", flexDirection: "row", marginBottom: 20 }}>
            <View
              style={[
                styles.textContainer,
                isExpanded && styles.textContainerExpanded,
              ]}
            >
              <Text
                style={[styles.title, isExpanded && styles.titleExpanded]}
                numberOfLines={1}
              >
                {isExpanded ? currentPodcast?.title : shortTitle}
              </Text>
              <Text
                style={[styles.creator, isExpanded && styles.creatorExpanded]}
                numberOfLines={1}
              >
                {currentPodcast?.creator.name}
              </Text>
            </View>

            {isExpanded && (
              <View style={{ display: "flex", flexDirection: "row", gap: 15, marginTop: 40 }}>
                <TouchableOpacity onPress={toggleLike} style={{ marginTop: 3 }}>
                  <Ionicons
                    name={isLiked ? "heart" : "heart-outline"}
                    size={30}
                    color={isLiked ? "#7743DB" : "#C3ACD0"}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={Download}>
                  <Ionicons
                    name={isDownload ? "download" : "download-outline"}
                    size={30}
                    color={isDownload ? "#7743DB" : "#C3ACD0"}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.controlsContainer}>
            <TouchableOpacity
              onPress={playPreviousPodcast}
              style={styles.controlButton}
            >
              <Ionicons
                name="play-skip-back"
                size={isExpanded ? 25 : 15}
                color="#7743DB"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={togglePlayPause}
              style={styles.playButton}
            >
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={isExpanded ? 28 : 18}
                color="#7743DB"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={playNextPodcast}
              style={styles.controlButton}
            >
              <Ionicons
                name="play-skip-forward"
                size={isExpanded ? 25 : 15}
                color="#7743DB"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={[
            styles.seekBarContainer,
            isExpanded && styles.seekBarExpanded,
          ]}
        >
          <Text style={styles.timeText}>{formatTime(positionMillis)}</Text>
          <Slider
            style={{ flex: 1 }}
            value={positionMillis}
            minimumValue={0}
            maximumValue={durationMillis}
            minimumTrackTintColor="#7743DB"
            maximumTrackTintColor="#C3ACD0"
            thumbTintColor="#7743DB"
            disabled
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
    backgroundColor: "#FFFBF5",
  },
  playerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  playerContainerExpanded: {
    flex: 1,
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
    width: 250,
    height: 250,
    borderRadius: 12,
  },
  textContainer: {
    marginLeft: 12,
    marginRight: 30,
  },
  textContainerExpanded: {
    paddingVertical: 16,
    marginTop: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#7743DB",
  },
  titleExpanded: {
    fontSize: 22,
    textAlign: "center",
    color: "#7743DB",
  },
  creator: {
    fontSize: 14,
    color: "#C3ACD0",
  },
  creatorExpanded: {
    fontSize: 16,
    textAlign: "center",
    color: "#C3ACD0",
  },
  seekBarContainer: {
    position: "absolute",
    width: "100%",
    top: 70,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
  },
  seekBarExpanded: {
    top: 540,
  },
  timeText: {
    fontSize: 12,
    color: "#7743DB",
    marginHorizontal: 8,
  },
  controlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  controlButton: {
    backgroundColor: "#F7EFE5",
    padding: 12,
    borderRadius: 40,
    zIndex: 100,
  },
  playButton: {
    backgroundColor: "#F7EFE5",
    padding: 14,
    borderRadius: 40,
    zIndex: 100,
  },
});