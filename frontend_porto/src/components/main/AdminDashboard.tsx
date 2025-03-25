import { useState, useEffect } from "react";
import axiosInstance from "../../axios";
import { NavItem } from "./types";
import { DashboardCard } from "./DashboardCard";

interface ApiResponse {
  message?: string;
  total_slots?: number;
  total_bookings?: number;
  total_invoices?: number;
  total_users?: number;
  user_roles?: number;
  error?: string;
}

export default function AdminDashboard() {
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const defaultNavItems: NavItem[] = [
      { title: "Assets On-stocks", count: 500, icon: "📦", bgColor: "bg-indigo-500" },
      { title: "Requests", count: 120, icon: "📩", bgColor: "bg-red-500" },
    ];

    const fetchAdminData = async () => {
      try {
        const [
          slotsResponse,
          bookingsResponse,
          invoicesResponse,
          usersResponse,
          rolesResponse
        ] = await Promise.all([
          axiosInstance.get<ApiResponse>("/api/count/ad-slots"),
          axiosInstance.get<ApiResponse>("/api/count/bookings"),
          axiosInstance.get<ApiResponse>("/api/count/invoices"),
          axiosInstance.get<ApiResponse>("/api/count/users"),
          axiosInstance.get<ApiResponse>("/api/count/roles"),
        ]);

        return [
          { 
            title: "Users", 
            count: usersResponse.data.total_users || 0, 
            icon: "👥", 
            bgColor: "bg-indigo-500" 
          },
          { 
            title: "User Roles", 
            count: rolesResponse.data.user_roles || 0, 
            icon: "🛡️", 
            bgColor: "bg-blue-500" 
          },
          { 
            title: "Ad-slots", 
            count: slotsResponse.data.total_slots || 0, 
            icon: "📢", 
            bgColor: "bg-orange-500" 
          },
          { 
            title: "Bookings", 
            count: bookingsResponse.data.total_bookings || 0, 
            icon: "📅", 
            bgColor: "bg-orange-500" 
          },
          { 
            title: "Invoices", 
            count: invoicesResponse.data.total_invoices || 0, 
            icon: "📄", 
            bgColor: "bg-purple-500" 
          },
          { 
            title: "Payments", 
            count: 450, // Still static as no API provided
            icon: "💳", 
            bgColor: "bg-green-500" 
          }
        ];
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
        throw error;
      }
    };

    const fetchProfileAndData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setNavItems(defaultNavItems);
        setLoading(false);
        return;
      }

      try {
        const [profileResponse, adminData] = await Promise.all([
          axiosInstance.get("/api/user/profile"),
          fetchAdminData()
        ]);

        const userData = profileResponse.data;
        if (!userData.role_id) {
          throw new Error("Invalid user data structure");
        }

        const roleIdNumber = Number(userData.role_id);
        setNavItems(roleIdNumber === 1 ? adminData : defaultNavItems);
      } catch (err) {
        setErrorMessage("Unable to load dashboard data. Please try again later.");
        setNavItems(defaultNavItems);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (errorMessage) return <div className="text-red-500">{errorMessage}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
      {navItems.map((item, index) => (
        <DashboardCard key={index} item={item} />
      ))}
    </div>
  );
}