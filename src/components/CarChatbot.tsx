'use client';

import { useState, useEffect } from 'react';
import { Car } from '@/types';
import { getAvailableCars } from '@/lib/firebase';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { marked } from 'marked';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function CarChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // <- toggle visibility

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      const availableCars = await getAvailableCars();
      setCars(availableCars);
    } catch (error) {
      console.error('Error loading cars:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const carData = cars.map((car) => ({
        name: car.name,
        manufacturer: car.manufacturer,
        pricePerDay: car.pricePerDay,
        features: car.features,
        fuelEfficiency: car.fuelEfficiency,
        averageRating: car.averageRating,
      }));

      const genAI = new GoogleGenerativeAI('AIzaSyAa10NZ3WLd3GGI_RYyuccr6BqtqhEJoTA');
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

      const prompt = `
You are a car rental assistant. Here are the available cars:
${JSON.stringify(carData, null, 2)}

User's question: ${userMessage}

Please provide recommendations based on the user's preferences, considering:
1. Price per day
2. Features
3. Fuel efficiency
4. User ratings
5. Manufacturer reputation

Format your response in a friendly, conversational way. Use markdown formatting: bold headings, bullet points, and short paragraphs.
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setMessages((prev) => [...prev, { role: 'assistant', content: text }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        {isOpen ? 'Close Chat' : 'Chat with Us'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-96 bg-white rounded-lg shadow-xl z-40">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">Car Rental Assistant</h3>
          </div>

          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 prose prose-sm ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                  dangerouslySetInnerHTML={{ __html: marked.parse(message.content) }}
                />
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-lg p-3">
                  Thinking...
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about car recommendations..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
