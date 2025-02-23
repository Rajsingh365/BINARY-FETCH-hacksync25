import React, { useState } from "react";
import { webinarsData } from "./../utils/webinardata.js";
import { FaCalendarAlt } from "react-icons/fa";

// Webinar Component
export const Webinar = () => {
  const [webinars] = useState(webinarsData);

  return (
    <div className="p-14 bg-gray-50 py-[5rem]">
      <h1 className="text-3xl font-bold mb-4 text-green-600">Upcoming Webinars</h1>
      <div className="grid grid-cols-1 gap-4">
        {webinars.map((webinar) => (
          <div
            key={webinar.id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-300"
          >
            <h2 className="font-semibold text-lg">{webinar.title}</h2>
            <p className="text-gray-600">{new Date(webinar.date).toLocaleString()}</p>
            <p className="mt-2">{webinar.description}</p>
            <a
              href={webinar.meetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block bg-green-500 text-white rounded py-2 px-4 hover:bg-green-600 transition-colors duration-200"
            >
              Join Webinar <FaCalendarAlt className="inline ml-1" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Webinar;