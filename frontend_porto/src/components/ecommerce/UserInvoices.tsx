import { useState, useEffect } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from "../../axios"; 

interface Invoice {
  invoice_id: number;
  invoice_number: string;
  total_amount: string;
  status: string;
  created_at: string;
  booking: {
    ad_slot: {
      slot_name: string;
    };
  } | null;
}

export default function UserInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axiosInstance.get("/api/loggedUserInvoices");
        const invoiceData = response.data.data;
        setInvoices(invoiceData);
        toast.success("Invoices fetched successfully!");
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || "Failed to fetch invoices";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto text-gray-800 dark:text-white">
          Loading invoices...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Your Invoices</h2>
        
        {invoices.length === 0 ? (
          <div className="text-gray-600 dark:text-gray-400">
            No invoices found.
          </div>
        ) : (
          <div className="space-y-6">
            {invoices.map((invoice) => (
              <div
                key={invoice.invoice_id}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {/* Slot Name and Invoice Number */}
                  <div className="md:col-span-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Slot Name:</p>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                      {invoice.booking ? invoice.booking.ad_slot.slot_name : 'N/A'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Invoice #: {invoice.invoice_number}
                    </p>
                  </div>

                  {/* Total Amount */}
                  <div className="md:col-span-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount:</p>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white">
                      TShs {invoice.total_amount}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="md:col-span-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Status:</p>
                    <p className={`text-lg font-semibold ${
                      invoice.status === 'completed' ? 'text-green-600' : 
                      invoice.status === 'pending' || invoice.status === 'unpaid' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {invoice.status}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Created: {new Date(invoice.created_at).toLocaleDateString()}
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
        style={{ top: '80px' }} // Offset for header
      />
    </div>
  );
}