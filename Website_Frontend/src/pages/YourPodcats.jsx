import { useState, useEffect } from "react";
import axios from "axios";
import { Visibility, Favorite, AccessTime } from "@mui/icons-material";
import { useAuthContext } from "../context/AuthContext";

export default function PodcastList() {
  const { authToken } = useAuthContext();
  const [podcasts, setPodcasts] = useState([]);
  const [activeTab, setActiveTab] = useState("uploaded");
  const [sortBy, setSortBy] = useState("newest"); // Default sorting

  useEffect(() => {
    fetchPodcasts();
  }, []);

  const fetchPodcasts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/podcast`, {
        headers: { authorization: `Bearer ${authToken}` },
      });
      setPodcasts(response.data.podcasts);
    } catch (error) {
      console.error("Error fetching podcasts:", error);
    }
  };

  // Sorting Function
  const sortedPodcasts = [...podcasts]
    .filter((podcast) => podcast.status === activeTab) // Filter by active tab
    .sort((a, b) => {
      if (sortBy === "views") return b.views - a.views; // Most Viewed
      if (sortBy === "likes") return b.likes - a.likes; // Most Liked
      if (sortBy === "engagement") return b.views + b.likes - (a.views + a.likes); // Views + Likes Combined
      if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt); // Oldest First
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt); // Newest First
      return 0;
    });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Your Podcasts</h2>

      {/* Tabs Navigation */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab("uploaded")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "uploaded" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Uploaded
          </button>
          <button
            onClick={() => setActiveTab("scheduled")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "scheduled" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Scheduled
          </button>
        </div>

        {/* Sort Dropdown */}
        <div>
          <label className="text-gray-600 font-medium">Sort By: </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="ml-2 px-3 py-1 border border-gray-300 rounded-lg focus:ring focus:ring-blue-400 outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="views">Most Viewed</option>
            <option value="likes">Most Liked</option>
            <option value="engagement">Views + Likes (Most Engaged)</option>
          </select>
        </div>
      </div>

      {/* Podcasts List (Now Fits 4 Cards per Row on Large Screens) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {sortedPodcasts.length !== 0 ? (
          sortedPodcasts.map((podcast) => (
            <div key={podcast._id} className="bg-gray-50 rounded-lg shadow-md overflow-hidden hover:scale-105 transition-transform text-sm">
              <img src={podcast.thumbnail} alt={podcast.title} className="w-full h-36 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{podcast.title}</h3>

                {/* Show Scheduled Date if Podcast is Scheduled */}
                {podcast.status === "scheduled" && (
                  <div className="flex items-center text-gray-600 text-xs mb-2">
                    <AccessTime className="mr-1 text-yellow-500" />
                    <span>Scheduled for: {new Date(podcast.scheduleTime).toLocaleString()}</span>
                  </div>
                )}

                {/* Tags */}
                <div className="flex gap-1 mb-2">
                  {podcast.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-200 text-blue-800 text-xs font-medium rounded-full">{tag}</span>
                  ))}
                </div>

                {/* Audio Player */}
                <audio controls className="w-full mb-2 border border-blue-500 rounded-md shadow-sm">
                  <source src={podcast.audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>

                {/* Views & Likes */}
                <div className="flex justify-between text-gray-600 text-xs">
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
