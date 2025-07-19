"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccess("");
        setError("");

        try {
            await sendPasswordResetEmail(auth, email);
            setSuccess("Password reset email sent! Please check your inbox.");
        } catch (err: any) {
            setError(err.message || "Something went wrong. Try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex justify-center items-center relative overflow-hidden">
            {/* Glowing Background Circles */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-blue-500/5 rounded-full blur-3xl" />

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-blue-500/10 shadow-xl p-10 rounded-2xl w-full max-w-md z-10">
                <div className="mb-6 text-center">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-300">
                        Forgot Password?
                    </h2>
                    <p className="text-gray-400 mt-2 text-sm">
                        Enter your email and we'll send you a reset link.
                    </p>
                </div>

                <form onSubmit={handleReset} className="space-y-5">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-slate-700/50 border border-blue-500/20 rounded-xl p-3 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all duration-300"
                    />

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium py-3 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] transition-all duration-300"
                    >
                        Send Reset Link
                    </button>
                </form>

                {success && (
                    <div className="mt-4 text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl p-3">
                        {success}
                    </div>
                )}

                {error && (
                    <div className="mt-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                        {error}
                    </div>
                )}

                <div className="text-center mt-6">
                    <button
                        onClick={() => router.push("/login")}
                        className="text-blue-400 hover:underline text-sm"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
}
