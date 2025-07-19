import './globals.css';
import { Inter } from 'next/font/google';
import AuthContextProvider from '@/lib/authContext';
import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';
import CarChatbot from '@/components/CarChatbot';
import LocationTracker from '@/components/LocationTracker';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Car Rental',
  description: 'Your trusted car rental service',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen`}>
        <AuthContextProvider>
          <div className="relative min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-grow pt-[120px]">
              {children}
            </div>
            <Footer />
            <CarChatbot />
            {/* <LocationTracker /> */}
          </div>
        </AuthContextProvider>
      </body>
    </html>
  );
}
