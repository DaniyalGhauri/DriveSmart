"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc as firestoreDoc, updateDoc, getDoc } from 'firebase/firestore';
import { Car, Booking, RentalCompany, User } from '@/types';
import AOS from 'aos';
import 'aos/dist/aos.css';
import RouteProtection from '@/components/RouteProtection';

export default function CompanyDashboard() {
    const router = useRouter();
    const [cars, setCars] = useState<Car[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [companyDetails, setCompanyDetails] = useState<RentalCompany | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isNetworkError, setIsNetworkError] = useState(false);

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }, []);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                setError(null);
                setIsNetworkError(false);
                const user = auth.currentUser;
                if (!user) {
                    router.push('/company-login');
                    return;
                }

                // Load company details from users collection
                const companyDoc = await getDoc(firestoreDoc(db, 'users', user.uid));
                if (!companyDoc.exists()) {
                    setError('Company profile not found. Please complete your registration.');
                    router.push('/company-registration');
                    return;
                }

                const companyData = companyDoc.data();
                if (companyData.role !== 'company') {
                    setError('Access denied. This account is not registered as a company.');
                    router.push('/company-login');
                    return;
                }

                setCompanyDetails({
                    id: companyDoc.id,
                    ...companyData
                } as RentalCompany);

                // Load cars
                const carsQuery = query(
                    collection(db, 'cars'),
                    where('companyId', '==', user.uid)
                );
                const carsSnapshot = await getDocs(carsQuery);
                const carsData = carsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Car[];
                setCars(carsData);

                // Load bookings
                const bookingsQuery = query(
                    collection(db, 'bookings'),
                    where('companyId', '==', user.uid)
                );
                const bookingsSnapshot = await getDocs(bookingsQuery);
                const bookingsData = await Promise.all(
                    bookingsSnapshot.docs.map(async (doc) => {
                        const bookingData = doc.data();
                        const userDoc = await getDoc(firestoreDoc(db, 'users', bookingData.userId));
                        let userData = null;
                        if (userDoc.exists()) {
                            userData = {
                                id: userDoc.id,
                                ...userDoc.data()
                            } as User;
                        }
                        return {
                            id: doc.id,
                            ...bookingData,
                            user: userData
                        } as Booking;
                    })
                );
                setBookings(bookingsData);

                // Update car availability based on active bookings
                const activeBookings = bookingsData.filter(b => 
                    b.status !== 'cancelled' && 
                    new Date() >= b.startDate && 
                    new Date() <= b.endDate
                );

                const updatedCars = carsData.map(car => ({
                    ...car,
                    isAvailable: !activeBookings.some(booking => booking.carId === car.id)
                }));
                setCars(updatedCars);

            } catch (err) {
                console.error('Error loading dashboard data:', err);
                if (err instanceof Error) {
                    if (err.message.includes('network') || err.message.includes('permission-denied')) {
                        setError('Network error. Please check your connection and try again.');
                        setIsNetworkError(true);
                    } else if (err.message.includes('not-found')) {
                        setError('Company profile not found. Please complete your registration.');
                        router.push('/company-registration');
                    } else {
                        setError('Failed to load dashboard data. Please try again later.');
                    }
                } else {
                    setError('An unexpected error occurred. Please try again later.');
                }
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, [router]);

    const handleToggleAvailability = async (carId: string, currentStatus: boolean) => {
        try {
            setError(null);
            setIsNetworkError(false);
            const carRef = firestoreDoc(db, 'cars', carId);
            await updateDoc(carRef, {
                isAvailable: !currentStatus
            });

            // Update local state
            setCars(cars.map(car => 
                car.id === carId
                    ? { ...car, isAvailable: !currentStatus }
                    : car
            ));
        } catch (err) {
            console.error('Error updating car availability:', err);
            if (err instanceof Error) {
                if (err.message.includes('network') || err.message.includes('permission-denied')) {
                    setError('Network error. Please check your connection and try again.');
                    setIsNetworkError(true);
                } else {
                    setError('Failed to update car availability. Please try again.');
                }
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        }
    };

    const handleUpdateBookingStatus = async (bookingId: string, newStatus: Booking['status']) => {
        try {
            setError(null);
            setIsNetworkError(false);
            const bookingRef = firestoreDoc(db, 'bookings', bookingId);
            await updateDoc(bookingRef, {
                status: newStatus
            });

            // Update local state
            setBookings(bookings.map(booking => 
                booking.id === bookingId
                    ? { ...booking, status: newStatus }
                    : booking
            ));
        } catch (err) {
            console.error('Error updating booking status:', err);
            if (err instanceof Error) {
                if (err.message.includes('network') || err.message.includes('permission-denied')) {
                    setError('Network error. Please check your connection and try again.');
                    setIsNetworkError(true);
                } else {
                    setError('Failed to update booking status. Please try again.');
                }
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        }
    };

    const formatDate = (dateValue: any) => {
        try {
            let date: Date;
            if (!dateValue) return '-';
            // Firestore Timestamp object
            if (typeof dateValue.toDate === 'function') {
                date = dateValue.toDate();
            } else if (typeof dateValue === 'string') {
                // Try to parse ISO string first
                date = new Date(dateValue);
                if (isNaN(date.getTime())) {
                    // Fallback: try to parse Firestore export string
                    // e.g. "June 11, 2025 at 5:00:00 AM UTC+5"
                    // Remove "at" and "UTC+5"
                    const cleaned = dateValue
                        .replace(' at ', ' ')
                        .replace(/ UTC.*$/, '');
                    date = new Date(cleaned);
                }
            } else {
                date = new Date(dateValue);
            }
            if (isNaN(date.getTime())) return 'Invalid Date';
            return date.toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (err) {
            return 'Invalid Date';
        }
    };

    const calculateTotalEarnings = () => {
        return bookings
            .filter(b => b.status === 'completed')
            .reduce((total, booking) => total + booking.totalCost, 0);
    };

    const calculatePendingEarnings = () => {
        return bookings
            .filter(b => b.status === 'pending' || b.status === 'confirmed')
            .reduce((total, booking) => total + booking.totalCost, 0);
    };

    const calculateActiveBookings = () => {
        return bookings.filter(b => 
            b.status !== 'cancelled' && 
            new Date() >= b.startDate && 
            new Date() <= b.endDate
        ).length;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <p className="mt-4 text-gray-400">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
                <div className={`max-w-md w-full ${isNetworkError ? 'bg-yellow-500/10' : 'bg-red-500/10'} p-6 rounded-xl backdrop-blur-sm border ${isNetworkError ? 'border-yellow-500/20' : 'border-red-500/20'}`} data-aos="fade-up">
                    <div className="flex items-center mb-4">
                        {isNetworkError ? (
                            <svg className="h-6 w-6 text-yellow-400 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg className="h-6 w-6 text-red-400 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        )}
                        <h2 className={`text-xl font-semibold ${isNetworkError ? 'text-yellow-400' : 'text-red-400'}`}>
                            {isNetworkError ? 'Connection Error' : 'Error'}
                        </h2>
                    </div>
                    <p className={`${isNetworkError ? 'text-yellow-300' : 'text-red-300'} mb-4`}>{error}</p>
                    {isNetworkError && (
                        <p className="text-yellow-300/80 text-sm mb-4">
                            Please check your internet connection and try again.
                        </p>
                    )}
                    <div className="flex space-x-4">
                        <button
                            onClick={() => window.location.reload()}
                            className={`flex-1 px-4 py-2 rounded-lg ${isNetworkError ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-red-500 hover:bg-red-600'} text-white transition-colors duration-300`}
                        >
                            Try Again
                        </button>
                        <button
                            onClick={() => router.push('/company-login')}
                            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-300"
                        >
                            Return to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!companyDetails?.isVerified) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-yellow-500/10 p-6 rounded-xl backdrop-blur-sm border border-yellow-500/20">
                    <div className="flex items-center mb-4">
                        <svg className="h-6 w-6 text-yellow-400 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <h2 className="text-xl font-semibold text-yellow-400">
                            {companyDetails?.isVerified === false ? 'Account Pending Verification' : 'Account Disabled'}
                        </h2>
                    </div>
                    <p className="text-yellow-300 mb-4">
                        {companyDetails?.isVerified === false
                            ? 'Your account is pending admin verification. You will be notified once your account is verified.'
                            : 'Your account has been disabled by the admin. Please contact support for more information.'}
                    </p>
                    <button
                        onClick={() => router.push('/company-login')}
                        className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-300"
                    >
                        Return to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <RouteProtection allowedRoles={['company']} redirectTo="/">
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header with Stats */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6 border border-gray-700/50" data-aos="fade-up">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                                    {companyDetails?.name || 'Company Dashboard'}
                                </h1>
                                <p className="text-gray-400 mt-1">
                                    Manage your cars and bookings
                                </p>
                            </div>
                            <Link
                                href="/company-dashboard/add-car"
                                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                            >
                                Add New Car
                            </Link>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gray-700/50 backdrop-blur-sm p-4 rounded-lg border border-gray-600/50" data-aos="fade-up" data-aos-delay="100">
                                <h3 className="text-lg font-semibold text-blue-400">Total Earnings</h3>
                                <p className="text-2xl font-bold text-white">
                                    ${calculateTotalEarnings().toFixed(2)}
                                </p>
                                <p className="text-sm text-gray-400 mt-1">
                                    From completed bookings
                                </p>
                            </div>

                            <div className="bg-gray-700/50 backdrop-blur-sm p-4 rounded-lg border border-gray-600/50" data-aos="fade-up" data-aos-delay="200">
                                <h3 className="text-lg font-semibold text-purple-400">Pending Earnings</h3>
                                <p className="text-2xl font-bold text-white">
                                    ${calculatePendingEarnings().toFixed(2)}
                                </p>
                                <p className="text-sm text-gray-400 mt-1">
                                    From pending and confirmed bookings
                                </p>
                            </div>

                            <div className="bg-gray-700/50 backdrop-blur-sm p-4 rounded-lg border border-gray-600/50" data-aos="fade-up" data-aos-delay="300">
                                <h3 className="text-lg font-semibold text-pink-400">Active Bookings</h3>
                                <p className="text-2xl font-bold text-white">
                                    {calculateActiveBookings()}
                                </p>
                                <p className="text-sm text-gray-400 mt-1">
                                    Currently active rentals
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Cars Section */}
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Cars</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {cars.map((car) => (
                                <div key={car.id} className="border rounded-lg p-4">
                                    {car.images[0] && (
                                        <img
                                            src={car.images[0]}
                                            alt={car.name}
                                            className="w-full h-48 object-cover rounded-lg mb-4"
                                        />
                                    )}
                                    <h3 className="text-lg font-semibold">{car.name}</h3>
                                    <p className="text-gray-600">{car.manufacturer}</p>
                                    <p className="text-gray-600">${car.pricePerDay}/day</p>
                                    <p className={`text-sm ${car.isAvailable ? 'text-blue-600' : 'text-red-600'}`}>
                                        {car.isAvailable ? 'Available' : 'Not Available'}
                                    </p>
                                    <div className="mt-4 flex space-x-2">
                                        <button
                                            onClick={() => router.push(`/company-dashboard/edit-car/${car.id}`)}
                                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleToggleAvailability(car.id, car.isAvailable)}
                                            className={`${
                                                car.isAvailable ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                                            } text-white px-3 py-1 rounded text-sm`}
                                        >
                                            {car.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Bookings</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {bookings.map((booking) => {
                                const car = cars.find(c => c.id === booking.carId);
                                return (
                                    <div key={booking.id} className="bg-gray-100 rounded-xl shadow p-6 flex flex-col space-y-4 border border-gray-200">
                                        <div className="flex items-center space-x-4 mb-2">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-blue-700 mb-1">{car?.name || 'Unknown Car'}</h3>
                                                <p className="text-sm text-gray-500">{car?.manufacturer}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="block text-xs text-gray-400">Booking ID</span>
                                                <span className="text-xs text-gray-600">{booking.id}</span>
                                            </div>
                                        </div>
                                        <div className="border-b border-gray-200 mb-2"></div>
                                        <div>
                                            <span className="block text-xs text-gray-400">User Details</span>
                                            {booking.user ? (
                                                <div className="bg-white rounded p-2 mt-1 border border-gray-200">
                                                    <div className="flex items-center mb-1">
                                                        <span className="font-semibold text-gray-700 w-20 inline-block">Name:</span>
                                                        <span className="text-gray-900">{booking.user.name}</span>
                                                    </div>
                                                    <div className="flex items-center mb-1">
                                                        <span className="font-semibold text-gray-700 w-20 inline-block">Email:</span>
                                                        <span className="text-gray-900">{booking.user.email}</span>
                                                    </div>
                                                    {booking.user.phone && (
                                                        <div className="flex items-center">
                                                            <span className="font-semibold text-gray-700 w-20 inline-block">Phone:</span>
                                                            <span className="text-gray-900">{booking.user.phone}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-gray-500">User data not found</span>
                                            )}
                                        </div>
                                        <div>
                                            <span className="block text-xs text-gray-400">Dates</span>
                                            <span className="text-gray-900 text-sm font-medium">
                                                {booking.startDate ? formatDate(booking.startDate) : '-'} — {booking.endDate ? formatDate(booking.endDate) : '-'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-xs text-gray-400">Status</span>
                                            {(booking.status === 'completed' || booking.status === 'cancelled') ? (
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                                                    ${booking.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                                >
                                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                </span>
                                            ) : (
                                                <select
                                                    value={booking.status}
                                                    onChange={(e) => handleUpdateBookingStatus(booking.id, e.target.value as Booking['status'])}
                                                    className={`px-2 py-1 rounded text-sm font-semibold bg-yellow-100 text-yellow-800`}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            )}
                                        </div>
                                        <div>
                                            <span className="block text-xs text-gray-400">Amount</span>
                                            <span className="text-gray-900 font-semibold">${booking.totalCost}</span>
                                        </div>
                                        <div className="flex space-x-2 mt-2">
                                            <button
                                                onClick={() => handleToggleAvailability(car?.id || '', car?.isAvailable || false)}
                                                className={`flex-1 px-3 py-1 rounded text-sm font-medium
                                                    ${car?.isAvailable 
                                                        ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                                                        : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
                                            >
                                                {car?.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </RouteProtection>
    );
}