"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db, uploadFile } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Car } from '@/types';
import RouteProtection from '@/components/RouteProtection';

export default function EditCar({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [car, setCar] = useState<Car | null>(null);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [newDocuments, setNewDocuments] = useState<File[]>([]);

    useEffect(() => {
        const loadCar = async () => {
            try {
                const user = auth.currentUser;
                if (!user) {
                    router.push('/company-login');
                    return;
                }

                const carDoc = await getDoc(doc(db, 'cars', resolvedParams.id));
                if (!carDoc.exists()) {
                    setError('Car not found');
                    return;
                }

                const carData = carDoc.data() as Car;
                if (carData.companyId !== user.uid) {
                    setError('You do not have permission to edit this car');
                    return;
                }

                setCar({ ...carData, id: carDoc.id });
            } catch (err) {
                console.error('Error loading car:', err);
                setError('Failed to load car details');
            } finally {
                setLoading(false);
            }
        };

        loadCar();
    }, [resolvedParams.id, router]);

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

            // Upload new images if any
            const newImageUrls = await Promise.all(
                newImages.map(file => 
                    uploadFile(file, `car-images/${user.uid}/${file.name}`)
                )
            );

            // Upload new documents if any
            const newDocumentUrls = await Promise.all(
                newDocuments.map(file => 
                    uploadFile(file, `car-documents/${user.uid}/${file.name}`)
                )
            );

            // Update car data
            const updatedCarData = {
                name: formData.get('name') as string,
                manufacturer: formData.get('manufacturer') as string,
                category: formData.get('category') as Car['category'],
                pricePerDay: Number(formData.get('pricePerDay')),
                fuelEfficiency: formData.get('fuelEfficiency') as string,
                location: {
                    lat: Number(formData.get('latitude')),
                    lng: Number(formData.get('longitude'))
                },
                features: (formData.get('features') as string).split(',').map(f => f.trim()),
                images: [...(car?.images || []), ...newImageUrls],
                documents: [...(car?.documents || []), ...newDocumentUrls],
            };

            await updateDoc(doc(db, 'cars', resolvedParams.id), updatedCarData);
            router.push('/company-dashboard');
        } catch (err) {
            setError('Failed to update car. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-xl text-gray-600">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <div className="text-red-500 mb-4">{error}</div>
                    <button
                        onClick={() => router.push('/company-dashboard')}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <RouteProtection allowedRoles={['company']} redirectTo="/">
            <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                        Edit Car
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Car Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                defaultValue={car?.name}
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
                                defaultValue={car?.manufacturer}
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
                                defaultValue={car?.category}
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
                                defaultValue={car?.pricePerDay}
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
                                defaultValue={car?.fuelEfficiency}
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
                                    defaultValue={car?.location.lat}
                                    step="any"
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                                <input
                                    type="number"
                                    name="longitude"
                                    placeholder="Longitude"
                                    defaultValue={car?.location.lng}
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
                                defaultValue={car?.features.join(', ')}
                                placeholder="AC, GPS, Bluetooth, etc."
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Current Images
                            </label>
                            <div className="mt-2 grid grid-cols-2 gap-4">
                                {car?.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`Car image ${index + 1}`}
                                        className="w-full h-32 object-cover rounded"
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Add New Images
                            </label>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => {
                                    const files = Array.from(e.target.files || []);
                                    setNewImages(files);
                                }}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Add New Documents
                            </label>
                            <input
                                type="file"
                                multiple
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => {
                                    const files = Array.from(e.target.files || []);
                                    setNewDocuments(files);
                                }}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Upload additional registration, insurance, etc.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {loading ? 'Updating Car...' : 'Update Car'}
                        </button>
                    </form>
                </div>
            </div>
        </RouteProtection>
    );
} 