'use client';
import { useState, useEffect } from 'react';
import { FiSearch, FiMapPin, FiCalendar, FiClock, FiStar, FiChevronRight } from 'react-icons/fi';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import Navbar from '../components/NavBar'
import AOS from 'aos';
import 'aos/dist/aos.css';
import Image from 'next/image';
import RoleTest from '../components/RoleTest'

const CarRentalHomepage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');

  const cars = [
    {
      id: 1,
      name: 'Tesla Model 3',
      type: 'electric',
      price: '$99/day',
      rating: 4.8,
      image: '/tesla-model3.jpg',
      seats: 5,
      transmission: 'Automatic',
    },
    {
      id: 2,
      name: 'Toyota Camry',
      type: 'sedan',
      price: '$65/day',
      rating: 4.5,
      image: '/toyota-camry.jpg',
      seats: 5,
      transmission: 'Automatic',
    },
    {
      id: 3,
      name: 'Jeep Wrangler',
      type: 'suv',
      price: '$120/day',
      rating: 4.7,
      image: '/jeep-wrangler.jpg',
      seats: 5,
      transmission: 'Manual',
    },
    {
      id: 4,
      name: 'Ford Mustang',
      type: 'sports',
      price: '$150/day',
      rating: 4.9,
      image: '/ford-mustang.jpg',
      seats: 4,
      transmission: 'Automatic',
    },
    {
      id: 5,
      name: 'Honda Civic',
      type: 'sedan',
      price: '$60/day',
      rating: 4.4,
      image: '/honda-civic.jpg',
      seats: 5,
      transmission: 'Automatic',
    },
    {
      id: 6,
      name: 'Chevrolet Tahoe',
      type: 'suv',
      price: '$110/day',
      rating: 4.6,
      image: '/chevrolet-tahoe.jpg',
      seats: 8,
      transmission: 'Automatic',
    },
  ];

  const filteredCars = activeTab === 'all'
    ? cars
    : cars.filter(car => car.type === activeTab);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 py-32 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-blue-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left" data-aos="fade-right" data-aos-duration="1000">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 mb-8" data-aos="fade-up" data-aos-delay="200">
                <span className="text-blue-400 text-sm font-medium">Premium Car Rental Service</span>
                <svg className="w-4 h-4 ml-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-300 mb-6 leading-tight">
                Experience Luxury on Wheels
              </h1>
              <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto lg:mx-0">
                Discover our premium fleet of vehicles and enjoy a seamless rental experience with our exceptional service.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6" data-aos="fade-up" data-aos-delay="400">
                <button className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25 flex items-center justify-center">
                  <a href="/cars" className="flex items-center">
                    <span>Get Started</span>
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </button>
                <button className="w-full sm:w-auto bg-transparent border-2 border-blue-500/30 text-blue-400 px-8 py-4 rounded-xl font-semibold hover:bg-blue-500/10 transition-all duration-300 flex items-center justify-center">
                  <span>Learn More</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-8" data-aos="fade-up" data-aos-delay="600">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-gray-300 text-sm">24/7 Support</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <span className="text-gray-300 text-sm">Secure Booking</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <span className="text-gray-300 text-sm">Flexible Payment</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-300 text-sm">Best Rates</span>
                </div>
              </div>
            </div>
            <div className="relative" data-aos="fade-left" data-aos-duration="1000">
              <div className="relative z-10 bg-gradient-to-br from-white via-gray-50 to-white p-8 rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-500">
                <Image
                  src="/a.png"
                  alt="Luxury Car"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl transform -rotate-3"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 py-24 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-300 mb-4">
              Why Choose DriveEasy?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the best car rental service with our premium features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-700/50" data-aos="fade-up" data-aos-delay="100">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 transform rotate-3">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-blue-400 mb-4">24/7 Support</h3>
              <p className="text-gray-300 leading-relaxed">
                Our customer service team is available round the clock to assist you with any queries or concerns.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-700/50" data-aos="fade-up" data-aos-delay="200">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 transform -rotate-3">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-blue-400 mb-4">Secure Booking</h3>
              <p className="text-gray-300 leading-relaxed">
                Your safety is our priority. All our vehicles are regularly maintained and insured.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-700/50" data-aos="fade-up" data-aos-delay="300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 transform rotate-3">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-blue-400 mb-4">Flexible Payment</h3>
              <p className="text-gray-300 leading-relaxed">
                Multiple payment options available. Choose what works best for you.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 py-24 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-300 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Don't just take our word for it - hear from our satisfied customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-700/50" data-aos="fade-up" data-aos-delay="100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl transform rotate-3">
                  AK
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-blue-400">Ahmad Khan</h4>
                  <div className="flex items-center text-yellow-400 mt-1">
                    <FiStar className="fill-current" />
                    <FiStar className="fill-current" />
                    <FiStar className="fill-current" />
                    <FiStar className="fill-current" />
                    <FiStar className="fill-current" />
                  </div>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">
                "The booking process was seamless and the car was in excellent condition. Will definitely use DriveEasy again!"
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-700/50" data-aos="fade-up" data-aos-delay="200">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl transform -rotate-3">
                  FN
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-blue-400">Fatima Noor</h4>
                  <div className="flex items-center text-yellow-400 mt-1">
                    <FiStar className="fill-current" />
                    <FiStar className="fill-current" />
                    <FiStar className="fill-current" />
                    <FiStar className="fill-current" />
                    <FiStar className="fill-current" />
                  </div>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">
                "Great selection of vehicles at competitive prices. Customer service was very helpful when I had questions."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-700/50" data-aos="fade-up" data-aos-delay="300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl transform rotate-3">
                  YA
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-blue-400">Yusuf Ali</h4>
                  <div className="flex items-center text-yellow-400 mt-1">
                    <FiStar className="fill-current" />
                    <FiStar className="fill-current" />
                    <FiStar className="fill-current" />
                    <FiStar className="fill-current" />
                    <FiStar className="fill-current" />
                  </div>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">
                "Renting a car has never been easier. The pickup and drop-off process was quick and convenient."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 py-24 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center" data-aos="fade-up" data-aos-duration="1000">
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-300 mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Join thousands of satisfied customers who have experienced our premium car rental service.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6" data-aos="fade-up" data-aos-delay="200" data-aos-duration="1000">
              <button className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25 flex items-center justify-center">
                <a href="/cars">Rent a Car Now</a>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              <button className="w-full sm:w-auto bg-transparent border-2 border-blue-500/30 text-blue-400 px-8 py-4 rounded-xl font-semibold hover:bg-blue-500/10 transition-all duration-300 flex items-center justify-center">
                <span>Learn More</span>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarRentalHomepage;