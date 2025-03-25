// src/components/AppSidebar.tsx
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import axiosInstance from "../axios"; 

import {

  ChevronDownIcon,
  HorizontaLDots,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import SidebarWidget from "./SidebarWidget";




type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const getNavItemsForRole = (roleId: number) => {
  console.log('getNavItemsForRole called with roleId:', roleId);
  const baseNavItems: NavItem[] = [
    {
      icon: (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-pink-500 text-white">
          📋
        </span>
      ),
      name: "Dashboard",
      subItems: [{ name: "Go to dashboard", path: "/dashboard" }],
    },
    {
      icon: (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white">
          👤
        </span>
      ),
      name: "User Profile",
      path: "/profile",
    },
    
  ];

  const role1NavItems: NavItem[] = [
    ...baseNavItems,
    {
      name: "UserRoles",
      icon: (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white">
          🛡️
        </span>
      ), // Shield icon for authority/management
      subItems: [{ name: "Manage roles", path: "/user-roles" }],
    },    
    {
      name: "Departments",
      icon: (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-500 text-white">
          🏢
        </span>
      ), // Gray for departments (structural/organizational)
      subItems: [{ name: "Manage departments", path: "/departments" }],
    },
    {
      name: "Users",
      icon: (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500 text-white">
          👥
        </span>
      ), // Indigo for users (community/people)
      subItems: [{ name: "Manage users", path: "/users" }],
    },
    {
      name: "UserLogs",
      icon: (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500 text-white">
          📜
        </span>
      ), // Yellow for logs (visibility/history)
      subItems: [{ name: "View logs", path: "/user-logs" }],
    },
    {
      name: "Requests",
      icon: (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-500 text-white">
          🙋
        </span>
      ), // Orange for requests (attention/action)
      subItems: [{ name: "Approve request", path: "/requests" },
        { name: "Approved requests", path: "/approved-requests" },
      ],
      
    },
    {
      name: "Dispatched-Assets",
      icon: (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-500 text-white">
          🚚
        </span>
      ), // Purple for dispatched (movement/delivery)
      subItems: [{ name: "Manage dispatches", path: "/dispatches" }],
    },
    {
      name: "Restocked-Assets",
      icon: (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500 text-white">
          🔄
        </span>
      ), // Cyan for restocked (refresh/replenishment)
      subItems: [{ name: "View restocked devices", path: "/restocks" }],
    },
  
  ];



  const role2NavItems: NavItem[] = [
    ...baseNavItems,
    {
      name: "Bookings",
      icon: (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-500 text-white">
          📅
        </span>
      ), // Calendar icon for bookings
      subItems: [{ name: "View bookings", path: "/user/bookings" }],
    },
    {
      name: "Invoices",
      icon: (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-500 text-white">
          📄
        </span>
      ), // Document icon for invoices
      subItems: [{ name: "View invoices", path: "/user/invoices" }],
    },
    {
      name: "Payments",
      icon: (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white">
          💳
        </span>
      ), // Credit card icon for payments
      subItems: [{ name: "View payments", path: "/user-restocks" }],
    },
    
  ];



  switch (roleId) {
    case 1:
      console.log('Returning role1NavItems');
      return role1NavItems;
    case 2:
      console.log('Returning role2NavItems');
      return role2NavItems;
    default:
      console.log('Returning baseNavItems');
      return baseNavItems;
  }
};




const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  
  const [navItems, setNavItems] = useState<NavItem[]>(getNavItemsForRole(0));
  const [openSubmenu, setOpenSubmenu] = useState<{ type: "main" | "others"; index: number } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token);

      if (!token) {
        console.log('No token found, setting default navigation');
        setNavItems(getNavItemsForRole(0));
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching profile with axiosInstance');
        const response = await axiosInstance.get('/api/user/profile');
        console.log('Profile response:', response.data);
        const userData = response.data;

        if (!userData.role_id) {
          console.error('No role_id in response data');
          throw new Error('Invalid user data structure');
        }

        const roleIdNumber = Number(userData.role_id);
        console.log('Converted role_id to number:', roleIdNumber);

        setNavItems(getNavItemsForRole(roleIdNumber));
      } catch (err) {
        console.error('Fetch profile error:', err);
        // Your axiosInstance already handles 401 via interceptor, so we just set an error message
        setErrorMessage("Unable to load user profile. Please try again later.");
        setNavItems(getNavItemsForRole(0));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    let submenuMatched = false;
    ["main"].forEach((menuType) => {
      navItems.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({ type: menuType as "main" | "others", index });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive, navItems]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (prevOpenSubmenu && prevOpenSubmenu.type === menuType && prevOpenSubmenu.index === index) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              } shadow-sm hover:shadow-md`}
            >
              <span
                className={`menu-item-icon-size ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType && openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                } shadow-sm hover:shadow-md`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300 shadow-inner"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      } hover:shadow-md`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  if (loading) {
    return (
      <aside className="fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 shadow-lg w-[290px]">
        <div className="py-8 flex justify-start">
          <h1>EAMS</h1>
        </div>
        <div>Loading sidebar...</div>
      </aside>
    );
  }

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 shadow-lg
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/dashboard">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <h1 className="dark:hidden shadow-sm">EAMS</h1>
              <h1 className="hidden dark:block shadow-sm">EAMS</h1>
            </>
          ) : (
            <h1>EAMS</h1>
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        {errorMessage && (
          <div className="text-red-500 p-2 mb-4">{errorMessage}</div>
        )}
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
          </div>
        </nav>
        {isExpanded || isHovered || isMobileOpen ? (
          <div className="shadow-md">
            <SidebarWidget />
          </div>
        ) : null}
      </div>
    </aside>
  );
};

export default AppSidebar;