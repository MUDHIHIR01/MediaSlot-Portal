import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import axiosInstance from "../../axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditDepartment() {
  const navigate = useNavigate();
  const { departmentId } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    location: ""
  });
  const [errors, setErrors] = useState({
    name: "",
    location: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await axiosInstance.get(`/api/departments/${departmentId}`);
        setFormData({
          name: response.data.data.name || "",
          location: response.data.data.location || ""
        });
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Failed to fetch department";
        toast.error(errorMessage);
        navigate("/departments");
      }
    };

    fetchDepartment();
  }, [departmentId, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: "", location: "" };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    } else if (formData.name.length > 255) {
      newErrors.name = "Name must not exceed 255 characters";
      isValid = false;
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
      isValid = false;
    } else if (formData.location.length > 255) {
      newErrors.location = "Location must not exceed 255 characters";
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
      const response = await axiosInstance.put(`/api/departments/${departmentId}`, formData);
      if (response.status === 200) {
        toast.success("Department updated successfully");
        setTimeout(() => navigate("/departments"), 3000);
      }
    } catch (error: any) {
      const errorResponse = error.response?.data;
      if (errorResponse?.errors) {
        setErrors(prev => ({
          ...prev,
          ...errorResponse.errors
        }));
      }
      const errorMessage = errorResponse?.message || "Failed to update department";
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
        style={{ marginTop: "60px" }}
        closeOnClick
        pauseOnHover
        draggable
        draggablePercent={60}
        hideProgressBar
        closeButton
      />
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg  mb-6">Edit Department</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name *
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter department name"
              maxLength={255}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location *
            </label>
            <input
              type="text"
              name="location"
              id="location"
              value={formData.location}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter department location"
              maxLength={255}
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-500">{errors.location}</p>
            )}
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/departments")}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition shadow-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`relative bg-blue-500 text-white px-4 py-2 rounded-lg transition shadow-md ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 text-white mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Updating...</span>
                </div>
              ) : (
                "Update Department"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}