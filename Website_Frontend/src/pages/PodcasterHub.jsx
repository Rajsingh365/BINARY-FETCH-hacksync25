import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const PodcasterHub = () => {
  const [allpodcasters, setAllPodcasters] = useState([]);

  const user_id = '67bb6cfaed3fecc5acc8d4f6';

  useEffect(() => {
    const fetchAllPodcasters = async () => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/get-all-users/` + user_id);
      const data = await res.json();
      console.log('Data', data);
      setAllPodcasters(data.podcasters);
    };
    fetchAllPodcasters();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Podcasters</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allpodcasters?.map((podcaster) => (
          <Link
            to={`/other-podcaster-hub/${podcaster._id}`}
            key={podcaster._id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <img
                  src={podcaster.profilePic || 'https://shorturl.at/lNuig'} // Fallback for missing profile pictures
                  alt={podcaster.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800">{podcaster.name}</h2>
                <p className="text-sm text-gray-600">{podcaster.email}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {podcaster.genres.map((genre, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PodcasterHub;