"use client";

import { useState, useEffect } from "react";

interface Booking {
  carId: string;
  carName: string;
  pricePerDay: number;
  fromDate: string;
  toDate: string;
}

interface Car {
  id: string;
  name: string;
  company: string;
  pricePerDay: number;
  fuelEfficiency: string;
  imageUrl: string;
  available: boolean;
}

export default function BOwnerDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cars, setCars] = useState<Car[]>([
    {
      id: "car1",
      name: "Suzuki Alto",
      company: "Suzuki",
      pricePerDay: 2500,
      fuelEfficiency: "22 km/l",
      imageUrl: "https://via.placeholder.com/400x250?text=Suzuki+Alto",
      available: true,
    },
    {
      id: "car2",
      name: "Honda Civic",
      company: "Honda",
      pricePerDay: 5000,
      fuelEfficiency: "14 km/l",
      imageUrl: "https://via.placeholder.com/400x250?text=Honda+Civic",
      available: true,
    },
  ]);

  const [carForm, setCarForm] = useState({
    name: "",
    company: "",
    pricePerDay: 0,
    fuelEfficiency: "",
    imageFile: null as File | null,
  });

  useEffect(() => {
    setBookings([
      {
        carId: "1",
        carName: "Toyota Corolla",
        pricePerDay: 4000,
        fromDate: "2025-05-10",
        toDate: "2025-05-15",
      },
    ]);
  }, []);

  const handleAddCar = () => {
    const { name, company, pricePerDay, fuelEfficiency, imageFile } = carForm;
    if (!name || !company || !pricePerDay || !fuelEfficiency || !imageFile) {
      return alert("Please fill in all car details.");
    }

    const imageUrl = URL.createObjectURL(imageFile);

    const newCar: Car = {
      id: Date.now().toString(),
      name,
      company,
      pricePerDay,
      fuelEfficiency,
      imageUrl,
      available: true,
    };

    setCars((prev) => [...prev, newCar]);

    setCarForm({
      name: "",
      company: "",
      pricePerDay: 0,
      fuelEfficiency: "",
      imageFile: null,
    });

    (document.getElementById("car-image") as HTMLInputElement).value = "";
  };

  const calculateEarnings = () => {
    return bookings.reduce((total, b) => {
      const days =
        (new Date(b.toDate).getTime() - new Date(b.fromDate).getTime()) /
        (1000 * 3600 * 24);
      return total + days * b.pricePerDay;
    }, 0);
  };

  return (
    <div className="p-8 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-center text-green-700 text mb-6">Manage Your Account</h1>

      {/* Add Car Section */}
      <div className="mb-6 bg-green-100 p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Add New Car</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Car Name"
            value={carForm.name}
            onChange={(e) => setCarForm({ ...carForm, name: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Company Name"
            value={carForm.company}
            onChange={(e) => setCarForm({ ...carForm, company: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Daily Rent Price"
            value={carForm.pricePerDay}
            onChange={(e) =>
              setCarForm({ ...carForm, pricePerDay: Number(e.target.value) })
            }
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Fuel Efficiency (e.g. 15 km/l)"
            value={carForm.fuelEfficiency}
            onChange={(e) =>
              setCarForm({ ...carForm, fuelEfficiency: e.target.value })
            }
            className="p-2 border rounded"
          />
          <input
            id="car-image"
            type="file"
            accept="image/*"
            onChange={(e) =>
              setCarForm({ ...carForm, imageFile: e.target.files?.[0] || null })
            }
            className="p-2 border rounded"
          />
        </div>
        <button
          onClick={handleAddCar}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Car
        </button>
      </div>

      {/* Listed Cars */}
      <div className="mb-6 bg-green-100 p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Your Cars</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cars.map((car) => (
            <div key={car.id} className="border p-4 rounded shadow bg-green-100">
              <img
                src={car.imageUrl}
                alt={car.name}
                className="w-full h-48 object-cover rounded mb-2"
              />
              <p><strong>Name:</strong> {car.name}</p>
              <p><strong>Company:</strong> {car.company}</p>
              <p><strong>Rent/Day:</strong> Rs {car.pricePerDay}</p>
              <p><strong>Fuel Avg:</strong> {car.fuelEfficiency}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bookings */}
      <div className="mb-6 bg-green-100 p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Bookings</h2>
        {bookings.length === 0 ? (
          <p>No bookings yet.</p>
        ) : (
          <ul className="space-y-2">
            {bookings.map((b, index) => (
              <li key={index} className="border-b py-2">
                <strong>{b.carName}</strong> booked from {b.fromDate} to {b.toDate} @ Rs{" "}
                {b.pricePerDay}/day
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Earnings */}
      <div className="bg-green-100 p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Total Earnings</h2>
        <p className="text-lg font-bold text-green-700">
          Rs {calculateEarnings().toFixed(2)}
        </p>
      </div>
    </div>
  );
}
