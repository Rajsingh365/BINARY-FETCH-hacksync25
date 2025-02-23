
export interface Podcast {
  thumbnail: string;
  title: string;
  contentCreator: string;
  audio: any;
}

export const Podcasts: Podcast[] = [
  {
    thumbnail: "https://ideogram.ai/assets/image/lossless/response/1zG6JSYRTqGgz8JbcuelMA",
    title: "Man On Bike",
    contentCreator: "John Doe",
    audio: require("@/dummyaudio/audiotest.mp3"),
  },
  {
    thumbnail: "https://ideogram.ai/assets/progressive-image/balanced/response/Dea3SpXkRLedANgL8u8cEg",
    title: "Astronauts",
    contentCreator: "Sarah Smith",
    audio: require("@/dummyaudio/audiotest.mp3"),
  },
  {
    thumbnail: "https://ideogram.ai/assets/progressive-image/balanced/response/v7ufmv7FR9eDTkMjP2e9Wg",
    title: "Door",
    contentCreator: "Alex Johnson",
    audio: require("@/dummyaudio/audiotest.mp3"),
  },
  {
    thumbnail: "https://ideogram.ai/assets/progressive-image/balanced/response/M9rIOsORQxCP8jVWH3Piww",
    title: "Pikachu",
    contentCreator: "Emily Brown",
    audio: require("@/dummyaudio/audiotest.mp3"),
  },
  {
    thumbnail: "https://ideogram.ai/assets/progressive-image/balanced/response/4zYarJ8eTKGEM_jtqq-5Lg",
    title: "Train",
    contentCreator: "Chris Evans",
    audio: require("@/dummyaudio/audiotest.mp3"),
  },
  {
    thumbnail: "https://ideogram.ai/assets/progressive-image/balanced/response/wcg7GltmTg6imOU9mRSycQ",
    title: "Clock",
    contentCreator: "Laura Wilson",
    audio: require("@/dummyaudio/audiotest.mp3"),
  },
  {
    thumbnail: "https://ideogram.ai/assets/progressive-image/balanced/response/5-kCRAWIQ9-nif_fwLY1bA",
    title: "Moonlight",
    contentCreator: "Gordon Ramsay",
    audio: require("@/dummyaudio/audiotest.mp3"),
  },
  {
    thumbnail: "https://ideogram.ai/assets/progressive-image/balanced/response/j7mxicTLTc6uqtEZF5W_AQ",
    title: "Art",
    contentCreator: "Anna Clarke",
    audio: require("@/dummyaudio/audiotest.mp3"),
  },
  {
    thumbnail: "https://ideogram.ai/assets/progressive-image/balanced/response/8Z8NmiM1RS-1GWX9_J5XIw",
    title: "Leopard",
    contentCreator: "Mark Lee",
    audio: require("@/dummyaudio/audiotest.mp3"),
  },
  {
    thumbnail: "https://ideogram.ai/assets/image/lossless/response/5l5V8brHRcOE2pq9TyOrgw",
    title: "The Infinite Rabbit Hole: Exploring the Curious, the Absurd, and the Profound in a World That Never Stops Surprising Us",
    contentCreator: "Neil Armstrong",
    audio: require("@/dummyaudio/audiotest.mp3"),
  },
];
