"use client";

import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const [bookingInfo, setBookingInfo] = useState<any>(null);
  const [hydrated, setHydrated] = useState(false); // prevent mismatch

  useEffect(() => {
    setHydrated(true); // wait until client-side hydration
    const stored = localStorage.getItem("bookingInfo");
    if (stored) {
      setBookingInfo(JSON.parse(stored));
    }
  }, []);

  if (!hydrated) return null; // prevents rendering before hydration

  if (!bookingInfo) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto min-h-full mt-10 p-6 bg-green-100 shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <p><strong>Car:</strong> {bookingInfo.carName}</p>
      <p><strong>From:</strong> {bookingInfo.fromDate}</p>
      <p><strong>To:</strong> {bookingInfo.toDate}</p>
      <p><strong>Rate:</strong> ${bookingInfo.price}/day</p>
      <hr className="my-4" />
      <p><strong>Name:</strong> {bookingInfo.userName}</p>
      <p><strong>Phone:</strong> {bookingInfo.phone}</p>
      <p><strong>Address:</strong> {bookingInfo.address}</p>
      <button className="mt-6 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
        Confirm Booking
      </button>
    </div>
  );
}
