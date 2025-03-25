import { useState, useEffect } from "react";
import axiosInstance from "../../axios";
import { NavItem } from "./types";
import { DashboardCard } from "./DashboardCard";

export default function AdminDashboard() {
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const adminNavItems: NavItem[] = [
      { title: "Users", count: 1200, icon: "👥", bgColor: "bg-indigo-500" },
      { title: "User Roles", count: 5, icon: "🛡️", bgColor: "bg-blue-500" },
      { title: "Departments", count: 8, icon: "🏢", bgColor: "bg-gray-500" },
      { title: "Requests", count: 120, icon: "🙋", bgColor: "bg-orange-500" },
      { title: "Dispatched Assets", count: 320, icon: "🚚", bgColor: "bg-purple-500" },
      { title: "ReStocked Assets", count: 450, icon: "🔄", bgColor: "bg-cyan-500" },
      { title: "Defective Assets", count: 1100, icon: "⚠️", bgColor: "bg-red-500" },
      { title: "Non-Defective Assets", count: 1100, icon: "✔️", bgColor: "bg-green-500" }
    ];

    const defaultNavItems: NavItem[] = [
      { title: "Assets On-stocks", count: 500, icon: "📦", bgColor: "bg-indigo-500" },
      { title: "Requests", count: 120, icon: "📩", bgColor: "bg-red-500" },
    ];

    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setNavItems(defaultNavItems);
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get("/api/user/profile");
        const userData = response.data;

        if (!userData.role_id) {
          throw new Error("Invalid user data structure");
        }

        const roleIdNumber = Number(userData.role_id);
        setNavItems(roleIdNumber === 1 ? adminNavItems : defaultNavItems);
      } catch (err) {
        setErrorMessage("Unable to load user profile. Please try again later.");
        setNavItems(defaultNavItems);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
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