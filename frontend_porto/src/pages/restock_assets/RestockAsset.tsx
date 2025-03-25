import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axiosInstance from "../../axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreateRestockAsset() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    request_id: '',
    user_id: '',
    status: 'restocked',
    is_defective: 'none-defective'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [requestsResponse, usersResponse] = await Promise.all([
          axiosInstance.get('/api/dropdown-requests'),
          axiosInstance.get('/api/users/byname')
        ]);
        
        setRequests(requestsResponse.data || []);
        setUsers(usersResponse.data.users || []);
        setFilteredRequests(requestsResponse.data || []);
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
        toast.error('Failed to load dropdown options');
      }
    };
    
    fetchDropdownData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'user_id') {
      setFilteredRequests(requests.filter(req => req.user_id === parseInt(value)));
      setFormData(prev => ({ ...prev, request_id: '' }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!formData.user_id) {
      newErrors.user_id = 'User is required';
      isValid = false;
    }
    if (!formData.request_id) {
      newErrors.request_id = 'Request is required';
      isValid = false;
    }
    if (!['restocked', 'not-restocked'].includes(formData.status)) {
      newErrors.status = 'Invalid status value';
      isValid = false;
    }
    if (!['none-defective', 'defective'].includes(formData.is_defective)) {
      newErrors.is_defective = 'Invalid defective status value';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const response = await axiosInstance.post('/api/restock-assets', {
        user_id: parseInt(formData.user_id),
        request_id: parseInt(formData.request_id),
        status: formData.status,
        is_defective: formData.is_defective
      });
      toast.success(response.data.message || 'Restock asset created successfully');
      setTimeout(() => navigate('/user-restocks'), 2000);
    } catch (error) {
      const errorData = error.response?.data;
      setErrors(errorData?.errors || {});
      toast.error(errorData?.message || 'Failed to create restock asset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 w-full mx-auto">
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar
        closeOnClick
        pauseOnHover
        limit={1}
        style={{ top: '60px', width: 'auto', maxWidth: '400px' }}
      />
      <div className="border border-gray-200 dark:border-gray-800 w-full lg:p-6 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg text-gray-800 mb-6">Create Restock Asset</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">User *</label>
            <select 
              name="user_id" 
              value={formData.user_id} 
              onChange={handleChange} 
              className="mt-1 block w-full border rounded-md shadow-sm p-2"
            >
              <option value="">Select a user</option>
              {users.map(user => (
                <option key={user.user_id} value={user.user_id}>
                  {user.name}
                </option>
              ))}
            </select>
            {errors.user_id && <p className="text-red-500 text-sm mt-1">{errors.user_id}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Request *</label>
            <select 
              name="request_id" 
              value={formData.request_id} 
              onChange={handleChange} 
              className="mt-1 block w-full border rounded-md shadow-sm p-2"
              disabled={!formData.user_id}
            >
              <option value="">Select a request</option>
              {filteredRequests.map(req => (
                <option key={req.request_id} value={req.request_id}>
                  {req.item} - Request #{req.request_id}
                </option>
              ))}
            </select>
            {errors.request_id && <p className="text-red-500 text-sm mt-1">{errors.request_id}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Status *</label>
            <select 
              name="status" 
              value={formData.status} 
              onChange={handleChange} 
              className="mt-1 block w-full border rounded-md shadow-sm p-2"
            >
              <option value="restocked">Restocked</option>
              <option value="not-restocked">Not Restocked</option>
            </select>
            {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Defective Status *</label>
            <select 
              name="is_defective" 
              value={formData.is_defective} 
              onChange={handleChange} 
              className="mt-1 block w-full border rounded-md shadow-sm p-2"
            >
              <option value="none-defective">None-Defective</option>
              <option value="defective">Defective</option>
            </select>
            {errors.is_defective && <p className="text-red-500 text-sm mt-1">{errors.is_defective}</p>}
          </div>
          
          <div className="flex justify-end gap-4">
            <button 
              type="button" 
              onClick={() => navigate('/user-restocks')} 
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Processing...' : 'Create Restock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}