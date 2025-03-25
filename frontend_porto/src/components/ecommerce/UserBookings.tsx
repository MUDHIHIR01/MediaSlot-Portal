import { useState, useEffect } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from "../../axios"; 

interface AdSlot {
  ad_slot_id: number;
  ad_type: string;
  ad_unit: string;
  dimensions: string;
  device: string;
  platform: string;
  placement_type: string;
  rate: string; // Rate in TShs per hour
  duration_limit: string;
  available: number;
  image: string;
  created_at: string;
  updated_at: string;
}

interface Booking {
  quantity: number; // Hours
  total_cost: string; // TShs
  status: string;
  created_at: string;
  ad_slot: AdSlot;
}

export default function UserBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axiosInstance.get("/api/loggedUserBookings");
        const bookingData = response.data.data;
        
        if (!Array.isArray(bookingData) || bookingData.length === 0) {
          toast.info("No bookings found for your account");
          setBookings([]);
        } else {
          // Ensure consistency with TShs per hour
          const updatedBookings = bookingData.map((booking: Booking) => ({
            ...booking,
            ad_slot: {
              ...booking.ad_slot,
              rate_unit: "Tshs/Hour" // Standardize rate unit if it exists in response
            }
          }));
          setBookings(updatedBookings);
          toast.success("Bookings fetched successfully!");
        }
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || "Failed to fetch bookings. Please try again later.";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto text-gray-800 dark:text-white">
          Loading bookings...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Your Bookings</h2>
        
        {bookings.length === 0 ? (
          <div className="text-gray-600 dark:text-gray-400">
            No bookings found.
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {/* Slot Details */}
                  <div className="md:col-span-4 flex items-center space-x-4">
                    <img 
                      src={booking.ad_slot.image} 
                      alt={`${booking.ad_slot.ad_type} - ${booking.ad_slot.ad_unit}`} 
                      className="w-16 h-16 object-cover rounded-md" 
                    />
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                        {booking.ad_slot.ad_unit} ({booking.ad_slot.dimensions})
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {booking.ad_slot.platform} - {booking.ad_slot.device}
                      </p>
                    </div>
                  </div>

                  {/* Hours and Rate */}
                  <div className="md:col-span-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Hours:</p>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white">
                      {booking.quantity}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Rate: TShs {booking.ad_slot.rate} per hour
                    </p>
                  </div>

                  {/* Total Cost */}
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Cost:</p>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white">
                      TShs {booking.total_cost}
                    </p>
                  </div>

                  {/* Status and Date */}
                  <div className="md:col-span-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Status:</p>
                    <p className={`text-lg font-semibold ${
                      booking.status === 'completed' ? 'text-green-600' : 
                      booking.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {booking.status}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Created: {new Date(booking.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ top: '80px' }}
      />
    </div>
  );
}