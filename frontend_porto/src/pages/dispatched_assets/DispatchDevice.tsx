import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axiosInstance from "../../axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreateDispatchedAsset() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    request_id: '',
    user_id: ''
  });
  const [errors, setErrors] = useState({
    request_id: '',
    user_id: ''
  });
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const requestsResponse = await axiosInstance.get('/api/dropdown-requests');
        const usersResponse = await axiosInstance.get('/api/users/byname');
        
        setRequests(requestsResponse.data || []);
        setUsers(usersResponse.data.users || []);
        setFilteredRequests(requestsResponse.data || []);
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
        toast.error('Failed to load dropdown options', {
          position: "top-right"
        });
      }
    };

    fetchDropdownData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'user_id' && value) {
      const filtered = requests.filter(request => 
        request.user_id === parseInt(value)
      );
      setFilteredRequests(filtered);
    }

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const parseItemString = (itemString) => {
    try {
      return JSON.parse(itemString).join(', ');
    } catch (e) {
      return itemString;
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      request_id: '',
      user_id: ''
    };

    if (!formData.request_id) {
      newErrors.request_id = 'Request is required';
      isValid = false;
    }

    if (!formData.user_id) {
      newErrors.user_id = 'User is required';
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
      const apiCall = axiosInstance.post('/api/dispatches', {
        request_id: parseInt(formData.request_id),
        user_id: parseInt(formData.user_id)
      });

      const [response] = await Promise.all([apiCall, minLoadingTime]);

      if (response.status === 201) {
        toast.success(response.data.message || 'Dispatched asset created successfully', {
          position: "top-right"
        });
        setTimeout(() => {
          navigate('/dispatches');
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
      const errorMessage = errorResponse?.message || 'Failed to create dispatched asset';
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
        style={{ top: "100px" }}  // Adjusted from 70px to 100px
        closeOnClick
        pauseOnHover
        draggable
        draggablePercent={60}
        hideProgressBar
        closeButton
      />
      <div className="border border-gray-200 dark:border-gray-800 w-full lg:p-6 bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg text-gray-800">Create New Dispatched Asset</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="user_id" className="block text-sm font-medium text-gray-700">
              User *
            </label>
            <select
              id="user_id"
              name="user_id"
              value={formData.user_id}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                errors.user_id ? 'border-red-500' : ''
              }`}
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user.user_id} value={user.user_id}>
                  {user.name}
                </option>
              ))}
            </select>
            {errors.user_id && <p className="mt-1 text-sm text-red-500">{errors.user_id}</p>}
          </div>

          <div>
            <label htmlFor="request_id" className="block text-sm font-medium text-gray-700">
              Item Request *
            </label>
            <select
              id="request_id"
              name="request_id"
              value={formData.request_id}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                errors.request_id ? 'border-red-500' : ''
              }`}
              disabled={!formData.user_id}
            >
              <option value="">Select an item request</option>
              {filteredRequests.map((request) => (
                <option key={request.request_id} value={request.request_id}>
                  {parseItemString(request.item)} - Request #{request.request_id}
                </option>
              ))}
            </select>
            {errors.request_id && <p className="mt-1 text-sm text-red-500">{errors.request_id}</p>}
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/dispatches')}
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
                'Create Dispatch'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}