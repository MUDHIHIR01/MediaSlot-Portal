import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import axiosInstance from "../../axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditUser() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    status: "",
    role_id: "",
    department_id: "",
    password: ""
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    status: "",
    role_id: "",
    department_id: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);

  // Fetch user data and dropdown options
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, deptResponse, roleResponse] = await Promise.all([
          axiosInstance.get(`/api/all/users`), // Fetch all users to find the specific one
          axiosInstance.get('/api/dropdown/department'),
          axiosInstance.get('/api/roles/dropdown-options')
        ]);

        const user = userResponse.data.users.find((u: any) => u.user_id === parseInt(userId || ""));
        if (user) {
          setFormData({
            name: user.name,
            email: user.email,
            status: user.status,
            role_id: "", // Will be set from dropdown fetch
            department_id: "", // Will be set from dropdown fetch
            password: ""
          });
        }

        setDepartments(deptResponse.data.departments || []);
        setRoles(roleResponse.data || []);

        // Set role_id and department_id after fetching dropdowns
        if (user) {
          const role = roleResponse.data.find((r: any) => r.category === user.role);
          const dept = deptResponse.data.departments.find((d: any) => d.name === user.department);
          setFormData(prev => ({
            ...prev,
            role_id: role ? role.role_id.toString() : "",
            department_id: dept ? dept.department_id.toString() : ""
          }));
        }
      } catch (error: any) {
        toast.error("Failed to fetch user data or dropdown options");
        navigate("/users");
      }
    };
    fetchData();
  }, [userId, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: "",
      email: "",
      status: "",
      role_id: "",
      department_id: "",
      password: ""
    };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    } else if (formData.name.length > 255) {
      newErrors.name = "Name must not exceed 255 characters";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    } else if (formData.email.length > 255) {
      newErrors.email = "Email must not exceed 255 characters";
      isValid = false;
    }

    if (!formData.status) {
      newErrors.status = "Status is required";
      isValid = false;
    } else if (formData.status.length > 255) {
      newErrors.status = "Status must not exceed 255 characters";
      isValid = false;
    }

    if (!formData.role_id) {
      newErrors.role_id = "Role is required";
      isValid = false;
    }

    if (formData.password && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
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
        name: formData.name,
        email: formData.email,
        status: formData.status,
        role_id: parseInt(formData.role_id),
        department_id: formData.department_id ? parseInt(formData.department_id) : null,
        ...(formData.password && { password: formData.password }) // Only include password if filled
      };

      const response = await axiosInstance.put(`/api/update-user/${userId}`, payload);
      if (response.status === 200) {
        toast.success(response.data.message || "User updated successfully");
        setTimeout(() => navigate("/users"), 3000);
      }
    } catch (error: any) {
      const errorResponse = error.response?.data;
      if (errorResponse?.errors) {
        setErrors(prev => ({ ...prev, ...errorResponse.errors }));
      }
      const errorMessage = errorResponse?.message || "Failed to update user";
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
        <h2 className="text-lg  mb-6">Edit User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              required
              maxLength={255}
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              required
              maxLength={255}
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.status ? 'border-red-500' : 'border-gray-300'}`}
              required
            >
              <option value="">Select status</option>
              <option value="is_active">Is Active</option>
              <option value="not_active">Not Active</option>
            </select>
            {errors.status && <p className="mt-1 text-sm text-red-500">{errors.status}</p>}
          </div>

          <div>
            <label htmlFor="role_id" className="block text-sm font-medium text-gray-700">Role *</label>
            <select
              name="role_id"
              value={formData.role_id}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.role_id ? 'border-red-500' : 'border-gray-300'}`}
              required
            >
              <option value="">Select a role</option>
              {roles.map((role: { role_id: number; category: string }) => (
                <option key={role.role_id} value={role.role_id}>
                  {role.category}
                </option>
              ))}
            </select>
            {errors.role_id && <p className="mt-1 text-sm text-red-500">{errors.role_id}</p>}
          </div>

          <div>
            <label htmlFor="department_id" className="block text-sm font-medium text-gray-700">Department</label>
            <select
              name="department_id"
              value={formData.department_id}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.department_id ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select a department (optional)</option>
              {departments.map((dept: { department_id: number; name: string }) => (
                <option key={dept.department_id} value={dept.department_id}>
                  {dept.name}
                </option>
              ))}
            </select>
            {errors.department_id && <p className="mt-1 text-sm text-red-500">{errors.department_id}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter new password (optional)"
            />
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/users")}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? "Updating..." : "Update User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}