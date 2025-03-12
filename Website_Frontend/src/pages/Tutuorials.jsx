import React, { useState, useEffect } from 'react';

const videos = [
  { title: 'How to Start a Podcast', videoId: 'mwFYiFZO6sI' },
  { title: 'Best Microphones for Podcasting', videoId: '_pZDAnkE34I' },
  { title: 'Podcast Editing Basics', videoId: 'YX8HT0sZ9Lo&t' },
  { title: 'How to Market Your Podcast', videoId: '5aNu7DOsP4' },
  { title: 'Tips for Recording High-Quality Audio', videoId: 'OFo1VsOy-5M' },
  { title: 'Interviewing Techniques for Podcasts', videoId: 'E_U5MfTs_0w' },
  { title: 'Podcast Hosting and Distribution', videoId: 'uwLKjpy0zk0' },
  { title: 'Monetizing Your Podcast', videoId: 'cM_wQ9JU3Hc' },
  { title: 'Podcast Branding and Design', videoId: '0aVaqumi01o' }
];

const Tutorials = () => {
  const [youtubeVideos, setYoutubeVideos] = useState([]);

  useEffect(() => {
    // Simulate fetching video data
    setYoutubeVideos(videos);
  }, []);

  return (
    <div className="container mx-auto mt-8 p-6 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-4xl font-bold mb-6 text-gray-900">Podcasting Tutorials</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {youtubeVideos.map((video, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">{video.title}</h3>
            <iframe
              width="100%"
              height="200"
              src={`https://www.youtube.com/embed/${video.videoId}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={video.title}
              className="rounded-lg"
            ></iframe>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tutorials;
