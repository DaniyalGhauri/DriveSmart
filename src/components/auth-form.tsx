import Link from "next/link";
import { useState } from "react";

type SignupType = {
  signup?: boolean;
  func: (email: string, password: string, username?: string, role?: string) => void;
  errorMsg: string;
};

export default function AuthForm({ signup, func, errorMsg }: SignupType) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("Employee");

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="card w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-center font-extrabold text-3xl text-gray-800">
          {signup ? "Sign Up" : "Login"}
        </h1>

        {/* Show error message if any */}
        {errorMsg && (
          <p className="text-center text-red-500 text-sm mt-2">{errorMsg}</p>
        )}

        <div className="mt-6 space-y-4">
          {/* Username Input for Sign Up */}

          {signup && (
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                className="w-full input input-bordered bg-gray-50 focus:ring focus:ring-primary focus:outline-none rounded-lg shadow-sm p-2.5"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          )}
          {/* Email Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full input input-bordered bg-gray-50 focus:ring focus:ring-primary focus:outline-none rounded-lg shadow-sm p-2.5"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full input input-bordered bg-gray-50 focus:ring focus:ring-primary focus:outline-none rounded-lg shadow-sm p-2.5"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button
            className="w-full bg-indigo-500 text-white py-2.5 rounded-lg shadow-md hover:bg-indigo-600 focus:ring focus:ring-indigo-300 focus:outline-none transition"
            onClick={() => {
              func(email, password, username, role);
              setEmail("");
              setPassword("");
              setUsername("");
              if (signup) setRole("customer"); // Reset role only for signup
            }}
          >
            {signup ? "Sign Up" : "Login"}
          </button>
        </div>

        {/* Links for Sign Up/Login */}
        <p className="mt-4 text-center text-sm text-gray-600">
          {signup ? (
            <>
              Already have an account?{" "}
              <Link href="/login" className="text-indigo-500 font-medium hover:underline">
                Login here
              </Link>
              .
            </>
          ) : (
            <>
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-indigo-500 font-medium hover:underline">
                Create here
              </Link>
              .
            </>
          )}
        </p>
      </div>
    </div>
  );
}
