import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

import { useState, useEffect, useRef, useCallback } from "react";

import { motion, AnimatePresence } from "framer-motion";

import {
  Maximize2,
  Minimize2,
  Menu,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Package,
  List,
  PlusCircle,
  Tags,
  ShoppingCart,
  Users,
  Mail,
  Settings,
  Lock,
  ShieldCheck,
} from "lucide-react";

import axios from "axios";

import { useAuth } from "../../context/AuthContext";

import { useToast } from "../../context/ToastContext";

import Modal from "../Modal";

import { formatSystemTime, formatSystemDate, formatRelativeLogin } from "../../utils/helpers";



const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";



const easeSmooth = [0.4, 0, 0.2, 1];



const pageVariants = {

  initial: { opacity: 0, y: 12 },

  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: easeSmooth } },

  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: easeSmooth } },

};



const dropdownVariants = {

  closed: { height: 0, opacity: 0, transition: { duration: 0.25, ease: easeSmooth } },

  open: { height: "auto", opacity: 1, transition: { duration: 0.3, ease: easeSmooth } },

};



const menuVariants = {

  hidden: { opacity: 0, scale: 0.95, y: -8 },

  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2, ease: easeSmooth } },

  exit: { opacity: 0, scale: 0.95, y: -8, transition: { duration: 0.15 } },

};



const NavIcon = ({ icon: Icon, className = "w-5 h-5" }) => (
  <Icon className={`${className} flex-shrink-0 opacity-90`} strokeWidth={2} aria-hidden="true" />
);



