import React, { useState } from "react";
import { webinarsData } from "./../utils/webinardata.js";
import { FaCalendarAlt } from "react-icons/fa";

export const Webinar = () => {
  const [webinars] = useState(webinarsData);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white py-16 px-6">
      <h1 className="text-3xl font-bold mb-8 text-black">Upcoming Webinars</h1>

      <div className="grid grid-cols-1 gap-6 w-full max-w-4xl">
        {webinars.map((webinar) => (
          <div
            key={webinar.id}
            className="bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
          >
            <h2 className="text-xl font-semibold text-black">{webinar.title}</h2>
            <p className="text-gray-600">{new Date(webinar.date).toLocaleString()}</p>
            <p className="mt-3 text-gray-800">{webinar.description}</p>
            
            <a
              href={webinar.meetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center bg-yellow-500 text-black font-semibold rounded-lg py-2 px-5 hover:bg-yellow-600 transition duration-200"
            >
              Join Webinar <FaCalendarAlt className="ml-2" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Webinar;
