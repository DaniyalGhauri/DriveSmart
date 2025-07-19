import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BookingModal({ car, onClose }: { car: any; onClose: () => void }) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const router = useRouter();

    const handleBooking = () => {
        if (!name || !phone || !address || !fromDate || !toDate) {
            return alert("Please fill in all fields");
        }

        const bookingData = {
            carName: car.name,
            price: car.pricePerDay,
            fromDate,
            toDate,
            userName: name,
            phone,
            address,
        };

        // Save booking data to localStorage
        localStorage.setItem("bookingInfo", JSON.stringify(bookingData));

        // Navigate to checkout page
        router.push("/checkout");
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow max-w-md w-full relative">
                <h2 className="text-xl font-semibold mb-4">Book {car.name}</h2>

                <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full mb-3 p-2 border rounded"
                />
                <input
                    type="text"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full mb-3 p-2 border rounded"
                />
                <input
                    type="text"
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full mb-3 p-2 border rounded"
                />
                <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full mb-3 p-2 border rounded"
                />
                <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full mb-3 p-2 border rounded"
                />

                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
                        Cancel
                    </button>
                    <button onClick={handleBooking} className="px-4 py-2 bg-blue-600 text-white rounded">
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}
