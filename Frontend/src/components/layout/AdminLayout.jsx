import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
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
  const sidebarRef = useRef(null);

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
    { path: "/admin/contacts", name: "Contacts", icon: "✉️", dropdown: false },
    { path: "/admin/settings", name: "Settings", icon: "⚙️", dropdown: false },
  ];

  const isProductsRoute = location.pathname.includes('/admin/products') || location.pathname.includes('/admin/categories');

  useEffect(() => {
    if (isProductsRoute) {
      setOpenDropdown('Products');
    }
  }, [location.pathname]);

  const toggleDropdown = (dropdownName) => {
    if (openDropdown === dropdownName) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(dropdownName);
    }
  };

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
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

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-12 w-12 border-t-2 border-teal-500 animate-pulse opacity-50"></div>
          </div>
          <p className="mt-4 text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-900">
      {/* Sidebar */}
      <aside 
        ref={sidebarRef}
        className={`sidebar-container ${isSidebarOpen ? "w-64" : "w-20"} bg-gradient-to-b from-slate-800 to-slate-900 text-white transition-all duration-300 shadow-2xl fixed h-full z-20 border-r border-slate-700 flex flex-col`}
      >
        {/* Sidebar Header - Fixed at top */}
        <div className="flex-shrink-0 p-4 border-b border-slate-700 flex items-center justify-between">
          {isSidebarOpen && (
            <div className="flex items-center gap-2">
              <span className="text-2xl">🛒</span>
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                MeroGadget
              </h2>
            </div>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            {isSidebarOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Navigation Container - Scrollable */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = !item.dropdown && location.pathname === item.path;
              const isDropdownOpen = openDropdown === item.name;
              const isAnyDropdownActive = item.dropdown && item.dropdownItems.some(
                subItem => location.pathname === subItem.path
              );

              return (
                <div key={item.name} className="w-full">
                  {item.dropdown ? (
                    <div className="w-full">
                      {/* Dropdown Button */}
                      <button
                        onClick={() => toggleDropdown(item.name)}
                        className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                          isAnyDropdownActive
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl flex-shrink-0">{item.icon}</span>
                          {isSidebarOpen && <span className="font-medium truncate">{item.name}</span>}
                        </div>
                        {isSidebarOpen && (
                          <svg
                            className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                      </button>

                      {/* Dropdown Items - Proper spacing */}
                      {isSidebarOpen && (isDropdownOpen || isAnyDropdownActive) && (
                        <div className="ml-4 mt-2 space-y-1 border-l-2 border-blue-500 pl-3">
                          {item.dropdownItems.map((subItem) => (
                            <Link
                              key={subItem.path}
                              to={subItem.path}
                              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                                location.pathname === subItem.path
                                  ? 'bg-blue-600 text-white'
                                  : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                              }`}
                            >
                              <span className="text-base flex-shrink-0">{subItem.icon}</span>
                              <span className="text-sm truncate">{subItem.name}</span>
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Tooltip for collapsed sidebar */}
                      {!isSidebarOpen && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none border border-slate-700 shadow-lg">
                          {item.name}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative group w-full">
                      <Link
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 w-full ${
                          isActive
                            ? "bg-blue-600 text-white shadow-lg"
                            : "text-slate-300 hover:bg-slate-700 hover:text-white"
                        }`}
                      >
                        <span className="text-xl flex-shrink-0">{item.icon}</span>
                        {isSidebarOpen && <span className="font-medium truncate">{item.name}</span>}
                      </Link>
                      {!isSidebarOpen && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none border border-slate-700 shadow-lg">
                          {item.name}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer - Fixed at bottom */}
        <div className="flex-shrink-0 w-full p-4 border-t border-slate-700 bg-gradient-to-t from-slate-800 to-transparent">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-700 transition-colors text-slate-300 hover:text-white"
          >
            <span className="text-xl flex-shrink-0">🚪</span>
            {isSidebarOpen && <span className="font-medium truncate">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        {/* Top Navbar */}
        <header className="bg-slate-800 shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-10 border-b border-slate-700">
          <div className="flex items-center gap-2">
            {/* Optional: Add breadcrumb or welcome message here */}
          </div>

          <div className="flex items-center gap-2">
            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center text-white font-semibold shadow-md">
                  {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'A'}
                </div>
                <span className="hidden md:block text-sm font-medium text-slate-300">
                  {user?.name?.split(' ')[0] || user?.email?.split('@')[0]}
                </span>
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-slate-800 rounded-xl shadow-xl border border-slate-700 py-1 z-20">
                    <div className="px-4 py-3 border-b border-slate-700">
                      <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                    </div>
                    <Link
                      to="/admin/profile"
                      className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <span className="inline mr-2">👤</span>
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700 transition-colors"
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
        
        /* Custom scrollbar for sidebar */
        .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #1e293b;
          border-radius: 4px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 4px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
    </div>
  );
}

export default AdminLayout;