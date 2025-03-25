import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import axiosInstance from "../../axios";
import { PrinterIcon } from "@heroicons/react/24/outline";
import jsPDF from "jspdf";

interface AdSlot {
  ad_slot_id: number;
  slot_name: string;
  position: string;
  size: string;
  price: string;
  available: boolean;
  image: string;
  created_at: string;
  updated_at: string;
}

export default function InvoicesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, bookingIds, selectedAds } = location.state || { userId: null, bookingIds: [], selectedAds: [] };
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const totalAmount = selectedAds.reduce((sum: number, ad: AdSlot) => sum + Number(ad.price), 0);

  const handleGenerateInvoice = async () => {
    if (bookingIds.length === 0 || !userId) {
      setError("Missing booking IDs or user ID.");
      return;
    }

    setLoading(true);
    setError(null);

    const payload = { booking_id: bookingIds[0] };
    console.log("Sending invoice request:", payload);

    try {
      const response = await axiosInstance.post("/api/invoices", payload);
      setInvoiceData(response.data.data);
      setIsModalOpen(true);
    } catch (err: any) {
      console.error("Invoice error:", err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || "Failed to generate invoice. Please try again.";
      const errors = err.response?.data?.errors ? Object.values(err.response.data.errors).join(", ") : "";
      setError(`${errorMessage}${errors ? `: ${errors}` : ""}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Invoice", 20, 20);
    doc.setFontSize(12);
    doc.text(`Invoice Number: ${invoiceData.invoice_number}`, 20, 30);
    doc.text(`User ID: ${userId}`, 20, 40);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 50);
    doc.text(`Total Amount: TShs ${totalAmount.toFixed(2)}`, 20, 60);
    doc.text("Booked Slots:", 20, 70);
    selectedAds.forEach((ad: AdSlot, index: number) => {
      doc.text(`${index + 1}. ${ad.slot_name} (ID: ${ad.ad_slot_id}) - TShs ${ad.price}`, 30, 80 + index * 10);
    });
    doc.text("Payment Options:", 20, 80 + selectedAds.length * 10 + 10);
    doc.text("CRDB: 12744466466", 30, 80 + selectedAds.length * 10 + 20);
    doc.text("NMB: 137746464664", 30, 80 + selectedAds.length * 10 + 30);
    doc.text("MIX BY YAS: 0426262662", 30, 80 + selectedAds.length * 10 + 40);
    doc.text("LIPA NUMBER: 473771919", 30, 80 + selectedAds.length * 10 + 50);
    doc.text("HALOPESA: 463626266", 30, 80 + selectedAds.length * 10 + 60);
    doc.text("M-PESA: 4737777", 30, 80 + selectedAds.length * 10 + 70);
    doc.save(`invoice_${invoiceData.invoice_number}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto text-gray-800 dark:text-white">
        <h2 className="text-3xl font-bold mb-6">Booking Confirmation</h2>
        {bookingIds.length > 0 && userId ? (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <p className="text-lg font-semibold">Your bookings have been successfully created!</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              User ID: <span className="font-medium">{userId}</span>
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Booking IDs: <span className="font-medium">{bookingIds.join(", ")}</span>
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Total Amount: <span className="font-medium">TShs {totalAmount.toFixed(2)}</span>
            </p>
            {error && <div className="text-red-600 mt-4">{error}</div>}
            <button
              onClick={handleGenerateInvoice}
              disabled={loading}
              className={`mt-4 py-2 px-4 rounded-md text-white flex items-center ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              <PrinterIcon className="w-5 h-5 mr-2" />
              {loading ? "Generating..." : "Generate Invoice"}
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="mt-4 ml-4 py-2 px-4 rounded-md bg-gray-600 text-white hover:bg-gray-700"
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          <p className="text-red-600">Missing booking IDs or user ID. Please try booking again.</p>
        )}
      </div>

      {/* Invoice Popup */}
      {isModalOpen && invoiceData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full mx-4 shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Invoice</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Invoice Number: <span className="font-medium">{invoiceData.invoice_number}</span>
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              User ID: <span className="font-medium">{userId}</span>
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Date: {new Date().toLocaleDateString()}
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Total Amount: <span className="font-medium">TShs {totalAmount.toFixed(2)}</span>
            </p>
            <div className="mt-4">
              <h4 className="text-lg font-medium text-gray-800 dark:text-white">Booked Slots:</h4>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                {selectedAds.map((ad: AdSlot) => (
                  <li key={ad.ad_slot_id}>
                    {ad.slot_name} (ID: {ad.ad_slot_id}) - TShs {ad.price}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4">
              <h4 className="text-lg font-medium text-gray-800 dark:text-white">Payment Options:</h4>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                <li>CRDB: 12744466466</li>
                <li>NMB: 137746464664</li>
                <li>MIX BY YAS: 0426262662</li>
                <li>LIPA NUMBER: 473771919</li>
                <li>HALOPESA: 463626266</li>
                <li>M-PESA: 4737777</li>
              </ul>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="py-2 px-4 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Close
              </button>
              <button
                onClick={handlePrintPDF}
                className="py-2 px-4 rounded-md bg-blue-600 text-white hover:bg-blue-700 flex items-center"
              >
                <PrinterIcon className="w-5 h-5 mr-2" />
                Print PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}