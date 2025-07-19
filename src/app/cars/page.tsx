"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, getAvailableCars, createBooking } from '@/lib/firebase';
import { Car } from '@/types';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function CarsPage() {
    const router = useRouter();
    const [cars, setCars] = useState<Car[]>([]);
    const [filteredCars, setFilteredCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        minPrice: '',
        maxPrice: '',
        manufacturer: '',
        category: '',
        sortBy: ''
    });
    const [selectedCar, setSelectedCar] = useState<Car | null>(null);
    const [bookingDates, setBookingDates] = useState({
        startDate: '',
        endDate: ''
    });

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });

        const loadCars = async () => {
            try {
                const availableCars = await getAvailableCars();
                // Cast the response to Car[] type
                const validCars = availableCars.map(car => ({
                    ...car,
                    reviews: car.reviews || [],
                    averageRating: car.averageRating || 0,
                })) as Car[];
                
                setCars(validCars);
                setFilteredCars(validCars);
            } catch (err) {
                console.error('Error loading cars:', err);
                setError('Failed to load available cars');
            } finally {
                setLoading(false);
            }
        };

        loadCars();
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        applyFilters(term, filters);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);
        applyFilters(searchTerm, newFilters);
    };

    const applyFilters = (term: string, currentFilters: typeof filters) => {
        let filtered = [...cars]; // Create a new array to avoid mutation

        // Apply search term filter
        if (term) {
            filtered = filtered.filter(car => 
                car.name.toLowerCase().includes(term) ||
                car.manufacturer.toLowerCase().includes(term)
            );
        }

        // Apply category filter
        if (currentFilters.category) {
            filtered = filtered.filter(car => 
                car.category === currentFilters.category
            );
        }

        // Apply manufacturer filter
        if (currentFilters.manufacturer) {
            filtered = filtered.filter(car => 
                car.manufacturer === currentFilters.manufacturer
            );
        }

        // Apply price filters
        if (currentFilters.minPrice) {
            filtered = filtered.filter(car => 
                car.pricePerDay >= Number(currentFilters.minPrice)
            );
        }
        if (currentFilters.maxPrice) {
            filtered = filtered.filter(car => 
                car.pricePerDay <= Number(currentFilters.maxPrice)
            );
        }

        // Apply sorting
        if (currentFilters.sortBy) {
            filtered.sort((a, b) => {
                switch (currentFilters.sortBy) {
                    case 'price-asc':
                        return a.pricePerDay - b.pricePerDay;
                    case 'price-desc':
                        return b.pricePerDay - a.pricePerDay;
                    case 'rating':
                        return b.averageRating - a.averageRating;
                    default:
                        return 0;
                }
            });
        }

        setFilteredCars(filtered);
    };

    const handleBooking = async () => {
        try {
            const user = auth.currentUser;
            if (!user) return router.push('/login');

            if (!selectedCar || !bookingDates.startDate || !bookingDates.endDate) {
                return setError('Please select dates for your booking');
            }

            const startDate = new Date(bookingDates.startDate);
            const endDate = new Date(bookingDates.endDate);
            const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
            const totalCost = days * selectedCar.pricePerDay;

            const bookingData = {
                carId: selectedCar.id,
                userId: user.uid,
                companyId: selectedCar.companyId,
                startDate,
                endDate,
                totalCost,
                status: 'pending',
                paymentStatus: 'pending',
                createdAt: new Date()
            };

            await createBooking(bookingData);
            router.push('/bookings');
        } catch (err) {
            setError('Failed to create booking');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex justify-center items-center">
                <div className="text-blue-400 text-xl font-semibold animate-pulse">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex justify-center items-center">
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl shadow-lg">
                    {error}
                </div>
            </div>
        );
    }

    if (filteredCars.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-6">
                <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-blue-500/10">
                    <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-300 mb-2">No Cars Available</h2>
                    <p className="text-gray-400">Please check back later for available cars.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 py-24 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-blue-500/5 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="text-center mb-16" data-aos="fade-up">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 mb-8">
                        <span className="text-blue-400 text-sm font-medium">Available Cars</span>
                        <svg className="w-4 h-4 ml-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-300 mb-6">
                        Find Your Perfect Ride
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Browse our selection of premium vehicles and find the perfect car for your journey.
                    </p>
                </div>

                {/* Filters */}
                <div 
                    className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-blue-500/10 p-6 mb-12"
                    data-aos="fade-up"
                    data-aos-delay="100"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <input
                            type="text"
                            placeholder="Search cars..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="bg-slate-700/50 border border-blue-500/20 rounded-xl p-3 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
                        />
                        <select
                            name="sortBy"
                            value={filters.sortBy}
                            onChange={handleFilterChange}
                            className="bg-slate-700/50 border border-blue-500/20 rounded-xl p-3 text-gray-100 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
                        >
                            <option value="">Sort By</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="rating">Rating</option>
                        </select>
                        <select
                            name="category"
                            value={filters.category}
                            onChange={handleFilterChange}
                            className="bg-slate-700/50 border border-blue-500/20 rounded-xl p-3 text-gray-100 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
                        >
                            <option value="">All Categories</option>
                            <option value="Sedan">Sedan</option>
                            <option value="SUV">SUV</option>
                            <option value="Hatchback">Hatchback</option>
                            <option value="Luxury">Luxury</option>
                            <option value="Sports">Sports</option>
                            <option value="Van">Van</option>
                            <option value="Pickup">Pickup</option>
                        </select>
                    </div>
                </div>

                {/* Car Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCars.map((car, index) => (
                        <div 
                            key={car.id} 
                            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-blue-500/10 overflow-hidden hover:border-blue-500/30 transition-all duration-300 transform hover:-translate-y-1"
                            data-aos="fade-up"
                            data-aos-delay={100 * (index + 1)}
                        >
                            {car.images[0] && (
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={car.images[0]}
                                        alt={car.name}
                                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                                </div>
                            )}
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{car.name}</h3>
                                        <p className="text-gray-400">{car.manufacturer}</p>
                                    </div>
                                    <div className="text-blue-400 font-semibold">${car.pricePerDay}/day</div>
                                </div>

                                <div className="flex items-center space-x-4 text-sm text-gray-400">
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-1 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        {car.fuelEfficiency}
                                    </div>
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        {car.averageRating.toFixed(1)} ({car.reviews.length})
                                    </div>
                                </div>

                                <div className="space-y-3 pt-4 border-t border-blue-500/10">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">Start Date</label>
                                            <input
                                                type="date"
                                                className="w-full bg-slate-700/50 border border-blue-500/20 rounded-xl p-2 text-gray-100 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
                                                min={new Date().toISOString().split('T')[0]}
                                                value={selectedCar?.id === car.id ? bookingDates.startDate : ''}
                                                onChange={(e) => {
                                                    setSelectedCar(car);
                                                    setBookingDates({ ...bookingDates, startDate: e.target.value });
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">End Date</label>
                                            <input
                                                type="date"
                                                className="w-full bg-slate-700/50 border border-blue-500/20 rounded-xl p-2 text-gray-100 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
                                                min={bookingDates.startDate}
                                                value={selectedCar?.id === car.id ? bookingDates.endDate : ''}
                                                onChange={(e) => {
                                                    setSelectedCar(car);
                                                    setBookingDates({ ...bookingDates, endDate: e.target.value });
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setSelectedCar(car);
                                            handleBooking();
                                        }}
                                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all duration-300"
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Error Modal */}
                {error && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-blue-500/10 shadow-xl max-w-sm w-full">
                            <p className="text-red-400">{error}</p>
                            <button
                                onClick={() => setError('')}
                                className="mt-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] transition-all duration-300"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
