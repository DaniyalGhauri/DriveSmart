'use client';

import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCar, FaShieldAlt, FaHeadset } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

const Footer = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <>
     {/* Footer */}
     <footer className="bg-gray-900 text-white py-12">
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
         <div>
           <h3 className="text-xl font-bold mb-4">DriveEasy</h3>
           <p className="text-gray-400">
             Your trusted partner for car rentals with the best prices and excellent service.
           </p>
           <div className="flex space-x-4 mt-4">
             <a 
               href="https://facebook.com" 
               target="_blank" 
               rel="noopener noreferrer" 
               className="text-gray-400 hover:text-white transition-colors duration-300"
             >
               <FaFacebook size={20} />
             </a>
             <a 
               href="https://twitter.com" 
               target="_blank" 
               rel="noopener noreferrer" 
               className="text-gray-400 hover:text-white transition-colors duration-300"
             >
               <FaTwitter size={20} />
             </a>
             <a 
               href="https://instagram.com" 
               target="_blank" 
               rel="noopener noreferrer" 
               className="text-gray-400 hover:text-white transition-colors duration-300"
             >
               <FaInstagram size={20} />
             </a>
             <a 
               href="https://linkedin.com" 
               target="_blank" 
               rel="noopener noreferrer" 
               className="text-gray-400 hover:text-white transition-colors duration-300"
             >
               <FaLinkedin size={20} />
             </a>
           </div>
         </div>
         <div>
           <h4 className="font-bold mb-4">Quick Links</h4>
           <ul className="space-y-2">
             <li>
               <Link href="/" className="text-gray-400 hover:text-white transition-colors duration-300">
                 Home
               </Link>
             </li>
             <li>
               <Link href="/cars" className="text-gray-400 hover:text-white transition-colors duration-300">
                 Available Cars
               </Link>
             </li>
             <li>
               <Link href="/services" className="text-gray-400 hover:text-white transition-colors duration-300">
                 Services
               </Link>
             </li>
             <li>
               <Link href="/bookings" className="text-gray-400 hover:text-white transition-colors duration-300">
                 My Bookings
               </Link>
             </li>
           </ul>
         </div>
         <div>
           <h4 className="font-bold mb-4">Account</h4>
           <ul className="space-y-2">
             <li>
               <Link href="/login" className="text-gray-400 hover:text-white transition-colors duration-300">
                 Sign In
               </Link>
             </li>
             <li>
               <Link href="/signup" className="text-gray-400 hover:text-white transition-colors duration-300">
                 Register
               </Link>
             </li>
             <li>
               <Link href="/company-login" className="text-gray-400 hover:text-white transition-colors duration-300">
                 Company Login
               </Link>
             </li>
             <li>
               <Link href="/company-registration" className="text-gray-400 hover:text-white transition-colors duration-300">
                 Register Company
               </Link>
             </li>
           </ul>
         </div>
         <div>
           <h4 className="font-bold mb-4">Contact</h4>
           <ul className="space-y-2 text-gray-400">
             <li className="flex items-center">
               <FaMapMarkerAlt className="mr-2" />
               1234 Rental Street, San Francisco, CA 94107
             </li>
             <li className="flex items-center">
               <FaPhone className="mr-2" />
               <a href="tel:+1234567890" className="hover:text-white transition-colors duration-300">
                 (123) 456-7890
               </a>
             </li>
             <li className="flex items-center">
               <FaEnvelope className="mr-2" />
               <a href="mailto:info@driveeasy.com" className="hover:text-white transition-colors duration-300">
                 info@driveeasy.com
               </a>
             </li>
             <li className="flex items-center">
               <FaHeadset className="mr-2" />
               <Link href="/contact" className="hover:text-white transition-colors duration-300">
                 Contact Support
               </Link>
             </li>
           </ul>
         </div>
       </div>
       <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
         <p>&copy; {new Date().getFullYear()} DriveEasy. All rights reserved.</p>
       </div>
     </div>
   </footer>
    </>
  );
};

export default Footer;
