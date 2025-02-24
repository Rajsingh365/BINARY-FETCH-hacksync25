import { createContext, useState, useContext, useEffect, useRef } from "react";
// import { Podcast } from "@/data/dummy";

export interface Creator {
  _id: string;
  name: string;
  email: string;
}
export interface Podcast {
  _id: string;
  creator: Creator; // Populated creator object
  title: string;
  script: string;
  audioUrl: string;
  tags: string[];
  thumbnail: string;
  status: "scheduled" | "uploaded";
  scheduleTime?: string | null;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetPodcastsResponse {
  count: number;
  podcasts: Podcast[];
}
export interface User {
  _id: string;
  name: string;
  email: string;
  preferences: string[];
  token: string;
}


interface GlobalContextType {
  liked: Podcast[];
  setLiked: React.Dispatch<React.SetStateAction<Podcast[]>>;

  downloaded: Podcast[];
  setDownloaded: React.Dispatch<React.SetStateAction<Podcast[]>>;

  AllPodcast: Podcast[];

  authuser: User | null;
  setAuthuser: React.Dispatch<React.SetStateAction<User | null>>;
}

const GlobalContext = createContext<GlobalContextType | null>(null);

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [liked, setLiked] = useState<Podcast[]>([]);
  const [downloaded, setDownloaded] = useState<Podcast[]>([]);
  const [AllPodcast, setAllPodcast] = useState<Podcast[]>([]);
  const [authuser, setAuthuser] = useState<User | null>(null);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URI}/api/app/podcasts`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        console.log("Response Status:", response.status);
  
        // Check if response is OK and has content
        if (response.ok) {
          const text = await response.text(); // Read as text first
          console.log("Raw Response:", text);
  
          if (text) {
            const data: GetPodcastsResponse = JSON.parse(text); // Parse only if not empty
            console.log("Parsed Data:", data);
            setAllPodcast(data.podcasts);
          } else {
            console.log("Empty response body");
          }
        } else {
          console.error(`Request failed with status: ${response.status}`);
        }
      } catch (error: any) {
        console.log("Backend URL:", process.env.EXPO_PUBLIC_BACKEND_URI);
        console.log("Error in fetching all the podcasts in global context", error);
      }
    };
  
    fetchPodcasts();
  }, []);
  

  return (
    <GlobalContext.Provider
      value={{
        liked,
        setLiked,
        downloaded,
        setDownloaded,
        AllPodcast,
        authuser,
        setAuthuser
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobal must be used within an GlobalProvider");
  }
  return context;
};
