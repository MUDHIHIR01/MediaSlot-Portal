import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import axiosInstance from "../../axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ApproveRequest() {
  const navigate = useNavigate();
  const { requestId } = useParams();
  const [formData, setFormData] = useState({
    user_name: "",
    department_name: "",
    item: "",
    item_type: "",
    amount_requested: "",
    vender: "",
    vender_account_name: "",
    vendor_account_number: "",
    created_at: "",
    is_approved: ""
  });
  const [errors, setErrors] = useState({
    is_approved: ""
  });
  const [loading, setLoading] = useState(false);

  // Fetch request data
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await axiosInstance.get(`/api/requests/${requestId}`);
        const requestData = response.data.data;
        
        setFormData({
          user_name: requestData.user.name,
          department_name: requestData.department.name,
          item: JSON.parse(requestData.item).join(', '),
          item_type: requestData.item_type,
          amount_requested: requestData.amount_requested ? `${parseFloat(requestData.amount_requested).toLocaleString()} KES` : "N/A",
          vender: requestData.vender,
          vender_account_name: requestData.vender_account_name,
          vendor_account_number: requestData.vendor_account_number,
          created_at: new Date(requestData.created_at).toLocaleDateString(),
          is_approved: requestData.is_approved
        });
      } catch (error: any) {
        toast.error("Failed to fetch request data");
        navigate("/requests");
      }
    };
    fetchRequest();
  }, [requestId, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      is_approved: ""
    };

    if (!formData.is_approved) {
      newErrors.is_approved = "Approval status is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const payload = {
        is_approved: formData.is_approved
      };

      const response = await axiosInstance.put(`/api/requests/${requestId}`, payload);
      if (response.status === 200) {
        toast.success(response.data.message || "Request updated successfully");
        setTimeout(() => navigate("/requests"), 3000);
      }
    } catch (error: any) {
      const errorResponse = error.response?.data;
      if (errorResponse?.errors) {
        setErrors(prev => ({ ...prev, ...errorResponse.errors }));
      }
      const errorMessage = errorResponse?.message || "Failed to update request";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
        <h2 className="text-lg mb-6">Approve Request</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">User</label>
            <input
              type="text"
              value={formData.user_name}
              className="w-full p-2 border rounded-md border-gray-300 bg-gray-100"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <input
              type="text"
              value={formData.department_name}
              className="w-full p-2 border rounded-md border-gray-300 bg-gray-100"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Items</label>
            <input
              type="text"
              value={formData.item}
              className="w-full p-2 border rounded-md border-gray-300 bg-gray-100"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Item Type</label>
            <input
              type="text"
              value={formData.item_type}
              className="w-full p-2 border rounded-md border-gray-300 bg-gray-100"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="text"
              value={formData.amount_requested}
              className="w-full p-2 border rounded-md border-gray-300 bg-gray-100"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Vendor</label>
            <input
              type="text"
              value={formData.vender}
              className="w-full p-2 border rounded-md border-gray-300 bg-gray-100"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Vendor Account Name</label>
            <input
              type="text"
              value={formData.vender_account_name}
              className="w-full p-2 border rounded-md border-gray-300 bg-gray-100"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Vendor Account Number</label>
            <input
              type="text"
              value={formData.vendor_account_number}
              className="w-full p-2 border rounded-md border-gray-300 bg-gray-100"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Created At</label>
            <input
              type="text"
              value={formData.created_at}
              className="w-full p-2 border rounded-md border-gray-300 bg-gray-100"
              disabled
            />
          </div>

          <div>
            <label htmlFor="is_approved" className="block text-sm font-medium text-gray-700">Approval Status *</label>
            <select
              name="is_approved"
              value={formData.is_approved}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.is_approved ? 'border-red-500' : 'border-gray-300'}`}
              required
            >
              <option value="">Select status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
            {errors.is_approved && <p className="mt-1 text-sm text-red-500">{errors.is_approved}</p>}
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/requests")}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? "Updating..." : "Update Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}