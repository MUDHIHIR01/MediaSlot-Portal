import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import axiosInstance from "../../axios"; // Ensure axiosInstance is properly typed in your axios file
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Define the types for the booking and ad slot data
interface AdSlot {
  ad_unit: string;
  ad_type: string;
  dimensions: string;
  platform: string;
  rate: number;
  rate_unit: string;
  available: boolean;
  image?: string;
}

interface User {
  name: string;
}

interface Booking {
  booking_id: string;
  user: User | null;
  quantity: number;
  total_cost: number;
  duration_value: number;
  duration_type: string;
  status: string;
  created_at: string;
  ad_slot: AdSlot;
}

interface ApiResponse {
  data: {
    data: Booking;
  };
  booking: Booking;
  message?: string;
}

const ConfirmBooking: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>(); // Type for useParams
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axiosInstance.get<ApiResponse>(`/api/bookings/${bookId}`);
        setBooking(response.data.data);
        setStatus(response.data.data.status);
      } catch (error) {
        toast.error("Failed to fetch booking details");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookId, navigate]);

  const handleStatusUpdate = async (newStatus: string) => {
    setUpdating(true);
    try {
      const response = await axiosInstance.put<ApiResponse>(`/api/bookings/${bookId}`, {
        status: newStatus,
      });
      setBooking(response.data.booking);
      setStatus(newStatus);
      toast.success(response.data.message || "Booking status updated successfully");
      setTimeout(() => navigate("/bookings"), 2000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to update booking status";
      toast.error(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading booking details...</div>;
  }

  if (!booking) {
    return <div className="p-4 text-center">Booking not found</div>;
  }

  return (
    <div className="p-4 w-full mx-auto">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        style={{ top: "70px" }}
        closeOnClick
        pauseOnHover
        draggable
        draggablePercent={60}
        hideProgressBar
        closeButton
      />
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg">Booking Details #{booking.booking_id}</h2>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-500 hover:text-blue-600"
          >
            Back
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-md font-semibold mb-2">Booking Information</h3>
            <div className="space-y-2">
              <p><strong>User:</strong> {booking.user?.name || "Unknown"}</p>
              <p><strong>Quantity:</strong> {booking.quantity}</p>
              <p><strong>Total Cost:</strong> TShs {booking.total_cost}</p>
              <p><strong>Duration:</strong> {booking.duration_value} {booking.duration_type}</p>
              <p><strong>Status:</strong> {booking.status}</p>
              <p><strong>Created:</strong> {new Date(booking.created_at).toLocaleString()}</p>
            </div>
          </div>

          <div>
            <h3 className="text-md font-semibold mb-2">Ad Slot Information</h3>
            <div className="space-y-2">
              <p><strong>Ad Unit:</strong> {booking.ad_slot.ad_unit}</p>
              <p><strong>Type:</strong> {booking.ad_slot.ad_type}</p>
              <p><strong>Dimensions:</strong> {booking.ad_slot.dimensions}</p>
              <p><strong>Platform:</strong> {booking.ad_slot.platform}</p>
              <p><strong>Rate:</strong> TShs {booking.ad_slot.rate} {booking.ad_slot.rate_unit.replace("USD", "TShs")}</p>
              <p><strong>Available:</strong> {booking.ad_slot.available ? "Yes" : "No"}</p>
            </div>
            {booking.ad_slot.image && (
              <img
                src={booking.ad_slot.image}
                alt={booking.ad_slot.ad_unit}
                className="mt-2 max-w-full h-auto rounded"
              />
            )}
          </div>
        </div>

        {status === "pending" && (
          <div className="mt-6 flex gap-4">
            <button
              onClick={() => handleStatusUpdate("confirmed")}
              disabled={updating}
              className={`bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition ${
                updating ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {updating ? "Updating..." : "Confirm Booking"}
            </button>
            <button
              onClick={() => handleStatusUpdate("rejected")}
              disabled={updating}
              className={`bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition ${
                updating ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {updating ? "Updating..." : "Reject Booking"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmBooking;