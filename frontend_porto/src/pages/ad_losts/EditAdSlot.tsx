import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import axiosInstance from "../../axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditAdSlot() {
  const navigate = useNavigate();
  const { adslotId } = useParams(); // Updated to match route parameter name
  const [formData, setFormData] = useState({
    ad_type: "",
    ad_unit: "",
    dimensions: "",
    device: "",
    platform: "",
    placement_type: "",
    rate: "",
    rate_unit: "",
    duration_limit: "",
    available: 1, // Default to true (1)
    image: ""
  });
  const [errors, setErrors] = useState({
    ad_type: "",
    ad_unit: "",
    dimensions: "",
    device: "",
    platform: "",
    placement_type: "",
    rate: "",
    rate_unit: "",
    duration_limit: "",
    available: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAdSlot = async () => {
      try {
        const response = await axiosInstance.get(`/api/ad-slots/${adslotId}`);
        const adSlot = response.data.data;
        if (adSlot) {
          setFormData({
            ad_type: adSlot.ad_type || "",
            ad_unit: adSlot.ad_unit || "",
            dimensions: adSlot.dimensions || "",
            device: adSlot.device || "",
            platform: adSlot.platform || "",
            placement_type: adSlot.placement_type || "",
            rate: adSlot.rate || "",
            rate_unit: adSlot.rate_unit || "",
            duration_limit: adSlot.duration_limit || "",
            available: adSlot.available || 1,
            image: adSlot.image || ""
          });
        }
      } catch (error) {
        toast.error("Failed to fetch ad slot data");
        navigate("/ad-slots");
      }
    };
    fetchAdSlot();
  }, [adslotId, navigate]); // Updated dependency to adslotId

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      ad_type: "",
      ad_unit: "",
      dimensions: "",
      device: "",
      platform: "",
      placement_type: "",
      rate: "",
      rate_unit: "",
      duration_limit: "",
      available: ""
    };

    if (formData.ad_type && formData.ad_type.length > 255) {
      newErrors.ad_type = "Ad type must not exceed 255 characters";
      isValid = false;
    }

    if (formData.ad_unit && formData.ad_unit.length > 255) {
      newErrors.ad_unit = "Ad unit must not exceed 255 characters";
      isValid = false;
    }

    if (formData.dimensions && formData.dimensions.length > 50) {
      newErrors.dimensions = "Dimensions must not exceed 50 characters";
      isValid = false;
    }

    if (formData.device && formData.device.length > 255) {
      newErrors.device = "Device must not exceed 255 characters";
      isValid = false;
    }

    if (formData.platform && formData.platform.length > 255) {
      newErrors.platform = "Platform must not exceed 255 characters";
      isValid = false;
    }

    if (formData.placement_type && formData.placement_type.length > 255) {
      newErrors.placement_type = "Placement type must not exceed 255 characters";
      isValid = false;
    }

    if (formData.rate && (isNaN(Number(formData.rate)) || Number(formData.rate) < 0)) {
      newErrors.rate = "Rate must be a non-negative number";
      isValid = false;
    }

    if (formData.rate_unit && formData.rate_unit.length > 255) {
      newErrors.rate_unit = "Rate unit must not exceed 255 characters";
      isValid = false;
    }

    if (formData.duration_limit && formData.duration_limit.length > 255) {
      newErrors.duration_limit = "Duration limit must not exceed 255 characters";
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
        ad_type: formData.ad_type || null,
        ad_unit: formData.ad_unit || null,
        dimensions: formData.dimensions || null,
        device: formData.device || null,
        platform: formData.platform || null,
        placement_type: formData.placement_type || null,
        rate: formData.rate || null,
        rate_unit: formData.rate_unit || null,
        duration_limit: formData.duration_limit || null,
        available: Number(formData.available)
      };

      const response = await axiosInstance.put(`/api/ad-slots/${adslotId}`, payload); // Updated to adslotId
      if (response.status === 200) {
        toast.success(response.data.message || "Ad slot updated successfully");
        setTimeout(() => navigate("/ad-slots"), 3000);
      }
    } catch (error) {
      const errorResponse = error.response?.data;
      if (errorResponse?.errors) {
        setErrors(prev => ({ ...prev, ...errorResponse.errors }));
      }
      const errorMessage = errorResponse?.message || "Failed to update ad slot";
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
        <h2 className="text-lg mb-6">Edit Ad Slot</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="ad_type" className="block text-sm font-medium text-gray-700">Ad Type</label>
            <input
              type="text"
              name="ad_type"
              value={formData.ad_type}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.ad_type ? 'border-red-500' : 'border-gray-300'}`}
              maxLength={255}
            />
            {errors.ad_type && <p className="mt-1 text-sm text-red-500">{errors.ad_type}</p>}
          </div>

          <div>
            <label htmlFor="ad_unit" className="block text-sm font-medium text-gray-700">Ad Unit</label>
            <input
              type="text"
              name="ad_unit"
              value={formData.ad_unit}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.ad_unit ? 'border-red-500' : 'border-gray-300'}`}
              maxLength={255}
            />
            {errors.ad_unit && <p className="mt-1 text-sm text-red-500">{errors.ad_unit}</p>}
          </div>

          <div>
            <label htmlFor="dimensions" className="block text-sm font-medium text-gray-700">Dimensions</label>
            <input
              type="text"
              name="dimensions"
              value={formData.dimensions}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.dimensions ? 'border-red-500' : 'border-gray-300'}`}
              maxLength={50}
            />
            {errors.dimensions && <p className="mt-1 text-sm text-red-500">{errors.dimensions}</p>}
          </div>

          <div>
            <label htmlFor="device" className="block text-sm font-medium text-gray-700">Device</label>
            <input
              type="text"
              name="device"
              value={formData.device}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.device ? 'border-red-500' : 'border-gray-300'}`}
              maxLength={255}
            />
            {errors.device && <p className="mt-1 text-sm text-red-500">{errors.device}</p>}
          </div>

          <div>
            <label htmlFor="platform" className="block text-sm font-medium text-gray-700">Platform</label>
            <input
              type="text"
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.platform ? 'border-red-500' : 'border-gray-300'}`}
              maxLength={255}
            />
            {errors.platform && <p className="mt-1 text-sm text-red-500">{errors.platform}</p>}
          </div>

          <div>
            <label htmlFor="placement_type" className="block text-sm font-medium text-gray-700">Placement Type</label>
            <input
              type="text"
              name="placement_type"
              value={formData.placement_type}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.placement_type ? 'border-red-500' : 'border-gray-300'}`}
              maxLength={255}
            />
            {errors.placement_type && <p className="mt-1 text-sm text-red-500">{errors.placement_type}</p>}
          </div>

          <div>
            <label htmlFor="rate" className="block text-sm font-medium text-gray-700">Rate</label>
            <input
              type="number"
              name="rate"
              value={formData.rate}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.rate ? 'border-red-500' : 'border-gray-300'}`}
              step="0.01"
              min="0"
            />
            {errors.rate && <p className="mt-1 text-sm text-red-500">{errors.rate}</p>}
          </div>

          <div>
            <label htmlFor="rate_unit" className="block text-sm font-medium text-gray-700">Rate Unit</label>
            <input
              type="text"
              name="rate_unit"
              value={formData.rate_unit}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.rate_unit ? 'border-red-500' : 'border-gray-300'}`}
              maxLength={255}
            />
            {errors.rate_unit && <p className="mt-1 text-sm text-red-500">{errors.rate_unit}</p>}
          </div>

          <div>
            <label htmlFor="duration_limit" className="block text-sm font-medium text-gray-700">Duration Limit</label>
            <input
              type="text"
              name="duration_limit"
              value={formData.duration_limit}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.duration_limit ? 'border-red-500' : 'border-gray-300'}`}
              maxLength={255}
            />
            {errors.duration_limit && <p className="mt-1 text-sm text-red-500">{errors.duration_limit}</p>}
          </div>

          <div>
            <label htmlFor="available" className="block text-sm font-medium text-gray-700">Availability</label>
            <select
              name="available"
              value={formData.available}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.available ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value={1}>Available</option>
              <option value={0}>Not Available</option>
            </select>
            {errors.available && <p className="mt-1 text-sm text-red-500">{errors.available}</p>}
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
            <a href={formData.image} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              {formData.image ? "View Current Image" : "No Image"}
            </a>
            <p className="mt-1 text-sm text-gray-500">Image updates are not supported in this form.</p>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/ad-slots")}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? "Updating..." : "Update Ad Slot"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}