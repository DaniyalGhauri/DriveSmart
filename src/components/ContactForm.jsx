'use client';
import React, { useState } from 'react';

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    alert('Your message has been sent!');
    setFormData({ name: '', email: '', message: '' }); 
  };

  return (
    <div className=" py-10 px-6 md:px-20">
      <div className="max-w-3xl">
        <h2 className="text-4xl font-bold">
          <span className="text-green-400">Ready To Get Started</span>
        </h2>
        <p className="text-lg text-gray-700 mt-3">
          Connect with us to explore how we can deliver exceptional IT solutions for your needs.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-5xl bg-white rounded-lg p-6 mt-8">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your full name"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-semibold mb-2">Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            placeholder="Write your message..."
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
