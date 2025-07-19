interface Car {
    id: string;
    name: string;
    brand: string;
    pricePerDay: number;
    image: string;
    available: boolean;
}

export default function CarCard({ car, onBook }: { car: Car; onBook: () => void }) {
    return (
        <div className="bg-green-100 shadow rounded p-4">
            <img src={car.image} alt={car.name} className="w-full h-40 object-cover rounded mb-4" />
          <div className="flex justify-between items-center content-center">
              <h2 className="text-xl font-semibold">{car.name}</h2>
            <p className="text-sm text-gray-500">{car.brand}</p>
            <p className="mt-2 font-medium">${car.pricePerDay} / day</p>
          <div className="">
              <button
                onClick={onBook}
                className=" bg-green-600 p-2 text-white rounded hover:bg-green-700"
            >
                Book Now
            </button>
          </div>
          </div>
            
        </div>
    );
}
