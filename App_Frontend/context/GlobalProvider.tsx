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

interface GlobalContextType {
  liked: Podcast[];
  setLiked: React.Dispatch<React.SetStateAction<Podcast[]>>;

  downloaded: Podcast[];
  setDownloaded: React.Dispatch<React.SetStateAction<Podcast[]>>;

  AllPodcast: Podcast[];
}

const GlobalContext = createContext<GlobalContextType | null>(null);

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [liked, setLiked] = useState<Podcast[]>([]);
  const [downloaded, setDownloaded] = useState<Podcast[]>([]);
  const [AllPodcast, setAllPodcast] = useState<Podcast[]>([]);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URI}/api/app/podcasts`);
        const data: GetPodcastsResponse = await response.json();
        setAllPodcast(data.podcasts);
      } catch (error : any) {
        console.log("Backend URL:", process.env.EXPO_PUBLIC_BACKEND_URI);
        console.log("Error in fetching all the podcast in global context",error);
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
        AllPodcast
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
