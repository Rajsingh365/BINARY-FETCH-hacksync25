import React, { createContext, useState, useContext, useEffect, useRef } from "react";
import { Audio } from "expo-av";

interface AudioContextType {
  isPlaying: boolean;
  positionMillis: number;
  durationMillis: number;
  playAudio: (audioSource: string | number) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  stopAudio: () => Promise<void>;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [positionMillis, setPositionMillis] = useState(0);
  const [durationMillis, setDurationMillis] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const playAudio = async (audioSource: string | number) => {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }

      const { sound: newSound, status } = await Audio.Sound.createAsync(
        typeof audioSource === "string" ? { uri: audioSource } : audioSource,
        { shouldPlay: true }
      );

      setSound(newSound);
      setIsPlaying(true);

      if (status.isLoaded) {
        setDurationMillis(status.durationMillis || 1);
        setPositionMillis(status.positionMillis || 0);
      }

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setPositionMillis(status.positionMillis || 0);
          setDurationMillis(status.durationMillis || 1);
          if (status.didJustFinish) {
            setIsPlaying(false);
          }
        }
      });

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setInterval(async () => {
        if (newSound) {
          const status = await newSound.getStatusAsync();
          if (status.isLoaded) {
            setPositionMillis(status.positionMillis || 0);
          }
        }
      }, 1000);
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

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
      }
    }
  };

  const stopAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
      setPositionMillis(0);
      setDurationMillis(1);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [sound]);

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        positionMillis,
        durationMillis,
        playAudio,
        togglePlayPause,
        stopAudio,
      }}
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



