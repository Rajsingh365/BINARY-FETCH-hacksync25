import React, { createContext, useState, useContext, useEffect, useRef } from "react";
import { Audio } from "expo-av";

interface AudioContextType {
  isPlaying: boolean;
  positionMillis: number;
  durationMillis: number;
  playAudio: (audioSource: string | number) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  stopAudio: () => Promise<void>;
  seekTo: (position: number) => Promise<void>;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [positionMillis, setPositionMillis] = useState(0);
  const [durationMillis, setDurationMillis] = useState(1); // Prevent division by zero
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Play new audio
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

      // Set up playback status listener
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setPositionMillis(status.positionMillis || 0);
          setDurationMillis(status.durationMillis || 1);
          if (status.didJustFinish) {
            setIsPlaying(false);
          }
        }
      });

      // Start interval to update positionMillis
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
      setPositionMillis(0);
      setDurationMillis(1);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  // Seek to a specific position
  const seekTo = async (position: number) => {
    if (sound) {
      await sound.setPositionAsync(position);
      setPositionMillis(position); // Update positionMillis immediately
    }
  };

  // Cleanup on unmount
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
        seekTo,
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








// import React, { createContext, useState, useContext, useEffect } from "react";
// import { Audio } from "expo-av";

// interface AudioContextType {
//   isPlaying: boolean;
//   playAudio: (audioSource: string | number) => Promise<void>;
//   togglePlayPause: () => Promise<void>;
//   stopAudio: () => Promise<void>;
// }

// const AudioContext = createContext<AudioContextType | null>(null);

// export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
//   const [sound, setSound] = useState<Audio.Sound | null>(null);
//   const [isPlaying, setIsPlaying] = useState(false);

//   // Play new audio
//   const playAudio = async (audioSource: string | number) => {
//     try {
//       if (sound) {
//         await sound.stopAsync();
//         await sound.unloadAsync();
//       }

//       const { sound: newSound } = await Audio.Sound.createAsync(
//         typeof audioSource === "string" ? { uri: audioSource } : audioSource,
//         { shouldPlay: true }
//       );

//       setSound(newSound);
//       setIsPlaying(true);

//       // Listener for playback finish
//       newSound.setOnPlaybackStatusUpdate((status) => {
//         if (status.isLoaded && status.didJustFinish) {
//           setIsPlaying(false);
//         }
//       });
//     } catch (error) {
//       console.error("Error playing audio:", error);
//     }
//   };

//   // Toggle Play/Pause
//   const togglePlayPause = async () => {
//     if (sound) {
//       const status = await sound.getStatusAsync();
  
//       if (status.isLoaded) {
//         if (status.isPlaying) {
//           await sound.pauseAsync();
//           setIsPlaying(false);
//         } else {
//           await sound.playAsync();
//           setIsPlaying(true);
//         }
//       } else {
//         console.error("Audio not loaded:", status);
//       }
//     }
//   };

  
  
//   // Stop Audio
//   const stopAudio = async () => {
//     if (sound) {
//       await sound.stopAsync();
//       await sound.unloadAsync();
//       setSound(null);
//       setIsPlaying(false);
//     }
//   };

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       stopAudio();
//     };
//   }, []);

//   return (
//     <AudioContext.Provider
//       value={{ isPlaying, playAudio, togglePlayPause, stopAudio }}
//     >
//       {children}
//     </AudioContext.Provider>
//   );
// };

// export const useAudio = () => {
//   const context = useContext(AudioContext);
//   if (!context) {
//     throw new Error("useAudio must be used within an AudioProvider");
//   }
//   return context;
// };
