import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
// import { Podcast, Podcasts } from "@/data/dummy";
import { Podcast} from "@/context/GlobalProvider";
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
  const {isPlaying,playAudio,togglePlayPause,stopAudio,positionMillis,durationMillis} = useAudio();
  const snapPoints = useMemo(() => ["18%", "99%"], []);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPodcast, setCurrentPodcast] = useState<Podcast | null>(playpodcast);
  const { liked,setLiked, downloaded,setDownloaded,AllPodcast: Podcasts } = useGlobal();
  const { downloadPodcast } = useDownload()

  const isLiked = currentPodcast
  ? liked.some((pod) => pod.title === currentPodcast.title)
  : false;

  const isdownload = currentPodcast
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
  

  const Download = () => {
    if (currentPodcast) {
      const isCurrentlyDownloaded = downloaded.some((pod) => pod.title === currentPodcast.title);
      if (!isCurrentlyDownloaded) {
        setDownloaded([...downloaded, currentPodcast]);
        downloadPodcast(currentPodcast);
      } else {
        Alert.alert("Downloaded");
      }
    }
  };  

  const truncate = () => {
    if(currentPodcast && currentPodcast?.title.length > 10){
      return currentPodcast?.title.substring(0, 10) + '...'
    }
    return currentPodcast?.title
  };

  const shorttitle = truncate();
  

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
                {isExpanded ? currentPodcast?.title : shorttitle}
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
                  color={isLiked ? "red" : "#1DB954"} 
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={Download}>
                  <Ionicons
                  name={isdownload ? "download" : "download-outline"} 
                  size={30} 
                  color={isdownload ? "blue" : "#1DB954"} 
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
                color="#fff"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={togglePlayPause}
              style={styles.playButton}
            >
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={isExpanded ? 28 : 18}
                color="#fff"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={playNextPodcast}
              style={styles.controlButton}
            >
              <Ionicons
                name="play-skip-forward"
                size={isExpanded ? 25 : 15}
                color="#fff"
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
            minimumTrackTintColor="#1DB954"
            maximumTrackTintColor="#ccc"
            thumbTintColor="#1DB954"
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
    backgroundColor: "#fff",
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
    // backgroundColor: "red",
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  titleExpanded: {
    fontSize: 22,
    textAlign: "center",
    color: "#000",
  },
  creator: {
    fontSize: 14,
    color: "#666",
  },
  creatorExpanded: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
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
    zIndex: 100,
  },
  playButton: {
    backgroundColor: "#1DB954",
    padding: 14,
    borderRadius: 40,
    zIndex: 100,
  },
});
