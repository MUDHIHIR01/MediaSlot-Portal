import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import axiosInstance from "../../axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreateRole() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: '',
    description: ''
  });
  const [errors, setErrors] = useState({
    category: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { category: '', description: '' };

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
      isValid = false;
    } else if (formData.category.length > 255) {
      newErrors.category = 'Category must not exceed 255 characters';
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
    
    // Use Promise to ensure minimum 3-second loading time
    const minLoadingTime = new Promise(resolve => setTimeout(resolve, 3000));
    
    try {
      const apiCall = axiosInstance.post('/api/auth/roles', {
        category: formData.category,
        description: formData.description || null
      });

      // Wait for both API call and minimum 3 seconds
      const [response] = await Promise.all([apiCall, minLoadingTime]);

      if (response.status === 201) {
        toast.success('Role created successfully', {
          position: "top-right"
        });
        setTimeout(() => {
          navigate('/user-roles');
        }, 3000); // 3-second pause after success before redirect
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to create role';
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
        closeOnClick
        pauseOnHover
        draggable
        draggablePercent={60}
        hideProgressBar
        closeButton
      />
      <div className="border border-gray-200 dark:border-gray-800 w-full lg:p-6 bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg  text-gray-800">Create New Role</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category *
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                errors.category ? 'border-red-500' : ''
              }`}
              placeholder="Enter role category"
              maxLength={255}
            />
            {errors.category && (
              <p className="mt-1 text-sm text-red-500">{errors.category}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter role description (optional)"
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/user-roles')}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition shadow-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`relative px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition shadow-md ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
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
                  <span>Loading...</span>
                </div>
              ) : (
                'Create Role'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}