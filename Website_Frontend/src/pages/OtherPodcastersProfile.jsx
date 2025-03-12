"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Favorite, Visibility, Share, PersonAdd, Notifications } from "@mui/icons-material";
import { useAuthContext } from "../context/AuthContext";

const OtherPodcastersProfile = () => {
  const { user_id } = useParams();
  const [podcaster, setPodcaster] = useState(null);
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const {authToken} = useAuthContext()
  console.log('authToken', authToken);

  useEffect(() => {
    const fetchPodcaster = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/get-particular-user/${user_id}`);
        const data = await res.json();
        setPodcaster(data);
      } catch (error) {
        console.error("Error fetching podcaster:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPodcaster();
  }, [user_id]);

  useEffect(() => {

    const fetchPodcasts = async () =>{
      try{
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/podcast/creator/${user_id}`, {
          headers: {
            authorization: `Bearer ${authToken}`
          }
        })
        let data = await res.json()
        
        data = data.podcasts
        console.log('Data', data);
        

        if (Array.isArray(data)) {
          setPodcasts(data);
        } else {
          console.error("Unexpected API response format:", data);
          setPodcasts([]); // Set to an empty array to avoid `.map` errors
        }

        // setPodcasts(data)
      }catch (error) {
        console.error("Error fetching podcaster:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchPodcasts()    
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!podcaster) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-xl font-semibold text-gray-700">
        Podcaster not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-700">
          <div className="absolute top-4 right-4 flex space-x-4">
            <button className="flex items-center bg-white text-blue-600 px-4 py-2 rounded-full shadow-md hover:bg-blue-50 transition-colors">
              <PersonAdd className="mr-2" />
              Follow
            </button>
            <button className="flex items-center bg-white text-blue-600 px-4 py-2 rounded-full shadow-md hover:bg-blue-50 transition-colors">
              <Share className="mr-2" />
              Share
            </button>
            <button className="flex items-center bg-white text-yellow-500 px-4 py-2 rounded-full shadow-md hover:bg-yellow-50 transition-colors">
              <Notifications className="mr-2" />
              Notify Me
            </button>
          </div>
          <div className="absolute -bottom-20 left-8">
            <img
              src={
                podcaster.profilePic ||
                "https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-855.jpg?w=900"
              }
              alt={podcaster.name}
              className="w-40 h-40 rounded-full border-4 border-white object-cover shadow-lg"
            />
          </div>
        </div>

        <div className="px-8 pt-24 pb-8">
          <h1 className="text-4xl font-bold text-gray-800">{podcaster.name}</h1>
          <p className="text-gray-600 mt-2">{podcaster.email}</p>
          <h2 className="text-2xl font-semibold text-gray-800 mt-6">Genres</h2>
          <div className="flex flex-wrap gap-2 mt-2">
            {podcaster.genres.map((genre, index) => (
              <span key={index} className="px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {genre}
              </span>
            ))}
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mt-12">Podcasts</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-4">
            {podcasts.map((podcast) => (
              <div key={podcast._id} className="bg-gray-50 rounded-xl shadow-md overflow-hidden hover:scale-105 transition-transform">
                <img src={podcast.thumbnail} alt={podcast.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">{podcast.title}</h3>
                  <div className="flex gap-2 mb-3">
                    {podcast.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-green-200 text-green-800 text-xs font-medium rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <audio controls className="w-full mb-4 border border-blue-500 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
                    <source src={podcast.audioUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                  <div className="flex justify-between text-gray-600 text-sm">
                    <div className="flex items-center"><Visibility className="mr-1 text-blue-500" /><span>{podcast.views} views</span></div>
                    <div className="flex items-center"><Favorite className="mr-1 text-red-500" /><span>{podcast.likes} likes</span></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherPodcastersProfile;
