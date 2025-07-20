"use client";

import { useState } from "react";
import CarCard from "@/components/CarCard";
import BookingModal from "@/components/BookingModal";

const dummyCars = [
  { id: "1", name: "Toyota Corolla", brand: "Toyota", pricePerDay: 50, fuelEfficiency: 18, image: "/images/corolla.jpg", available: true },
  { id: "2", name: "Honda Civic", brand: "Honda", pricePerDay: 65, fuelEfficiency: 16, image: "/images/civic.jpg", available: true },
  { id: "3", name: "Hyundai Elantra", brand: "Hyundai", pricePerDay: 55, fuelEfficiency: 20, image: "/images/elantra.jpg", available: true },
];

export default function AvailableCars() {
  const [cars, setCars] = useState(dummyCars);
  const [filteredCars, setFilteredCars] = useState(dummyCars);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const applyFilter = (type: string) => {
    let sortedCars = [...filteredCars];
    switch (type) {
      case "priceLow":
        sortedCars.sort((a, b) => a.pricePerDay - b.pricePerDay);
        break;
      case "priceHigh":
        sortedCars.sort((a, b) => b.pricePerDay - a.pricePerDay);
        break;
      case "fuelBest":
        sortedCars.sort((a, b) => a.fuelEfficiency - b.fuelEfficiency);
        break;
      case "fuelWorst":
        sortedCars.sort((a, b) => b.fuelEfficiency - a.fuelEfficiency);
        break;
      case "brandAZ":
        sortedCars.sort((a, b) => a.brand.localeCompare(b.brand));
        break;
      case "brandZA":
        sortedCars.sort((a, b) => b.brand.localeCompare(a.brand));
        break;
    }
    setFilteredCars(sortedCars);
    setShowFilters(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const result = cars.filter(
      (car) =>
        car.name.toLowerCase().includes(term) ||
        car.brand.toLowerCase().includes(term)
    );
    setFilteredCars(result);
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-green-200 p-10 text-center">
        <h1 className="">Search for available Cars</h1>
        <h1 className="text-lg text-gray-500">Find the perfect car for your needs</h1>
        <div className="flex mt-4 items-center gap-2 justify-center">
          <input
            className="border border-black bg-white px-3 py-2 w-full max-w-md rounded"
            type="text"
            placeholder="Search by name or brand..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <button className="bg-green-600 text-white px-4 py-2 rounded">Search</button>
        </div>
      </div>

      {/* Filter Dropdown */}
      <div className="relative mb-6 mt-6 px-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Filter Options
        </button>

        {showFilters && (
          <div className="absolute mt-2 bg-white shadow-lg rounded p-4 z-10 w-64">
            <p className="font-semibold mb-2">Sort By</p>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => applyFilter("priceLow")}>Price: Low to High</button></li>
              <li><button onClick={() => applyFilter("priceHigh")}>Price: High to Low</button></li>
              <li><button onClick={() => applyFilter("fuelBest")}>Fuel Efficiency: Best First</button></li>
              <li><button onClick={() => applyFilter("fuelWorst")}>Fuel Efficiency: Worst First</button></li>
              <li><button onClick={() => applyFilter("brandAZ")}>Brand: A → Z</button></li>
              <li><button onClick={() => applyFilter("brandZA")}>Brand: Z → A</button></li>
            </ul>
          </div>
        )}
      </div>

      {/* Car Grid */}
   

      {/* Booking Modal */}
      {selectedCar && <BookingModal car={selectedCar} onClose={() => setSelectedCar(null)} />}
    </div>
  );
}
