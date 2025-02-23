import React, { createContext, useState, useContext, useEffect } from "react";
import { Audio } from "expo-av";

interface AudioContextType {
  isPlaying: boolean;
  playAudio: (audioSource: string | number) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  stopAudio: () => Promise<void>;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Play new audio
  const playAudio = async (audioSource: string | number) => {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        typeof audioSource === "string" ? { uri: audioSource } : audioSource,
        { shouldPlay: true }
      );

      setSound(newSound);
      setIsPlaying(true);

      // Listener for playback finish
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  // Toggle Play/Pause
  const togglePlayPause = async () => {
    if (sound) {
      const status = await sound.getStatusAsync();
  
      if (status.isLoaded) {
        if (status.isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      } else {
        console.error("Audio not loaded:", status);
      }
    }
  };

  
  
  // Stop Audio
  const stopAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  return (
    <AudioContext.Provider
      value={{ isPlaying, playAudio, togglePlayPause, stopAudio }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
