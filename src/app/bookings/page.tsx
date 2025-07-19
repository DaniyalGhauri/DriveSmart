"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, getUserBookings, updateBooking, getCar } from '@/lib/firebase';
import { Booking, Car } from '@/types';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface BookingWithCar extends Booking {
    car?: Car;
}

export default function BookingsPage() {
    const router = useRouter();
    const [bookings, setBookings] = useState<BookingWithCar[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const [ratingBookingId, setRatingBookingId] = useState<string | null>(null);

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });

        const loadBookings = async () => {
            try {
                const user = auth.currentUser;
                if (!user) {
                    router.push('/login');
                    return;
                }

                const userBookings = await getUserBookings(user.uid);

                // Fetch car details for each booking
                const bookingsWithCars = await Promise.all(
                    userBookings.map(async (booking) => {
                        const car = await getCar(booking.carId);
                        return { ...booking, car } as BookingWithCar;
                    })
                );

                setBookings(bookingsWithCars);
            } catch (err) {
                console.error('Error loading bookings:', err);
                setError('Failed to load bookings');
            } finally {
                setLoading(false);
            }
        };

        loadBookings();
    }, [router]);

    const handleCancelBooking = async (bookingId: string) => {
        try {
            await updateBooking(bookingId, {
                status: 'cancelled'
            });

            setBookings(bookings.map(booking =>
                booking.id === bookingId
                    ? { ...booking, status: 'cancelled' }
                    : booking
            ));
        } catch (err) {
            console.error('Error cancelling booking:', err);
            setError('Failed to cancel booking');
        }
    };

    const handlePayment = async (bookingId: string) => {
        try {
            await updateBooking(bookingId, {
                paymentStatus: 'completed'
            });

            // Find the booking to get carId
            const booking = bookings.find(b => b.id === bookingId);
            if (booking && booking.carId) {
                const carRef = doc(db, 'cars', booking.carId);
                await updateDoc(carRef, { isAvailable: false });
            }

            setBookings(bookings.map(booking =>
                booking.id === bookingId
                    ? { ...booking, paymentStatus: 'completed' }
                    : booking
            ));
        } catch (err) {
            console.error('Error processing payment:', err);
            setError('Failed to process payment');
        }
    };

    const handleRatingSubmit = async (bookingId: string, rating: number) => {
        try {
            const booking = bookings.find(b => b.id === bookingId);
            if (!booking || !booking.car) return;

            // Update booking with rating
            await updateBooking(bookingId, {
                rating: rating
            });

            // Update car's average rating
            const carRef = doc(db, 'cars', booking.carId);
            const carDoc = await getDoc(carRef);

            if (carDoc.exists()) {
                const carData = carDoc.data();
                const currentReviews = carData.reviews || [];
                const newReview = {
                    id: Date.now().toString(),
                    userId: auth.currentUser?.uid,
                    userName: auth.currentUser?.displayName || 'Anonymous',
                    rating: rating,
                    comment: '',
                    createdAt: new Date()
                };

                const updatedReviews = [...currentReviews, newReview];
                const totalRating = updatedReviews.reduce((sum, review) => sum + review.rating, 0);
                const averageRating = totalRating / updatedReviews.length;

                await updateDoc(carRef, {
                    reviews: updatedReviews,
                    averageRating: averageRating
                });
            }

            // Update local state
            setBookings(bookings.map(booking =>
                booking.id === bookingId
                    ? { ...booking, rating }
                    : booking
            ));

            setSelectedRating(null);
            setRatingBookingId(null);
        } catch (err) {
            console.error('Error submitting rating:', err);
            setError('Failed to submit rating');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex justify-center items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12" data-aos="fade-up">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
                        Your Bookings
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Manage your car rentals, track payments, and share your experience with our community.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg mb-6 backdrop-blur-sm" data-aos="fade-up">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookings.map((booking, index) => (
                        <div 
                            key={booking.id} 
                            className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300"
                            data-aos="fade-up"
                            data-aos-delay={index * 100}
                        >
                            {booking.car?.images[0] && (
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={booking.car.images[0]}
                                        alt={booking.car.name}
                                        className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                                </div>
                            )}
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-white mb-4">
                                    {booking.car?.name || 'Unknown Car'}
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center text-gray-300">
                                        <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center text-gray-300">
                                        <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        ${booking.totalCost}
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-gray-300 mr-2">Status:</span>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium
                                            ${booking.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                            booking.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                                            'bg-yellow-500/20 text-yellow-400'}`}
                                        >
                                            {booking.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-gray-300 mr-2">Payment:</span>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium
                                            ${booking.paymentStatus === 'completed' ? 'bg-green-500/20 text-green-400' :
                                            'bg-yellow-500/20 text-yellow-400'}`}
                                        >
                                            {booking.paymentStatus}
                                        </span>
                                    </div>
                                </div>

                                {booking.status === 'pending' && (
                                    <div className="mt-6 flex space-x-3">
                                        <button
                                            onClick={() => handleCancelBooking(booking.id)}
                                            className="flex-1 bg-red-500/20 text-red-400 py-2 rounded-lg hover:bg-red-500/30 transition-colors duration-300"
                                        >
                                            Cancel Booking
                                        </button>
                                        {booking.paymentStatus === 'pending' && (
                                            <button
                                                onClick={() => handlePayment(booking.id)}
                                                className="flex-1 bg-green-500/20 text-green-400 py-2 rounded-lg hover:bg-green-500/30 transition-colors duration-300"
                                            >
                                                Pay Now
                                            </button>
                                        )}
                                    </div>
                                )}

                                {booking.status === 'completed' && !booking.car?.reviews.some(r => r.userId === auth.currentUser?.uid) && (
                                    <div className="mt-6">
                                        {ratingBookingId === booking.id ? (
                                            <div className="flex flex-col items-center space-y-3">
                                                <div className="flex space-x-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            onClick={() => setSelectedRating(star)}
                                                            className="focus:outline-none transform hover:scale-110 transition-transform duration-200"
                                                        >
                                                            {star <= (selectedRating || 0) ? (
                                                                <StarIcon className="h-6 w-6 text-yellow-400" />
                                                            ) : (
                                                                <StarOutlineIcon className="h-6 w-6 text-gray-400" />
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                                <button
                                                    onClick={() => selectedRating && handleRatingSubmit(booking.id, selectedRating)}
                                                    disabled={!selectedRating}
                                                    className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-colors duration-300 disabled:opacity-50"
                                                >
                                                    Submit Rating
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setRatingBookingId(booking.id)}
                                                className="w-full bg-blue-500/20 text-blue-400 py-2 rounded-lg hover:bg-blue-500/30 transition-colors duration-300"
                                            >
                                                Rate Your Experience
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 