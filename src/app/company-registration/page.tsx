"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { uploadFile } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { auth } from '@/lib/firebase';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaBuilding, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaFileUpload } from 'react-icons/fa';

export default function CompanyRegistration() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
    const [documents, setDocuments] = useState<File[]>([]);

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }, []);

    const resetErrorAfterTimeout = (msg: string, isSuccess = false) => {
        if (isSuccess) {
            setSuccess(msg);
            setTimeout(() => setSuccess(''), 5000);
        } else {
            setError(msg);
            setTimeout(() => setError(''), 5000);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const cnic = formData.get('cnic') as string;

        try {
            // Create auth account
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const uid = user.uid;

            // Send email verification
            await sendEmailVerification(user);

            // Upload documents
            const documentUrls = await Promise.all(
                documents.map(file => 
                    uploadFile(file, `company-documents/${uid}/${file.name}`)
                )
            );

            // Register company in users collection
            const userData = {
                name: formData.get('companyName') as string,
                email,
                phone: formData.get('phone') as string,
                cnic,
                address: formData.get('address') as string,
                documents: documentUrls,
                isVerified: false,
                rating: 0,
                totalBookings: 0,
                totalEarnings: 0,
                role: 'company',
                createdAt: new Date()
            };

            await setDoc(doc(db, 'users', uid), userData);
            
            setIsRegistered(true);
            resetErrorAfterTimeout("Company registered successfully! Verification email sent. Please check your inbox.", true);
        } catch (err: any) {
            setLoading(false);
            if (err.code === 'auth/email-already-in-use') {
                resetErrorAfterTimeout("Email already in use. Please login instead.");
            } else if (err.code === 'auth/weak-password') {
                resetErrorAfterTimeout("Password should be at least 6 characters.");
            } else if (err.code === 'auth/invalid-email') {
                resetErrorAfterTimeout("Please enter a valid email address.");
            } else {
                resetErrorAfterTimeout('Failed to register company. Please try again.');
            }
            console.error(err);
        }
    };

    useEffect(() => {
        if (isRegistered) {
            const timer = setTimeout(() => {
                router.push('/emailVerification');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isRegistered, router]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md" data-aos="fade-up">
                    <h2 className="text-center text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        Register Your Company
                    </h2>
                    <p className="mt-4 text-center text-sm text-gray-400">
                        Join our network of trusted car rental companies
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md" data-aos="fade-up" data-aos-delay="100">
                    <div className="bg-gray-800/50 backdrop-blur-sm py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-gray-700/50">
                        {error && (
                            <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg backdrop-blur-sm" data-aos="fade-up">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {success && (
                            <div className="mb-4 bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-lg backdrop-blur-sm" data-aos="fade-up">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.707 7.293a1 1 0 00-1.414 1.414L10.586 10l-1.293 1.293a1 1 0 101.414 1.414L12 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm">{success}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300">
                                    Company Name
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaBuilding className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="companyName"
                                        required
                                        className="appearance-none block w-full pl-10 px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300">
                                    CNIC
                                </label>
                                <div className="mt-1 relative">
                                    <input
                                        type="text"
                                        name="cnic"
                                        required
                                        pattern="[0-9]{5}-[0-9]{7}-[0-9]{1}"
                                        title="Enter CNIC in 12345-1234567-1 format"
                                        className="appearance-none block w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300">
                                    Email
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaEnvelope className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        className="appearance-none block w-full pl-10 px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300">
                                    Password
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        minLength={6}
                                        className="appearance-none block w-full pl-10 px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300">
                                    Phone Number
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaPhone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        className="appearance-none block w-full pl-10 px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300">
                                    Address
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                                        <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <textarea
                                        name="address"
                                        required
                                        className="appearance-none block w-full pl-10 px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300">
                                    Company Documents
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaFileUpload className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="file"
                                        multiple
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                        onChange={(e) => {
                                            const files = Array.from(e.target.files || []);
                                            setDocuments(files);
                                        }}
                                        className="appearance-none block w-full pl-10 px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500/50 file:text-blue-300 hover:file:bg-blue-500/70"
                                    />
                                </div>
                                <p className="mt-2 text-sm text-gray-400">
                                    Upload registration documents, licenses, etc.
                                </p>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Registering...
                                        </>
                                    ) : 'Register Company'}
                                </button>
                            </div>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-600"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-gray-800/50 text-gray-400">
                                        Benefits
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-1 gap-4">
                                <div className="flex items-center text-gray-300">
                                    <svg className="h-5 w-5 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Manage your fleet of vehicles
                                </div>
                                <div className="flex items-center text-gray-300">
                                    <svg className="h-5 w-5 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Track bookings and revenue
                                </div>
                                <div className="flex items-center text-gray-300">
                                    <svg className="h-5 w-5 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Access detailed analytics
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 