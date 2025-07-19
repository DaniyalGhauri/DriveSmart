'use client';

import { useState, useEffect, useRef } from 'react';

interface Location {
    latitude: number;
    longitude: number;
    accuracy: number;
}

export default function LocationTracker() {
    const [location, setLocation] = useState<Location | null>(null);
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            setIsLoading(false);
            return;
        }

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const newLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy
                };
                setLocation(newLocation);
                setIsLoading(false);

                // Update map iframe
                if (mapRef.current) {
                    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${newLocation.longitude - 0.01},${newLocation.latitude - 0.01},${newLocation.longitude + 0.01},${newLocation.latitude + 0.01}&layer=mapnik&marker=${newLocation.latitude},${newLocation.longitude}`;
                    mapRef.current.innerHTML = `<iframe width="100%" height="100%" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="${mapUrl}"></iframe>`;
                }
            },
            (error) => {
                setError('Unable to retrieve your location');
                setIsLoading(false);
                console.error('Error getting location:', error);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );

        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, []);

    return (
        <div className="fixed bottom-4 left-4 w-96 bg-white rounded-lg shadow-xl p-4">
            <h3 className="text-lg font-semibold mb-4">Your Location</h3>
            
            {isLoading && (
                <div className="text-gray-600">
                    Getting your location...
                </div>
            )}

            {error && (
                <div className="text-red-500">
                    {error}
                </div>
            )}

            <div 
                ref={mapRef} 
                className="w-full h-48 rounded-lg overflow-hidden border border-gray-200"
                style={{ minHeight: '200px' }}
            />

            {location && (
                <div className="mt-4 flex justify-between text-sm text-gray-600">
                    <span>Accuracy: {location.accuracy.toFixed(2)} meters</span>
                    <a
                        href={`https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}#map=15/${location.latitude}/${location.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                    >
                        Open in OpenStreetMap
                    </a>
                </div>
            )}
        </div>
    );
} 