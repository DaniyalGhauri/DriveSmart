"use client";

import React, { useState } from 'react';

const services = [
  { id: 1, title: 'Web Design', image: '/UI.webp' },
  { id: 2, title: 'Web Development', image: '/WebDevelopment.webp' },
  { id: 3, title: 'Digital Marketing', image: '/digitalmarketing.webp' },
  { id: 4, title: 'App Development', image: '/mobileappdevelopment.webp' },
  { id: 5, title: 'Content Creation', image: '/images/content.jpg' },
  { id: 6, title: 'Social Media', image: '/images/social.jpg' },
];

const Services = () => {
  const [showAll, setShowAll] = useState(false);
  const visibleServices = showAll ? services : services.slice(0, 3);

  return (
    <div className=" bg-gradient-to-br from-white via-green-100 to-green-200 p-8 min-h-screen">
      <div className="p-10">
        <p className="text-2xl text-green-500 mb-2">Our Services</p>
        <p className="text-5xl font-extrabold text-gray-800">Transform Your Business into</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {visibleServices.map(service => (
          <div key={service.id} className="relative rounded-xl overflow-hidden shadow-lg group">
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <h3 className="text-white text-xl font-semibold">{service.title}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <button
          onClick={() => setShowAll(!showAll)}
          className="bg-green-500 hover:bg-green-700 text-white px-6 py-2 rounded-full transition duration-300"
        >
          {showAll ? 'Show Less' : 'Show All'}
        </button>
      </div>
    </div>
  );
};

export default Services;
