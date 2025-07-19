'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, Building2 } from 'lucide-react';
import { useAuthContext } from '@/lib/authContext';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuthContext();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setIsLoading(false);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [user]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (isLoading) {
    return null;
  }

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-lg' : 'bg-gradient-to-br from-slate-900/95 to-slate-800/95'}`}>
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10">
            {/* Contact Information */}
            <div className="flex items-center space-x-6">
              <a href="tel:+1234567890" className="flex items-center text-gray-300 hover:text-blue-400 transition-colors duration-300">
                <FaPhone className="mr-2" />
                <span className="hidden sm:inline text-sm">0300 5248625</span>
              </a>
              <a href="mailto:info@driveeasy.com" className="flex items-center text-gray-300 hover:text-blue-400 transition-colors duration-300">
                <FaEnvelope className="mr-2" />
                <span className="hidden sm:inline text-sm">Drivesmart@gamil.com
</span>
              </a>
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-300 hover:text-blue-400 transition-colors duration-300"
              >
                <FaFacebook size={16} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-300 hover:text-blue-400 transition-colors duration-300"
              >
                <FaTwitter size={16} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-300 hover:text-blue-400 transition-colors duration-300"
              >
                <FaInstagram size={16} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-300 hover:text-blue-400 transition-colors duration-300"
              >
                <FaLinkedin size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-300 hover:from-blue-300 hover:via-indigo-300 hover:to-blue-200 transition-all duration-300">
            DriveSmart
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-300 hover:text-blue-400 transition-colors duration-300">Home</Link>
            {user?.role !== 'company' && (
              <>
                <Link href="/cars" className="text-gray-300 hover:text-blue-400 transition-colors duration-300">Cars</Link>
                <Link href="/bookings" className="text-gray-300 hover:text-blue-400 transition-colors duration-300">Bookings</Link>
              </>
            )}
            <Link href="/services" className="text-gray-300 hover:text-blue-400 transition-colors duration-300">Services</Link>
            <Link href="/contact" className="text-gray-300 hover:text-blue-400 transition-colors duration-300">Contact</Link>
            {user?.role === 'customer' && (
              <Link href="/profile" className="text-gray-300 hover:text-blue-400 transition-colors duration-300">Profile</Link>
            )}
            {user?.role === 'company' && (
              <Link href="/company-dashboard" className="text-gray-300 hover:text-blue-400 transition-colors duration-300">Dashboard</Link>
            )}
            {user?.role === 'admin' && (
              <Link href="/admin-dashboard" className="text-gray-300 hover:text-blue-400 transition-colors duration-300">Dashboard</Link>
            )}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-gray-300 hover:text-red-400 transition-colors duration-300 border border-blue-500/20 hover:border-red-500/50 rounded-xl"
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={() => router.push('/login')}
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-300"
                >
                  Sign In
                </button>
                <button
                  onClick={() => router.push('/signup')}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] transition-all duration-300"
                >
                  Register
                </button>
                <button
                  onClick={() => router.push('/company-login')}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02] transition-all duration-300 flex items-center space-x-2 border border-purple-400/20"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Company Portal</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMenu} 
              className="text-gray-300 hover:text-blue-400 transition-colors duration-300 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gradient-to-br from-slate-900 to-slate-800 border-t border-blue-500/20">
          <div className="px-4 py-4 space-y-3">
            <Link href="/" className="block text-gray-300 hover:text-blue-400 transition-colors duration-300">Home</Link>
            {user?.role !== 'company' && (
              <>
                <Link href="/cars" className="block text-gray-300 hover:text-blue-400 transition-colors duration-300">Cars</Link>
                <Link href="/bookings" className="block text-gray-300 hover:text-blue-400 transition-colors duration-300">Bookings</Link>
              </>
            )}
            <Link href="/services" className="block text-gray-300 hover:text-blue-400 transition-colors duration-300">Services</Link>
            <Link href="/contact" className="block text-gray-300 hover:text-blue-400 transition-colors duration-300">Contact</Link>
            {user?.role === 'customer' && (
              <Link href="/profile" className="block text-gray-300 hover:text-blue-400 transition-colors duration-300">Profile</Link>
            )}
            {user?.role === 'company' && (
              <Link href="/company-dashboard" className="block text-gray-300 hover:text-blue-400 transition-colors duration-300">Dashboard</Link>
            )}
            {user?.role === 'admin' && (
              <Link href="/admin-dashboard" className="block text-gray-300 hover:text-blue-400 transition-colors duration-300">Dashboard</Link>
            )}

            {user ? (
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-gray-300 hover:text-red-400 transition-colors duration-300 border border-blue-500/20 hover:border-red-500/50 rounded-xl"
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={() => router.push('/login')}
                  className="w-full text-left px-4 py-2 text-gray-300 hover:text-blue-400 transition-colors duration-300"
                >
                  Sign In
                </button>
                <button
                  onClick={() => router.push('/signup')}
                  className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] transition-all duration-300"
                >
                  Register
                </button>
                <button
                  onClick={() => router.push('/company-login')}
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2 border border-purple-400/20"
                >
                  <Building2 className="w-5 h-5" />
                  <span className="font-semibold">Company Portal</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;