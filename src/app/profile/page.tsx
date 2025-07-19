"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import RouteProtection from "@/components/RouteProtection";

export default function ProfilePage() {
  const [userData, setUserData] = useState({ name: "", phone: "", cnic: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (!user) {
        router.push("/login");
        return;
      }
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData({
            name: data.name || "",
            phone: data.phone || "",
            cnic: data.cnic || "",
          });
        } else {
          setError("User profile not found.");
        }
      } catch (err) {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    const user = auth.currentUser;
    if (!user) {
      setError("Not authenticated.");
      setSaving(false);
      return;
    }
    try {
      await updateDoc(doc(db, "users", user.uid), {
        name: userData.name,
        phone: userData.phone,
        cnic: userData.cnic,
      });
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <RouteProtection allowedRoles={["customer"]} redirectTo="/">
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col justify-center items-center py-12 px-4">
        <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-700/50 w-full max-w-md">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-6 text-center">My Profile</h2>
          {error && <div className="mb-4 bg-red-500/10 border-l-4 border-red-500 p-4 rounded-r-lg text-red-400">{error}</div>}
          {success && <div className="mb-4 bg-green-500/10 border-l-4 border-green-500 p-4 rounded-r-lg text-green-400">{success}</div>}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={userData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={userData.phone}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
              />
            </div>
            <div>
              <label htmlFor="cnic" className="block text-sm font-medium text-gray-300">CNIC</label>
              <input
                id="cnic"
                name="cnic"
                type="text"
                required
                pattern="[0-9]{5}-[0-9]{7}-[0-9]{1}"
                title="Enter CNIC in 12345-1234567-1 format"
                value={userData.cnic}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </RouteProtection>
  );
} 