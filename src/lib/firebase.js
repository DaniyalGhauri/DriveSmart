// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, getDocs, query, where, Timestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { sendWhatsAppMessage } from './whatsapp';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC1maHRps3nYKoIg9rQlt1TPLAWGxICeNs",
  authDomain: "firestore-practice-579fd.firebaseapp.com",
  projectId: "firestore-practice-579fd",
  storageBucket: "firestore-practice-579fd.appspot.com",
  messagingSenderId: "869050537171",
  appId: "1:869050537171:web:959b71ea5cb92573697026"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const uploadFile = async (file, path) => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
};

const addCar = async (carData) => {
    const carsRef = collection(db, 'cars');
    await addDoc(carsRef, carData);
};

const addTestCar = async () => {
    const carsRef = collection(db, 'cars');
    const testCar = {
        name: 'Toyota Camry 2023',
        manufacturer: 'Toyota',
        category: 'Sedan',
        pricePerDay: 50,
        fuelEfficiency: '35 mpg',
        images: ['https://example.com/camry.jpg'],
        documents: [],
        isAvailable: true,
        location: {
            lat: 40.7128,
            lng: -74.0060
        },
        features: ['Bluetooth', 'Backup Camera', 'Cruise Control'],
        companyId: 'test-company',
        reviews: [],
        averageRating: 0
    };
    await addDoc(carsRef, testCar);
};

const getAvailableCars = async () => {
    const carsRef = collection(db, 'cars');
    const q = query(carsRef, where('isAvailable', '==', true));
    const querySnapshot = await getDocs(q);
    
    // If no cars exist, add a test car
    if (querySnapshot.empty) {
        console.log('No cars found, adding test car...');
        await addTestCar();
        // Fetch again after adding test car
        const newSnapshot = await getDocs(q);
        return newSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name || '',
                manufacturer: data.manufacturer || '',
                category: data.category || 'Sedan',
                pricePerDay: data.pricePerDay || 0,
                fuelEfficiency: data.fuelEfficiency || '',
                images: data.images || [],
                documents: data.documents || [],
                isAvailable: data.isAvailable || false,
                location: data.location || { lat: 0, lng: 0 },
                features: data.features || [],
                companyId: data.companyId || '',
                reviews: data.reviews || [],
                averageRating: data.averageRating || 0
            };
        });
    }

    return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            name: data.name || '',
            manufacturer: data.manufacturer || '',
            category: data.category || 'Sedan',
            pricePerDay: data.pricePerDay || 0,
            fuelEfficiency: data.fuelEfficiency || '',
            images: data.images || [],
            documents: data.documents || [],
            isAvailable: data.isAvailable || false,
            location: data.location || { lat: 0, lng: 0 },
            features: data.features || [],
            companyId: data.companyId || '',
            reviews: data.reviews || [],
            averageRating: data.averageRating || 0
        };
    });
};

const createBooking = async (bookingData) => {
    try {
        const bookingsRef = collection(db, 'bookings');
        const bookingWithTimestamp = {
            ...bookingData,
            startDate: Timestamp.fromDate(bookingData.startDate),
            endDate: Timestamp.fromDate(bookingData.endDate),
            createdAt: Timestamp.fromDate(bookingData.createdAt)
        };
        
        // Create the booking
        const bookingRef = await addDoc(bookingsRef, bookingWithTimestamp);
        
        // Get car details
        const car = await getCar(bookingData.carId);
        
        // Get user details
        const userRef = doc(db, 'users', bookingData.userId);
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();
        
        // Prepare WhatsApp message
        const message = `
🚗 *New Car Booking Confirmation*

*Booking Details:*
Car: ${car.name}
Start Date: ${bookingData.startDate.toLocaleDateString()}
End Date: ${bookingData.endDate.toLocaleDateString()}
Total Cost: $${bookingData.totalCost}

*Customer Details:*
Name: ${userData?.name || 'N/A'}
Phone: ${userData?.phone || 'N/A'}

Booking ID: ${bookingRef.id}

Thank you for choosing our service! 🎉
        `;

        // Send WhatsApp notification to the company
        if (userData?.phone) {
            await sendWhatsAppMessage(userData.phone, message);
        }

        return bookingRef.id;
    } catch (error) {
        console.error('Error creating booking:', error);
        throw error;
    }
};

const getUserBookings = async (userId) => {
    const bookingsRef = collection(db, 'bookings');
    const q = query(bookingsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            carId: data.carId,
            userId: data.userId,
            companyId: data.companyId,
            startDate: data.startDate.toDate(),
            endDate: data.endDate.toDate(),
            totalCost: data.totalCost,
            status: data.status,
            paymentStatus: data.paymentStatus,
            createdAt: data.createdAt.toDate()
        };
    });
};

const updateBooking = async (bookingId, updateData) => {
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, updateData);
};

const getCar = async (carId) => {
    const carRef = doc(db, 'cars', carId);
    const carDoc = await getDoc(carRef);
    if (!carDoc.exists()) {
        throw new Error('Car not found');
    }
    const data = carDoc.data();
    return {
        id: carDoc.id,
        name: data.name || '',
        manufacturer: data.manufacturer || '',
        pricePerDay: data.pricePerDay || 0,
        fuelEfficiency: data.fuelEfficiency || '',
        images: data.images || [],
        documents: data.documents || [],
        isAvailable: data.isAvailable || false,
        location: data.location || { lat: 0, lng: 0 },
        features: data.features || [],
        companyId: data.companyId || '',
        reviews: data.reviews || [],
        averageRating: data.averageRating || 0
    };
};

export { app, db, storage, googleProvider, auth, uploadFile, addCar, getAvailableCars, createBooking, addTestCar, getUserBookings, updateBooking, getCar };