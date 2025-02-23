import { createContext, useState, useContext, useEffect, useRef } from "react";
import { Podcast } from "@/data/dummy";

interface GlobalContextType {
  liked: Podcast[];
  setLiked: React.Dispatch<React.SetStateAction<Podcast[]>>;
  downloaded: Podcast[];
  setDownloaded: React.Dispatch<React.SetStateAction<Podcast[]>>;
}

const GlobalContext = createContext<GlobalContextType | null>(null);

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [liked, setLiked] = useState<Podcast[]>([]);
  const [downloaded, setDownloaded] = useState<Podcast[]>([]);

  return (
    <GlobalContext.Provider
      value={{
        liked,
        setLiked,
        downloaded,
        setDownloaded
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



