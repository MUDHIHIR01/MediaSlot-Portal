import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from "../../axios";
import { ShoppingCartIcon, TrashIcon, XCircleIcon } from "@heroicons/react/24/outline";
import jsPDF from "jspdf";

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

interface BookingSlot extends AdSlot {
  quantity: number | string;
}

interface InvoiceItem {
  ad_slot_id: number;
  ad_unit: string;
  quantity: number;
  duration: string;
  total_amount: string; 
  date: string;
}

interface Invoice {
  invoice_id: number;
  invoice_number: string;
  items: InvoiceItem[];
  total_amount: string; 
  total_quantity: number;
  date: string;
  status: string;
}

export default function CartPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedAds, setSelectedAds] = useState<BookingSlot[]>(
    location.state?.selectedAds.map((ad: AdSlot) => ({ ...ad, quantity: "" })) || []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  // Cart total cost: sum of (rate * quantity)
  const totalCost = selectedAds.reduce((sum, ad) => {
    const rate = Number(ad.rate) || 0;
    const quantity = Number(ad.quantity) || 0;
    return sum + rate * quantity;
  }, 0);

  const isBookingValid = selectedAds.every(
    (ad) => Number(ad.quantity) > 0 && ad.available
  );

  const handleRemove = (adSlotId: number) => {
    setSelectedAds(selectedAds.filter((ad) => ad.ad_slot_id !== adSlotId));
    toast.info("Item removed from cart");
  };

  const handleQuantityChange = (adSlotId: number, value: string) => {
    const numericValue = value === "" ? "" : Math.max(1, parseInt(value) || 1);
    setSelectedAds(
      selectedAds.map((ad) =>
        ad.ad_slot_id === adSlotId ? { ...ad, quantity: numericValue } : ad
      )
    );
  };

  const handleBookNow = async () => {
    if (!isBookingValid) {
      toast.error("Please enter a valid quantity (at least 1) for each available slot");
      setError("Please enter a valid quantity (at least 1) for each available slot.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const bookings = selectedAds.map((ad) => ({
        ad_slot_id: ad.ad_slot_id,
        quantity: Number(ad.quantity),
        duration_type: "hours",
        duration_value: 1,
      }));

      const response = await axiosInstance.post("/api/bookings", { bookings });
      setInvoice({
        ...response.data.invoice,
        total_quantity: selectedAds.reduce((sum, ad) => sum + Number(ad.quantity), 0),
      });
      setSelectedAds([]);
      toast.success("Booking completed successfully!");
    } catch (err: any) {
      console.error("Booking error:", err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || "Failed to create bookings";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelCart = () => {
    setSelectedAds([]);
    navigate("/dashboard");
    toast.info("Returning to dashboard");
  };

  const handlePrintPDF = () => {
    if (!invoice) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    let yOffset = margin;

    doc.setFillColor(33, 150, 243);
    doc.rect(0, 0, pageWidth, 30, "F");
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", pageWidth / 2, yOffset + 10, { align: "center" });
    yOffset += 20;

    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text(`Invoice #: ${invoice.invoice_number}`, margin, yOffset);
    doc.text(`Date: ${new Date(invoice.date).toLocaleString()}`, pageWidth - margin, yOffset, { align: "right" });
    yOffset += 15;

    const tableStart = yOffset;
    const colWidths = { slot: 100, qty: 30, amount: 50 };
    const rowHeight = 10;

    doc.setFillColor(200, 220, 255);
    doc.rect(margin, yOffset, pageWidth - 2 * margin, rowHeight, "F");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("Ad Unit", margin + 5, yOffset + 7);
    doc.text("Quantity", margin + colWidths.slot + 15, yOffset + 7);
    doc.text("Amount", margin + colWidths.slot + colWidths.qty + 25, yOffset + 7, { align: "right" });
    yOffset += rowHeight;

    invoice.items.forEach((item, index) => {
      const fillColor = index % 2 === 0 ? 240 : 255;
      doc.setFillColor(fillColor, fillColor, fillColor);
      doc.rect(margin, yOffset, pageWidth - 2 * margin, rowHeight, "F");
      doc.setFont("helvetica", "normal");
      doc.text(item.ad_unit.substring(0, 45), margin + 5, yOffset + 7);
      doc.text(item.quantity.toString(), margin + colWidths.slot + 15, yOffset + 7);
      doc.text(`TShs ${item.total_amount}`, margin + colWidths.slot + colWidths.qty + 25, yOffset + 7, { align: "right" });
      yOffset += rowHeight;
    });

    doc.setLineWidth(0.2);
    doc.setDrawColor(33, 150, 243);
    doc.rect(margin, tableStart, pageWidth - 2 * margin, yOffset - tableStart);

    yOffset += 15;

    doc.setFillColor(230, 245, 255);
    doc.rect(margin, yOffset, pageWidth - 2 * margin, 25, "F");
    doc.setFontSize(14);
    doc.setTextColor(33, 150, 243);
    doc.setFont("helvetica", "bold");
    doc.text(`Total Quantity: ${invoice.total_quantity}`, margin + 5, yOffset + 10);
    doc.text(`Total Amount: TShs ${invoice.total_amount}`, pageWidth - margin - 5, yOffset + 10, { align: "right" });

    doc.save(`invoice_${invoice.invoice_number}.pdf`);
    toast.success("Invoice PDF generated successfully!");
  };

  const handleCancelInvoice = () => {
    setInvoice(null);
    navigate("/dashboard");
    toast.info("Returning to dashboard");
  };

  if (selectedAds.length === 0 && !loading && !error && !invoice) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto text-gray-800 dark:text-white">
          <h2 className="text-2xl font-semibold mb-4">Your Cart is Empty</h2>
          <button
            onClick={handleCancelInvoice}
            className="py-2 px-4 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
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
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Your Cart</h2>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        {selectedAds.length > 0 && (
          <div className="space-y-6">
            {selectedAds.map((ad) => (
              <div
                key={ad.ad_slot_id}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {/* Slot Details */}
                  <div className="md:col-span-6">
                    <div className="flex items-center space-x-4">
                      <img 
                        src={ad.image} 
                        alt={`${ad.ad_type} - ${ad.ad_unit}`} 
                        className="w-16 h-16 object-cover rounded-md" 
                      />
                      <div>
                        <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                          {ad.ad_unit} ({ad.dimensions})
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {ad.platform} - {ad.device}
                        </p>
                        <p className={`text-sm ${ad.available ? "text-green-600" : "text-red-600"}`}>
                          {ad.available ? "Available" : "Not Available"}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Rate: TShs {ad.rate} {ad.rate_unit}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="md:col-span-3 flex items-center space-x-2">
                    <label className="text-sm text-gray-600 dark:text-gray-400">Quantity:</label>
                    <input
                      type="number"
                      min="1"
                      value={ad.quantity}
                      onChange={(e) => handleQuantityChange(ad.ad_slot_id, e.target.value)}
                      className={`w-20 p-1 border rounded-md dark:bg-gray-700 dark:text-white ${
                        ad.quantity === "" || Number(ad.quantity) < 1 ? "border-red-500" : ""
                      }`}
                      disabled={loading}
                      placeholder="Quantity"
                    />
                    {(ad.quantity === "" || Number(ad.quantity) < 1) && (
                      <p className="text-xs text-red-600">
                        {ad.quantity === "" ? "Required" : "Min 1"}
                      </p>
                    )}
                  </div>

                  {/* Amount and Remove Button */}
                  <div className="md:col-span-3 flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                      TShs {(Number(ad.rate) * (Number(ad.quantity) || 0)).toLocaleString()}
                    </p>
                    <button
                      onClick={() => handleRemove(ad.ad_slot_id)}
                      className="p-2 text-red-600 hover:text-red-700"
                      disabled={loading}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
              <p className="text-lg font-semibold text-gray-800 dark:text-white mb-4 sm:mb-0">
                Total Cost: <span className="text-blue-600">TShs {totalCost.toFixed(2)}</span>
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={handleCancelCart}
                  className="py-2 px-6 rounded-md bg-red-600 text-white hover:bg-red-700 flex items-center transition-colors"
                >
                  <XCircleIcon className="w-5 h-5 mr-2" />
                  Cancel
                </button>
                <button
                  onClick={handleBookNow}
                  disabled={loading || !isBookingValid}
                  className={`py-2 px-6 rounded-md text-white flex items-center transition-colors ${
                    loading || !isBookingValid
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  <ShoppingCartIcon className="w-5 h-5 mr-2" />
                  {loading ? "Booking..." : "Book Now"}
                </button>
              </div>
            </div>
          </div>
        )}

        {invoice && (
          <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-t-4 border-blue-500">
            <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">Invoice Details</h3>
            <div className="mb-6">
              <p className="text-gray-800 dark:text-gray-200">
                <strong className="text-blue-600 dark:text-blue-400">Invoice #:</strong> {invoice.invoice_number}
              </p>
              <p className="text-gray-800 dark:text-gray-200">
                <strong className="text-blue-600 dark:text-blue-400">Date:</strong> {new Date(invoice.date).toLocaleString()}
              </p>
            </div>
            {invoice.items.map((item, index) => (
              <div key={index} className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <p className="text-gray-800 dark:text-gray-200">
                    <strong className="text-blue-600 dark:text-blue-400">Ad Unit:</strong> {item.ad_unit}
                  </p>
                  <p className="text-gray-800 dark:text-gray-200">
                    <strong className="text-blue-600 dark:text-blue-400">Quantity:</strong> {item.quantity}
                  </p>
                  <p className="text-gray-800 dark:text-gray-200">
                    <strong className="text-blue-600 dark:text-blue-400">Amount:</strong> TShs {item.total_amount}
                  </p>
                </div>
              </div>
            ))}
            <div className="mt-4">
              <p className="text-lg font-semibold text-gray-800 dark:text-white">
                Total Quantity: <span className="text-blue-600">{invoice.total_quantity}</span>
              </p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">
                Total Amount: <span className="text-blue-600">TShs {invoice.total_amount}</span>
              </p>
            </div>
            <div className="mt-6 flex space-x-4">
              <button
                onClick={handlePrintPDF}
                className="py-2 px-6 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
              >
                Print PDF
              </button>
              <button
                onClick={handleCancelInvoice}
                className="py-2 px-6 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Cancel
              </button>
            </div>
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
      />
    </div>
  );
}