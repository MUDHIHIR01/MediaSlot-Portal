import { useState, useEffect } from "react";
import axiosInstance from "../../axios";

interface AdSlot {
  ad_slot_id: number;
  slot_name: string;
  position: string;
  size: string;
  price: string;
  available: boolean;
  image: string;
}

export default function AdSlotMetrics() {
  const [slots, setSlots] = useState<AdSlot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await axiosInstance.get("/api/ad-slots");
        setSlots(response.data);
      } catch (err) {
        console.error("Fetch ad slots error:", err);
        setErrorMessage("Unable to load ad slots. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, []);

  if (loading) {
    return <div>Loading ad slots...</div>;
  }

  if (errorMessage) {
    return <div className="text-red-500">{errorMessage}</div>;
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white/90">
        Available Ad Slots
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {slots.map((slot) => (
          <div
            key={slot.ad_slot_id}
            className="p-4 rounded-lg shadow-md bg-white flex flex-col"
          >
            <img
              src={slot.image}
              alt={slot.slot_name}
              className="w-full h-32 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <h4 className="text-lg font-medium">{slot.slot_name}</h4>
              <p className="text-sm text-gray-600">Position: {slot.position}</p>
              <p className="text-sm text-gray-600">Size: {slot.size}</p>
              <p className="text-sm font-semibold">Price: ${slot.price}</p>
              <p className={`text-sm ${slot.available ? "text-green-600" : "text-red-600"}`}>
                {slot.available ? "Available" : "Booked"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}