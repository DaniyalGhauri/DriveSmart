"use client";

import { FirebaseError } from "firebase/app";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useAuthContext } from '@/lib/authContext';

export default function CompanyLogin() {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { user, logout } = useAuthContext();

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }, []);

    const resetErrorAfterTimeout = (msg: string) => {
        setError(msg);
        setTimeout(() => setError(''), 5000);
    };

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            // First authenticate the user
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;

            // Check if the user is a company
            const userDocRef = doc(db, 'users', uid);
            const userDoc = await getDoc(userDocRef);
            
            if (!userDoc.exists()) {
                throw new Error('User account not found.');
            }

            const userData = userDoc.data();
            
            if (userData.role !== 'company') {
                // Sign out the user since they're not a company
                await logout();
                throw new Error('You are not a company. Please use the regular login.');
            }

            // If user is a company, redirect to company dashboard
            router.push('/company-dashboard');
        } catch (err: unknown) {
            setIsLoading(false);
            if (err instanceof FirebaseError) {
                switch (err.code) {
                    case "auth/user-not-found":
                        resetErrorAfterTimeout("No account found with this email.");
                        break;
                    case "auth/wrong-password":
                        resetErrorAfterTimeout("Incorrect password. Please try again.");
                        break;
                    case "auth/invalid-email":
                        resetErrorAfterTimeout("Please enter a valid email address.");
                        break;
                    case "auth/user-disabled":
                        resetErrorAfterTimeout("This account has been disabled.");
                        break;
                    case "auth/too-many-requests":
                        resetErrorAfterTimeout("Too many attempts. Please try again later.");
                        break;
                    default:
                        resetErrorAfterTimeout("Login failed. Please try again.");
                }
            } else if (err instanceof Error) {
                resetErrorAfterTimeout(err.message);
            } else {
                resetErrorAfterTimeout("An unexpected error occurred.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md" data-aos="fade-up">
                    <h2 className="text-center text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        Company Portal
                    </h2>
                    <p className="mt-4 text-center text-sm text-gray-400">
                        Don't have a company account?{' '}
                        <Link href="/company-registration" className="font-medium text-blue-400 hover:text-blue-300 transition-colors duration-300">
                            Register your company
                        </Link>
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

                        <form className="space-y-6" onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target as HTMLFormElement);
                            const email = formData.get('email') as string;
                            const password = formData.get('password') as string;
                            login(email, password);
                        }}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                    Company Email
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="appearance-none block w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                    Password
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        className="appearance-none block w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-600 rounded bg-gray-700/50"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                                        Remember me
                                    </label>
                                </div>

                                <div className="text-sm">
                                    <Link href="/forgot-password" className="font-medium text-blue-400 hover:text-blue-300 transition-colors duration-300">
                                        Forgot your password?
                                    </Link>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Signing in...
                                        </>
                                    ) : 'Sign in'}
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
                                        Company Benefits
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