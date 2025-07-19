export interface Car {
    id: string;
    name: string;
    manufacturer: string;
    category: 'Sedan' | 'SUV' | 'Hatchback' | 'Luxury' | 'Sports' | 'Van' | 'Pickup';
    pricePerDay: number;
    fuelEfficiency: string;
    images: string[];
    documents: string[];
    isAvailable: boolean;
    location: {
        lat: number;
        lng: number;
    };
    features: string[];
    companyId: string;
    reviews: Review[];
    averageRating: number;
}

export interface Review {
    id: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: Date;
}

export interface Booking {
    id: string;
    carId: string;
    userId: string;
    userName: string;
    userEmail: string;
    companyId: string;
    startDate: Date;
    endDate: Date;
    totalCost: number;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    paymentStatus: 'pending' | 'completed';
    createdAt: Date;
    user?: User;
}

export interface RentalCompany {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    documents: string[];
    isVerified: boolean;
    rating: number;
    totalBookings: number;
    totalEarnings: number;
}

export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    cnic: string;
    role: 'customer' | 'company' | 'admin';
    bookings: string;
    createdAt: Date;
}