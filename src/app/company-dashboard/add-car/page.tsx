"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, addCar, uploadFile } from '@/lib/firebase.js';
import { Car } from '@/types';
import RouteProtection from '@/components/RouteProtection';

export default function AddCar() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [documents, setDocuments] = useState<File[]>([]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const user = auth.currentUser;
            if (!user) {
                throw new Error('Not authenticated');
            }

            const formData = new FormData(e.currentTarget);

            // Upload images
            const imageUrls = await Promise.all(
                images.map(file => 
                    uploadFile(file, `car-images/${user.uid}/${file.name}`)
                )
            );

            // Upload documents
            const documentUrls = await Promise.all(
                documents.map(file => 
                    uploadFile(file, `car-documents/${user.uid}/${file.name}`)
                )
            );

            // Create car listing
            const carData: Omit<Car, 'id'> = {
                name: formData.get('name') as string,
                manufacturer: formData.get('manufacturer') as string,
                category: formData.get('category') as Car['category'],
                pricePerDay: Number(formData.get('pricePerDay')),
                fuelEfficiency: formData.get('fuelEfficiency') as string,
                images: imageUrls,
                documents: documentUrls,
                isAvailable: true,
                location: {
                    lat: Number(formData.get('latitude')),
                    lng: Number(formData.get('longitude'))
                },
                features: (formData.get('features') as string).split(',').map(f => f.trim()),
                companyId: user.uid,
                reviews: [],
                averageRating: 0
            };

            await addCar(carData);
            router.push('/company-dashboard');
        } catch (err) {
            setError('Failed to add car. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <RouteProtection allowedRoles={['company']} redirectTo="/">
            <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                        Add New Car
                    </h2>

                    {error && (
                        <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Car Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Manufacturer
                            </label>
                            <input
                                type="text"
                                name="manufacturer"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Category
                            </label>
                            <select
                                name="category"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            >
                                <option value="">Select a category</option>
                                <option value="Sedan">Sedan</option>
                                <option value="SUV">SUV</option>
                                <option value="Hatchback">Hatchback</option>
                                <option value="Luxury">Luxury</option>
                                <option value="Sports">Sports</option>
                                <option value="Van">Van</option>
                                <option value="Pickup">Pickup</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Price per Day
                            </label>
                            <input
                                type="number"
                                name="pricePerDay"
                                required
                                min="0"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Fuel Efficiency (km/l)
                            </label>
                            <input
                                type="text"
                                name="fuelEfficiency"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Location
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="number"
                                    name="latitude"
                                    placeholder="Latitude"
                                    step="any"
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                                <input
                                    type="number"
                                    name="longitude"
                                    placeholder="Longitude"
                                    step="any"
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Features (comma-separated)
                            </label>
                            <input
                                type="text"
                                name="features"
                                placeholder="AC, GPS, Bluetooth, etc."
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Car Images
                            </label>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => {
                                    const files = Array.from(e.target.files || []);
                                    setImages(files);
                                }}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Car Documents
                            </label>
                            <input
                                type="file"
                                multiple
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => {
                                    const files = Array.from(e.target.files || []);
                                    setDocuments(files);
                                }}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Upload registration, insurance, etc.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                                loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {loading ? 'Adding Car...' : 'Add Car'}
                        </button>
                    </form>
                </div>
            </div>
        </RouteProtection>
    );
} 