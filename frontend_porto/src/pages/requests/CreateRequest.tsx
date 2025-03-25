import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axiosInstance from "../../axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreateRequest() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    items: [''],
    item_type: '', // Added item_type
    amount_requested: '',
    department_id: '',
    vender: '',
    vendor_account_number: '',
    vender_account_name: ''
  });
  const [errors, setErrors] = useState({
    items: '',
    item_type: '', // Added item_type
    amount_requested: '',
    department_id: '',
    vender: '',
    vendor_account_number: '',
    vender_account_name: ''
  });
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axiosInstance.get('/api/dropdown/department');
        setDepartments(response.data.departments || []);
      } catch (error) {
        console.error('Error fetching departments:', error);
        toast.error('Failed to load departments', {
          position: "top-right"
        });
      }
    };

    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleItemChange = (index, value) => {
    const newItems = [...formData.items];
    newItems[index] = value;
    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
    
    if (errors.items) {
      setErrors(prev => ({
        ...prev,
        items: ''
      }));
    }
  };

  const addItemField = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, '']
    }));
  };

  const removeItemField = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { 
      items: '',
      item_type: '', // Added item_type
      amount_requested: '',
      department_id: '',
      vender: '',
      vendor_account_number: '',
      vender_account_name: ''
    };

    if (!formData.items.length || formData.items.every(item => !item.trim())) {
      newErrors.items = 'At least one item is required';
      isValid = false;
    }

    if (!formData.item_type.trim()) {
      newErrors.item_type = 'Item type is required';
      isValid = false;
    }

    if (formData.amount_requested && isNaN(formData.amount_requested)) {
      newErrors.amount_requested = 'Amount must be a number';
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
      const requestData = {
        item: formData.items.filter(item => item.trim()),
        item_type: formData.item_type, // Added item_type
        amount_requested: formData.amount_requested || null,
        department_id: formData.department_id || null,
        vender: formData.vender || null,
        vendor_account_number: formData.vendor_account_number || null,
        vender_account_name: formData.vender_account_name || null
      };

      const apiCall = axiosInstance.post('/api/requests', requestData);
      const [response] = await Promise.all([apiCall, minLoadingTime]);

      if (response.status === 201 || response.status === 200) {
        toast.success(response.data.message || 'Request created successfully', {
          position: "top-right"
        });
        setTimeout(() => {
          navigate('/requests');
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
      const errorMessage = errorResponse?.message || 'Failed to create request';
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
          <h2 className="text-lg text-gray-800">Create Request</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Items *
            </label>
            {formData.items.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleItemChange(index, e.target.value)}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    errors.items ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter item description"
                />
                {formData.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItemField(index)}
                    className="px-2 py-1 bg-red-500 text-white rounded-md"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addItemField}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg"
            >
              Add Item
            </button>
            {errors.items && <p className="mt-1 text-sm text-red-500">{errors.items}</p>}
          </div>

          <div>
            <label htmlFor="item_type" className="block text-sm font-medium text-gray-700">
              Item Type *
            </label>
            <input
              type="text"
              id="item_type"
              name="item_type"
              value={formData.item_type}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                errors.item_type ? 'border-red-500' : ''
              }`}
              placeholder="Enter item type"
            />
            {errors.item_type && <p className="mt-1 text-sm text-red-500">{errors.item_type}</p>}
          </div>

          <div>
            <label htmlFor="amount_requested" className="block text-sm font-medium text-gray-700">
              Amount Requested
            </label>
            <input
              type="number"
              id="amount_requested"
              name="amount_requested"
              value={formData.amount_requested}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                errors.amount_requested ? 'border-red-500' : ''
              }`}
              placeholder="Enter amount"
              min="0"
            />
            {errors.amount_requested && <p className="mt-1 text-sm text-red-500">{errors.amount_requested}</p>}
          </div>

          <div>
            <label htmlFor="department_id" className="block text-sm font-medium text-gray-700">
              Department
            </label>
            <select
              id="department_id"
              name="department_id"
              value={formData.department_id}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                errors.department_id ? 'border-red-500' : ''
              }`}
            >
              <option value="">Select a department (optional)</option>
              {departments.map((dept) => (
                <option key={dept.department_id} value={dept.department_id}>
                  {dept.name}
                </option>
              ))}
            </select>
            {errors.department_id && <p className="mt-1 text-sm text-red-500">{errors.department_id}</p>}
          </div>

          <div>
            <label htmlFor="vender" className="block text-sm font-medium text-gray-700">
              Vendor
            </label>
            <input
              type="text"
              id="vender"
              name="vender"
              value={formData.vender}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                errors.vender ? 'border-red-500' : ''
              }`}
              placeholder="Enter vendor name"
            />
            {errors.vender && <p className="mt-1 text-sm text-red-500">{errors.vender}</p>}
          </div>

          <div>
            <label htmlFor="vendor_account_number" className="block text-sm font-medium text-gray-700">
              Vendor Account Number
            </label>
            <input
              type="text"
              id="vendor_account_number"
              name="vendor_account_number"
              value={formData.vendor_account_number}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                errors.vendor_account_number ? 'border-red-500' : ''
              }`}
              placeholder="Enter vendor account number"
            />
            {errors.vendor_account_number && <p className="mt-1 text-sm text-red-500">{errors.vendor_account_number}</p>}
          </div>

          <div>
            <label htmlFor="vender_account_name" className="block text-sm font-medium text-gray-700">
              Vendor Account Name
            </label>
            <input
              type="text"
              id="vender_account_name"
              name="vender_account_name"
              value={formData.vender_account_name}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                errors.vender_account_name ? 'border-red-500' : ''
              }`}
              placeholder="Enter vendor account name"
            />
            {errors.vender_account_name && <p className="mt-1 text-sm text-red-500">{errors.vender_account_name}</p>}
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/my/requests')}
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
                'Create Request'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}