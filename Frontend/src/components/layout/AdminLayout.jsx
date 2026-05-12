import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { success, error: toastError } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const navItems = [
    { path: "/admin", name: "Dashboard", icon: "📊", dropdown: false },
    {
      path: "#",
      name: "Products",
      icon: "📦",
      dropdown: true,
      dropdownItems: [
        { path: "/admin/products", name: "All Products", icon: "📋" },
        { path: "/admin/products/create", name: "Create Product", icon: "➕" },
        { path: "/admin/categories", name: "Categories", icon: "🏷️" }
      ]
    },
    { path: "/admin/orders", name: "Orders", icon: "🛒", dropdown: false },
    { path: "/admin/users", name: "Users", icon: "👥", dropdown: false },
    { path: "/admin/settings", name: "Settings", icon: "⚙️", dropdown: false },
  ];

  // Check if current path is related to products
  const isProductsRoute = location.pathname.includes('/admin/products') || location.pathname.includes('/admin/categories');

  // Automatically open Products dropdown when on products-related pages
  useEffect(() => {
    if (isProductsRoute) {
      setOpenDropdown('Products');
    }
  }, [location.pathname]);

  // Toggle dropdown
  const toggleDropdown = (dropdownName) => {
    if (openDropdown === dropdownName) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(dropdownName);
    }
  };

  // Check authentication and admin role
  useEffect(() => {
    if (!isAuthenticated) {
      toastError("Please login to access admin panel");
      navigate('/login');
      return;
    }

    if (user && user.role !== 'admin') {
      toastError("Access denied. Admin privileges required.");
      navigate('/');
    }
  }, [isAuthenticated, user, navigate, toastError]);

  // Close dropdown when clicking outside (but not when clicking on sidebar items)
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't close if clicking on sidebar or its children
      if (!event.target.closest('.sidebar-container')) {
        // Don't auto-close on products route
        if (!isProductsRoute) {
          setOpenDropdown(null);
        }
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isProductsRoute]);

  const handleLogout = async () => {
    try {
      await logout();
      success("Logged out successfully");
      setIsProfileOpen(false);
      navigate('/login');
    } catch (error) {
      toastError("Logout failed");
    }
  };

  // If no user or not admin, don't render layout
  if (!user || user.role !== 'admin') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Blue Theme */}
      <aside className={`sidebar-container ${isSidebarOpen ? "w-64" : "w-20"} bg-gradient-to-b from-blue-700 to-blue-900 text-white transition-all duration-300 shadow-2xl fixed h-full z-20`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-blue-600 flex items-center justify-between">
          {isSidebarOpen && (
            <div className="flex items-center gap-2">
              <span className="text-2xl">🛒</span>
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-300 to-white bg-clip-text text-transparent">
                MeroGadget
              </h2>
            </div>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            {isSidebarOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = !item.dropdown && location.pathname === item.path;
            const isDropdownOpen = openDropdown === item.name;
            // Check if any dropdown item is active
            const isAnyDropdownActive = item.dropdown && item.dropdownItems.some(
              subItem => location.pathname === subItem.path
            );

            return (
              <div key={item.name} className="dropdown-container">
                {item.dropdown ? (
                  <>
                    {/* Dropdown Button */}
                    <button
                      onClick={() => toggleDropdown(item.name)}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isAnyDropdownActive
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'text-blue-100 hover:bg-blue-600 hover:text-white'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{item.icon}</span>
                        {isSidebarOpen && <span className="font-medium">{item.name}</span>}
                      </div>
                      {isSidebarOpen && (
                        <svg
                          className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </button>

                    {/* Dropdown Items - Show when open OR when on products page */}
                    {isSidebarOpen && (isDropdownOpen || isAnyDropdownActive) && (
                      <div className="ml-4 mt-1 space-y-1 border-l-2 border-blue-500 pl-3">
                        {item.dropdownItems.map((subItem) => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${location.pathname === subItem.path
                                ? 'bg-blue-600 text-white'
                                : 'text-blue-200 hover:bg-blue-600 hover:text-white'
                              }`}
                          // Removed the onClick that closed the dropdown
                          >
                            <span className="text-base">{subItem.icon}</span>
                            <span className="text-sm">{subItem.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Tooltip for collapsed sidebar */}
                    {!isSidebarOpen && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                        {item.name}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-blue-100 hover:bg-blue-600 hover:text-white"
                      }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    {isSidebarOpen && <span className="font-medium">{item.name}</span>}
                    {!isSidebarOpen && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                        {item.name}
                      </div>
                    )}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 w-full p-4 border-t border-blue-600">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors text-blue-100 hover:text-white"
          >
            <span className="text-xl">🚪</span>
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        {/* Top Navbar */}
        <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-2">
            {/* Welcome message removed as requested */}
          </div>

          <div className="flex items-center gap-2">
            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'A'}
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {user?.name?.split(' ')[0] || user?.email}
                </span>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-20">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link
                      to="/admin/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <span className="inline mr-2">👤</span>
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                      <span className="inline mr-2">🚪</span>
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="animate-fadeIn">
            <Outlet />
          </div>
        </main>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default AdminLayout;