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
  rate: string;
  rate_unit: string;  
  duration_limit: string;
  available: number;
  image: string;
  created_at: string;
  updated_at: string;
}

interface Booking {
  booking_id: number;
  user_id: number;
  ad_slot_id: number;
  quantity: number;
  total_cost: string;
  duration_type: string;
  duration_value: number;
  status: string;
  created_at: string;
  updated_at: string;
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
          const formattedBookings = bookingData.map((booking: Booking) => ({
            ...booking,
            quantity: Number(booking.quantity),
            duration_value: Number(booking.duration_value),
          }));
          setBookings(formattedBookings);
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
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto text-gray-800 dark:text-white">
          Loading bookings...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          Your Bookings
        </h2>
        
        {bookings.length === 0 ? (
          <div className="text-gray-600 dark:text-gray-400 text-lg">
            No bookings found.
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.booking_id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-indigo-500 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Ad Slot Info */}
                  <div className="flex items-start space-x-4">
                    <img 
                      src={booking.ad_slot.image} 
                      alt={`${booking.ad_slot.ad_type} - ${booking.ad_slot.ad_unit}`} 
                      className="w-20 h-20 object-cover rounded-md border border-gray-200 dark:border-gray-700" 
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {booking.ad_slot.ad_unit}
                      </h3>
                      <p className="text-sm text-indigo-600 dark:text-indigo-400">
                        {booking.ad_slot.ad_type}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        <span className="font-medium">Dimensions:</span> {booking.ad_slot.dimensions}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-medium">Device:</span> {booking.ad_slot.device}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-medium">Platform:</span> {booking.ad_slot.platform}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-medium">Placement:</span> {booking.ad_slot.placement_type}
                      </p>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                      Booking Details
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Ad Type:</span> {booking.ad_slot.ad_type}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Quantity:</span> 
                      <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{booking.quantity}</span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Total Hours:</span> 
                      <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{booking.quantity * booking.duration_value} hours</span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Total Cost:</span> 
                      <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{booking.total_cost} Tsh</span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                      <span className="font-medium">Status:</span>
                      <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                        booking.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </p>
                  </div>

                  {/* Rate and Dates */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                      Rate & Dates
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Rate:</span> 
                      <span className="text-indigo-600 dark:text-indigo-400">{booking.ad_slot.rate} Tsh per hour</span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Limit:</span> {booking.ad_slot.duration_limit}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Available:</span> 
                      <span className={booking.ad_slot.available ? 'text-green-600' : 'text-red-600'}>
                        {booking.ad_slot.available ? 'Yes' : 'No'}
                      </span>
                    </p>
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <p><span className="font-medium">Booked:</span> {new Date(booking.created_at).toLocaleString()}</p>
                      <p><span className="font-medium">Updated:</span> {new Date(booking.updated_at).toLocaleString()}</p>
                      <p><span className="font-medium">Slot Created:</span> {new Date(booking.ad_slot.created_at).toLocaleString()}</p>
                    </div>
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