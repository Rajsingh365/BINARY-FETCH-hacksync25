import { useState, useEffect } from "react";
import axios from "axios";
import { Visibility, Favorite } from "@mui/icons-material";
import { useAuthContext } from "../context/AuthContext";

export default function PodcastList() {
  const { authToken } = useAuthContext();
  const [podcasts, setPodcasts] = useState(   );
  const [activeTab, setActiveTab] = useState("uploaded");

  useEffect(() => {
    fetchPodcasts();
  }, []);

  const fetchPodcasts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/podcast`,{
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });
      setPodcasts(response.data.podcasts);
    } catch (error) {
      console.error("Error fetching podcasts:", error);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-center mb-6">Your Podcasts</h2>

      {/* Tab Navigation */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("uploaded")}
          className={`px-6 py-2 rounded-md ${
            activeTab === "uploaded"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Uploaded
        </button>
        <button
          onClick={() => setActiveTab("scheduled")}
          className={`px-6 py-2 rounded-md ${
            activeTab === "scheduled"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Scheduled
        </button>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {Array.isArray(podcasts) && podcasts.length !== 0 ? (
  podcasts
    .filter((podcast) => podcast.status === activeTab)
    .map((podcast) => (
      <div key={podcast._id} className="bg-gray-50 rounded-xl shadow-md overflow-hidden hover:scale-105 transition-transform">
        <img src={podcast.thumbnail} alt={podcast.title} className="w-full h-48 object-cover" />
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">{podcast.title}</h3>

          {/* Tags */}
          <div className="flex gap-2 mb-3">
            {podcast.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="px-3 py-1 bg-blue-200 text-blue-800 text-xs font-medium rounded-full">{tag}</span>
            ))}
          </div>

          {/* Audio Player */}
          <audio controls className="w-full mb-4 border border-blue-500 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
            <source src={podcast.audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>

          {/* Views & Likes */}
          <div className="flex justify-between text-gray-600 text-sm mb-4">
            <div className="flex items-center">
              <Visibility className="mr-1 text-blue-500" />
              <span>{podcast.views} views</span>
            </div>
            <div className="flex items-center">
              <Favorite className="mr-1 text-red-500" />
              <span>{podcast.likes} likes</span>
            </div>
          </div>
        </div>
      </div>
    ))
) : (
  <p className="text-center text-gray-600">No podcasts available</p>
)}

      </div>
    </div>
  );
}
