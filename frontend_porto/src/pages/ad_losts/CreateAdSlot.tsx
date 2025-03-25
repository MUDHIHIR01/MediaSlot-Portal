import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import axiosInstance from "../../axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreateAdSlot() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ad_type: '',
    ad_unit: '',
    dimensions: '',
    device: '',
    platform: '',
    placement_type: '',
    rate: '',
    rate_unit: '',
    duration_limit: '',
    image: null
  });
  const [errors, setErrors] = useState({
    ad_type: '',
    ad_unit: '',
    dimensions: '',
    device: '',
    platform: '',
    placement_type: '',
    rate: '',
    rate_unit: '',
    duration_limit: '',
    image: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      ad_type: '',
      ad_unit: '',
      dimensions: '',
      device: '',
      platform: '',
      placement_type: '',
      rate: '',
      rate_unit: '',
      duration_limit: '',
      image: ''
    };

    if (!formData.ad_type.trim()) {
      newErrors.ad_type = 'Ad type is required';
      isValid = false;
    }
    if (!formData.ad_unit.trim()) {
      newErrors.ad_unit = 'Ad unit is required';
      isValid = false;
    }
    if (!formData.dimensions.trim()) {
      newErrors.dimensions = 'Dimensions are required';
      isValid = false;
    }
    if (!formData.device.trim()) {
      newErrors.device = 'Device is required';
      isValid = false;
    }
    if (!formData.platform.trim()) {
      newErrors.platform = 'Platform is required';
      isValid = false;
    }
    if (!formData.placement_type.trim()) {
      newErrors.placement_type = 'Placement type is required';
      isValid = false;
    }
    if (!formData.rate.trim()) {
      newErrors.rate = 'Rate is required';
      isValid = false;
    }
    if (!formData.rate_unit.trim()) {
      newErrors.rate_unit = 'Rate unit is required';
      isValid = false;
    }
    if (!formData.image) {
      newErrors.image = 'Image is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const minLoadingTime = new Promise(resolve => setTimeout(resolve, 3000));
    
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      const apiCall = axiosInstance.post('/api/ad-slots', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const [response] = await Promise.all([apiCall, minLoadingTime]);

      if (response.status === 201 || response.status === 200) {
        toast.success(response.data.message || 'Ad slot created successfully', {
          position: "top-right"
        });
        setTimeout(() => {
          navigate('/ad-slots');
        }, 3000);
      }
    } catch (error) {
      const errorResponse = error.response?.data;
      if (errorResponse?.errors) {
        setErrors(prev => ({
          ...prev,
          ...errorResponse.errors
        }));
      }
      const errorMessage = errorResponse?.message || 'Failed to create ad slot';
      toast.error(errorMessage, {
        position: "top-right"
      });
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
      <div className="border border-gray-200 dark:border-gray-800 w-full lg:p-6 bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg text-gray-800">Create New Ad Slot</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="ad_type" className="block text-sm font-medium text-gray-700">Ad Type *</label>
            <input 
              type="text" 
              id="ad_type" 
              name="ad_type" 
              value={formData.ad_type} 
              onChange={handleChange} 
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.ad_type ? 'border-red-500' : ''}`} 
              placeholder="e.g. Standard Banner, High-Impact Ad, Special Execution" 
              maxLength={255}
            />
            {errors.ad_type && <p className="mt-1 text-sm text-red-500">{errors.ad_type}</p>}
          </div>

          <div>
            <label htmlFor="ad_unit" className="block text-sm font-medium text-gray-700">Ad Unit *</label>
            <input 
              type="text" 
              id="ad_unit" 
              name="ad_unit" 
              value={formData.ad_unit} 
              onChange={handleChange} 
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.ad_unit ? 'border-red-500' : ''}`} 
              placeholder="e.g. Leader board, Roadblock, Brand button" 
              maxLength={255}
            />
            {errors.ad_unit && <p className="mt-1 text-sm text-red-500">{errors.ad_unit}</p>}
          </div>

          <div>
            <label htmlFor="dimensions" className="block text-sm font-medium text-gray-700">Dimensions *</label>
            <input 
              type="text" 
              id="dimensions" 
              name="dimensions" 
              value={formData.dimensions} 
              onChange={handleChange} 
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.dimensions ? 'border-red-500' : ''}`} 
              placeholder="e.g. 728x90, 300x250" 
              maxLength={50}
            />
            {errors.dimensions && <p className="mt-1 text-sm text-red-500">{errors.dimensions}</p>}
          </div>

          <div>
            <label htmlFor="device" className="block text-sm font-medium text-gray-700">Device *</label>
            <input 
              type="text" 
              id="device" 
              name="device" 
              value={formData.device} 
              onChange={handleChange} 
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.device ? 'border-red-500' : ''}`} 
              placeholder="e.g. Desktop & Mobile, Desktop Only, Mobile Only" 
              maxLength={255}
            />
            {errors.device && <p className="mt-1 text-sm text-red-500">{errors.device}</p>}
          </div>

          <div>
            <label htmlFor="platform" className="block text-sm font-medium text-gray-700">Platform *</label>
            <input 
              type="text" 
              id="platform" 
              name="platform" 
              value={formData.platform} 
              onChange={handleChange} 
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.platform ? 'border-red-500' : ''}`} 
              placeholder="e.g. Mwananchi, Citizen, MwanaSpot,Instram,Whaatsapp etc" 
              maxLength={255}
            />
            {errors.platform && <p className="mt-1 text-sm text-red-500">{errors.platform}</p>}
          </div>

          <div>
            <label embarrassFor="placement_type" className="block text-sm font-medium text-gray-700">Placement Type *</label>
            <input 
              type="text" 
              id="placement_type" 
              name="placement_type" 
              value={formData.placement_type} 
              onChange={handleChange} 
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.placement_type ? 'border-red-500' : ''}`} 
              placeholder="e.g. RON, MWI MSICZ" 
              maxLength={255}
            />
            {errors.placement_type && <p className="mt-1 text-sm text-red-500">{errors.placement_type}</p>}
          </div>

          <div>
            <label htmlFor="rate" className="block text-sm font-medium text-gray-700">Rate *</label>
            <input 
              type="text" 
              id="rate" 
              name="rate" 
              value={formData.rate} 
              onChange={handleChange} 
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.rate ? 'border-red-500' : ''}`} 
              placeholder="Enter rate amount" 
              maxLength={255}
            />
            {errors.rate && <p className="mt-1 text-sm text-red-500">{errors.rate}</p>}
          </div>

          <div>
            <label htmlFor="rate_unit" className="block text-sm font-medium text-gray-700">Rate Unit *</label>
            <input 
              type="text" 
              id="rate_unit" 
              name="rate_unit" 
              value={formData.rate_unit} 
              onChange={handleChange} 
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.rate_unit ? 'border-red-500' : ''}`} 
              placeholder="e.g. CPM USD, TZS per hour, TZS per day" 
              maxLength={255}
            />
            {errors.rate_unit && <p className="mt-1 text-sm text-red-500">{errors.rate_unit}</p>}
          </div>

          <div>
            <label htmlFor="duration_limit" className="block text-sm font-medium text-gray-700">Duration Limit</label>
            <input 
              type="text" 
              id="duration_limit" 
              name="duration_limit" 
              value={formData.duration_limit} 
              onChange={handleChange} 
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.duration_limit ? 'border-red-500' : ''}`} 
              placeholder="e.g. 24 Hour Maximum, Permanent (optional)" 
              maxLength={255}
            />
            {errors.duration_limit && <p className="mt-1 text-sm text-red-500">{errors.duration_limit}</p>}
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image *</label>
            <input 
              type="file" 
              id="image" 
              name="image" 
              onChange={handleChange} 
              accept="image/jpeg,image/png,image/jpg" 
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.image ? 'border-red-500' : ''}`} 
            />
            {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image}</p>}
          </div>

          <div className="flex justify-end gap-4">
            <button 
              type="button" 
              onClick={() => navigate('/ad-slots')} 
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition shadow-md"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className={`relative px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition shadow-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Loading...</span>
                </div>
              ) : (
                'Create Ad Slot'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}