function AdminLayout() {

  const location = useLocation();

  const navigate = useNavigate();

  const { user, logout, isAuthenticated, token } = useAuth();

  const { success, error: toastError } = useToast();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [openDropdown, setOpenDropdown] = useState(null);

  const [now, setNow] = useState(() => new Date());

  const [lastLogin, setLastLogin] = useState(user?.lastLogin || null);

  const [isFullscreen, setIsFullscreen] = useState(false);

  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const sidebarRef = useRef(null);



  const navItems = [

    { path: "/admin", name: "Dashboard", icon: LayoutDashboard, dropdown: false },

    {

      path: "#",

      name: "Products",

      icon: Package,

      dropdown: true,

      dropdownItems: [

        { path: "/admin/products", name: "All Products", icon: List },

        { path: "/admin/products/create", name: "Create Product", icon: PlusCircle },

        { path: "/admin/categories", name: "Categories", icon: Tags }

      ]

    },

    { path: "/admin/orders", name: "Orders", icon: ShoppingCart, dropdown: false },

    { path: "/admin/users", name: "Users", icon: Users, dropdown: false },

    { path: "/admin/contacts", name: "Contacts", icon: Mail, dropdown: false },

    {

      path: "#",

      name: "Settings",

      icon: Settings,

      dropdown: true,

      dropdownItems: [

        { path: "/admin/settings", name: "Security", icon: Lock },

        { path: "/admin/settings/roles", name: "Role Management", icon: ShieldCheck }

      ]

    },

  ];



  const isProductsRoute = location.pathname.includes('/admin/products') || location.pathname.includes('/admin/categories');

  const isSettingsRoute = location.pathname.startsWith('/admin/settings');



  useEffect(() => {

    if (isProductsRoute) setOpenDropdown('Products');

    if (isSettingsRoute) setOpenDropdown('Settings');

  }, [location.pathname, isProductsRoute, isSettingsRoute]);



  useEffect(() => {

    const timer = setInterval(() => setNow(new Date()), 1000);

    return () => clearInterval(timer);

  }, []);



  useEffect(() => {

    if (user?.lastLogin) setLastLogin(user.lastLogin);

  }, [user?.lastLogin]);



  useEffect(() => {

    if (!token || user?.lastLogin) return;



    const fetchLastLogin = async () => {

      try {

        const { data } = await axios.get(`${API_URL}/auth/me`, {

          headers: { Authorization: `Bearer ${token}` },

        });

        if (data?.user?.lastLogin) {

          setLastLogin(data.user.lastLogin);

          const stored = localStorage.getItem("user");

          if (stored) {

            const parsed = JSON.parse(stored);

            localStorage.setItem("user", JSON.stringify({ ...parsed, lastLogin: data.user.lastLogin }));

          }

        }

      } catch {

        // keep fallback display

      }

    };



    fetchLastLogin();

  }, [token, user?.lastLogin]);



  useEffect(() => {

    const onFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);

    document.addEventListener("fullscreenchange", onFullscreenChange);

    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);

  }, []);



  const toggleFullscreen = useCallback(async () => {

    try {

      if (!document.fullscreenElement) {

        await document.documentElement.requestFullscreen();

      } else {

        await document.exitFullscreen();

      }

    } catch {

      toastError("Fullscreen is not supported in this browser");

    }

  }, [toastError]);



  const toggleDropdown = (dropdownName) => {

    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);

  };



  useEffect(() => {

    if (!isAuthenticated) {

      toastError("Please login to access admin panel");

      navigate('/admin/login');

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

        if (!isProductsRoute && !isSettingsRoute) setOpenDropdown(null);

      }

    };

    document.addEventListener('click', handleClickOutside);

    return () => document.removeEventListener('click', handleClickOutside);

  }, [isProductsRoute, isSettingsRoute]);



  useEffect(() => {

    setIsProfileOpen(false);

  }, [location.pathname]);



  const openLogoutConfirm = () => {
    setIsProfileOpen(false);
    setLogoutModalOpen(true);
  };

  const handleConfirmLogout = async () => {
    try {
      await logout();
      success("Logged out successfully");
      setLogoutModalOpen(false);
      navigate('/admin/login');
    } catch {
      toastError("Logout failed");
    }
  };



  if (!user || user.role !== 'admin') {

    return (

      <div className="flex min-h-screen items-center justify-center bg-surface-primary">

        <motion.div

          initial={{ opacity: 0, scale: 0.9 }}

          animate={{ opacity: 1, scale: 1 }}

          transition={{ duration: 0.4, ease: easeSmooth }}

          className="text-center"

        >

          <div className="w-12 h-12 border-2 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-text-muted">Loading...</p>

        </motion.div>

      </div>

    );

  }



  const navBtnClass = (active) =>

    `w-full flex items-center gap-3 py-3 rounded-xl transition-all duration-300 ease-out ${

      isSidebarOpen ? 'px-4' : 'px-0 justify-center'

    } ${

      active

        ? 'bg-white/20 text-white shadow-soft backdrop-blur-sm'

        : 'text-white/80 hover:bg-white/10 hover:text-white hover:translate-x-0.5'

    }`;



  return (

    <div className="flex min-h-screen bg-surface-primary overflow-hidden">

      <motion.aside

        ref={sidebarRef}

        initial={false}

        animate={{ width: isSidebarOpen ? 256 : 80 }}

        transition={{ duration: 0.35, ease: easeSmooth }}

        className="bg-gradient-sidebar text-white shadow-card fixed h-full z-20 flex flex-col overflow-hidden"

      >

        <div className="flex-shrink-0 p-4 border-b border-white/20 flex items-center justify-center min-h-[72px]">

          <AnimatePresence mode="wait">

            {isSidebarOpen ? (

              <motion.div

                key="brand-open"

                initial={{ opacity: 0, x: -12 }}

                animate={{ opacity: 1, x: 0 }}

                exit={{ opacity: 0, x: -12 }}

                transition={{ duration: 0.25 }}

                className="flex items-center gap-2 overflow-hidden w-full"

              >

                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-sm font-bold shrink-0">MG</div>

                <h2 className="text-lg font-bold text-white whitespace-nowrap">MeroGadget</h2>

              </motion.div>

            ) : (

              <motion.div

                key="brand-closed"

                initial={{ opacity: 0, scale: 0.8 }}

                animate={{ opacity: 1, scale: 1 }}

                exit={{ opacity: 0, scale: 0.8 }}

                transition={{ duration: 0.2 }}

                className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-sm font-bold"

              >

                MG

              </motion.div>

            )}

          </AnimatePresence>

        </div>



        <div className="flex-1 overflow-y-auto overflow-x-hidden admin-sidebar-scroll">

          <nav className="p-4 space-y-1.5">

            {navItems.map((item, index) => {

              const isActive = !item.dropdown && location.pathname === item.path;

              const isAnyDropdownActive = item.dropdown && item.dropdownItems.some(sub => location.pathname === sub.path);

              const isDropdownOpen = openDropdown === item.name;



              return (

                <motion.div

                  key={item.name}

                  initial={{ opacity: 0, x: -16 }}

                  animate={{ opacity: 1, x: 0 }}

                  transition={{ delay: index * 0.04, duration: 0.3, ease: easeSmooth }}

                  className="w-full"

                >

                  {item.dropdown ? (

                    <div className="w-full">

                      <motion.button

                        whileTap={{ scale: 0.98 }}

                        onClick={() => toggleDropdown(item.name)}

                        className={`w-full flex items-center rounded-xl transition-all duration-300 ${

                          isSidebarOpen ? 'justify-between gap-3 px-4 py-3' : 'justify-center px-0 py-3'

                        } ${

                          isAnyDropdownActive ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'

                        }`}

                      >

                        <div className="flex items-center gap-3 min-w-0">

                          <NavIcon icon={item.icon} />

                          <AnimatePresence>

                            {isSidebarOpen && (

                              <motion.span

                                initial={{ opacity: 0, width: 0 }}

                                animate={{ opacity: 1, width: "auto" }}

                                exit={{ opacity: 0, width: 0 }}

                                transition={{ duration: 0.2 }}

                                className="font-medium truncate overflow-hidden whitespace-nowrap"

                              >

                                {item.name}

                              </motion.span>

                            )}

                          </AnimatePresence>

                        </div>

                        {isSidebarOpen && (

                          <motion.span

                            animate={{ rotate: isDropdownOpen ? 180 : 0 }}

                            transition={{ duration: 0.3, ease: easeSmooth }}

                            className="flex-shrink-0"

                          >

                            <ChevronDown className="w-4 h-4" />

                          </motion.span>

                        )}

                      </motion.button>

                      <AnimatePresence initial={false}>

                        {isSidebarOpen && (isDropdownOpen || isAnyDropdownActive) && (

                          <motion.div

                            variants={dropdownVariants}

                            initial="closed"

                            animate="open"

                            exit="closed"

                            className="overflow-hidden"

                          >

                            <div className="ml-4 mt-1.5 space-y-1 border-l-2 border-white/30 pl-3 pb-1">

                              {item.dropdownItems.map((subItem) => (

                                <Link

                                  key={subItem.path}

                                  to={subItem.path}

                                  className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 ${

                                    location.pathname === subItem.path

                                      ? 'bg-white/20 text-white'

                                      : 'text-white/70 hover:bg-white/10 hover:text-white hover:pl-5'

                                  }`}

                                >

                                  <NavIcon icon={subItem.icon} className="w-4 h-4" />

                                  <span className="text-sm truncate">{subItem.name}</span>

                                </Link>

                              ))}

                            </div>

                          </motion.div>

                        )}

                      </AnimatePresence>

                    </div>

                  ) : (

                    <Link to={item.path} className={navBtnClass(isActive)}>

                      <NavIcon icon={item.icon} />

                      <AnimatePresence>

                        {isSidebarOpen && (

                          <motion.span

                            initial={{ opacity: 0 }}

                            animate={{ opacity: 1 }}

                            exit={{ opacity: 0 }}

                            transition={{ duration: 0.2 }}

                            className="font-medium truncate"

                          >

                            {item.name}

                          </motion.span>

                        )}

                      </AnimatePresence>

                    </Link>

                  )}

                </motion.div>

              );

            })}

          </nav>

        </div>



        <div className="flex-shrink-0 w-full p-4 border-t border-white/20">

          <motion.button

            whileHover={{ scale: 1.02 }}

            whileTap={{ scale: 0.98 }}

            onClick={openLogoutConfirm}

            className={`w-full flex items-center gap-3 py-3 rounded-xl hover:bg-white/10 transition-all duration-300 text-white/80 hover:text-white ${

              isSidebarOpen ? 'px-4' : 'px-0 justify-center'

            }`}

          >

            <LogOut className="w-5 h-5 flex-shrink-0" />

            <AnimatePresence>

              {isSidebarOpen && (

                <motion.span

                  initial={{ opacity: 0 }}

                  animate={{ opacity: 1 }}

                  exit={{ opacity: 0 }}

                  className="font-medium truncate"

                >

                  Logout

                </motion.span>

              )}

            </AnimatePresence>

          </motion.button>

        </div>

      </motion.aside>



      <motion.div

        initial={false}

        animate={{ marginLeft: isSidebarOpen ? 256 : 80 }}

        transition={{ duration: 0.35, ease: easeSmooth }}

        className="flex-1 flex flex-col min-h-screen w-full"

      >

        <header className="bg-white/90 backdrop-blur-md px-6 py-4 flex justify-between items-center sticky top-0 z-10 border-b border-divider shadow-soft transition-shadow duration-300">

          <motion.button

            type="button"

            whileHover={{ scale: 1.05 }}

            whileTap={{ scale: 0.95 }}

            onClick={() => setIsSidebarOpen((open) => !open)}

            className="p-2.5 rounded-xl text-text-secondary hover:text-brand-orange hover:bg-brand-light transition-colors duration-300"

            aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}

            title={isSidebarOpen ? "Show icons only" : "Show full menu"}

          >

            <Menu className="w-5 h-5" strokeWidth={2.25} />

          </motion.button>



          <div className="flex items-center gap-3 sm:gap-4">

            <motion.div

              initial={{ opacity: 0 }}

              animate={{ opacity: 1 }}

              transition={{ delay: 0.1 }}

              className="hidden sm:block text-right leading-tight"

            >

              <p className="text-sm font-semibold text-text-primary tabular-nums transition-all duration-300">

                {formatSystemTime(now)}

              </p>

              <p className="text-xs text-text-muted">{formatSystemDate(now)}</p>

            </motion.div>



            <div className="hidden md:block text-right leading-tight border-l border-divider pl-4">

              <p className="text-[11px] uppercase tracking-wide text-text-muted">Last login</p>

              <p className="text-sm font-medium text-text-secondary tabular-nums transition-all duration-300">

                {formatRelativeLogin(lastLogin, now)}

              </p>

            </div>



            <motion.button

              type="button"

              whileHover={{ scale: 1.08 }}

              whileTap={{ scale: 0.92 }}

              onClick={toggleFullscreen}

              className="p-2 rounded-xl text-text-muted hover:text-brand-orange hover:bg-brand-light transition-colors duration-300"

              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}

              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}

            >

              <AnimatePresence mode="wait" initial={false}>

                <motion.span

                  key={isFullscreen ? "min" : "max"}

                  initial={{ opacity: 0, rotate: -90, scale: 0.8 }}

                  animate={{ opacity: 1, rotate: 0, scale: 1 }}

                  exit={{ opacity: 0, rotate: 90, scale: 0.8 }}

                  transition={{ duration: 0.2 }}

                  className="block"

                >

                  {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}

                </motion.span>

              </AnimatePresence>

            </motion.button>



            <div className="relative border-l border-divider pl-3 sm:pl-4">

              <motion.button

                whileHover={{ scale: 1.02 }}

                whileTap={{ scale: 0.98 }}

                onClick={() => setIsProfileOpen(!isProfileOpen)}

                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-brand-light transition-colors duration-300"

              >

                <div className="w-8 h-8 rounded-full bg-gradient-cta flex items-center justify-center text-white font-semibold text-sm shadow-glow-orange">

                  {user?.name?.charAt(0).toUpperCase() || 'A'}

                </div>

                <span className="hidden md:block text-sm font-medium text-text-primary">

                  {user?.name?.split(' ')[0] || user?.email?.split('@')[0]}

                </span>

              </motion.button>

              <AnimatePresence>

                {isProfileOpen && (

                  <>

                    <motion.div

                      initial={{ opacity: 0 }}

                      animate={{ opacity: 1 }}

                      exit={{ opacity: 0 }}

                      transition={{ duration: 0.2 }}

                      className="fixed inset-0 z-10"

                      onClick={() => setIsProfileOpen(false)}

                    />

                    <motion.div

                      variants={menuVariants}

                      initial="hidden"

                      animate="visible"

                      exit="exit"

                      className="absolute right-0 mt-2 w-56 card-premium py-1 z-20 origin-top-right shadow-card-hover"

                    >

                      <div className="px-4 py-3 border-b border-divider">

                        <p className="text-sm font-medium text-text-primary truncate">{user?.name}</p>

                        <p className="text-xs text-text-muted truncate">{user?.email}</p>

                      </div>

                      <Link

                        to="/admin/profile"

                        className="block px-4 py-2.5 text-sm text-text-secondary hover:bg-brand-light transition-colors duration-200"

                        onClick={() => setIsProfileOpen(false)}

                      >

                        Profile Settings

                      </Link>

                      <button

                        onClick={openLogoutConfirm}

                        className="w-full text-left px-4 py-2.5 text-sm text-status-error hover:bg-red-50 transition-colors duration-200"

                      >

                        Logout

                      </button>

                    </motion.div>

                  </>

                )}

              </AnimatePresence>

            </div>

          </div>

        </header>



        <main className="flex-1 p-6 overflow-auto bg-surface-primary">

          <AnimatePresence mode="wait">

            <motion.div

              key={location.pathname}

              variants={pageVariants}

              initial="initial"

              animate="animate"

              exit="exit"

            >

              <Outlet />

            </motion.div>

          </AnimatePresence>

        </main>

      </motion.div>

      <Modal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out of the admin panel?"
        confirmText="Log Out"
        cancelText="Stay Signed In"
        type="danger"
      />
    </div>

  );

}



export default AdminLayout;

