import { Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import AdminLayout from './components/layout/AdminLayout';
import PrivateRoute from './components/common/PrivateRoute';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import Login from './pages/LoginPage';
import Register from './pages/Register';
import ProfilePage from './pages/ProfilePage';
import ContactPage from './pages/ContactPage';
import ForgotPassword from './pages/ForgotPassword';
import AboutPage from './pages/AboutPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import Footer from './components/layout/Footer';
import MobileBottomNav from './components/layout/MobileBottomNav';

// Admin pages
import AdminContacts from './pages/admin/AdminContacts';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import CategoriesPage from './pages/admin/CategoriesPage';
import CreateProductPage from './pages/admin/CreateProductPage';
import AdminProfile from './pages/admin/AdminProfile';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminSettings from './pages/admin/AdminSettings';
import AdminRoleManagement from './pages/admin/AdminRoleManagement';
import AdminReports from './pages/admin/AdminReports';


function App() {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (user?.role === 'admin' && !isAdminRoute && isAuthenticated && 
    location.pathname !== '/login' && 
    location.pathname !== '/register' &&
    location.pathname !== '/' &&  // Allow home page
    location.pathname !== '/products' &&  // Allow products page
    location.pathname !== '/about' &&  // Allow about page
    location.pathname !== '/contact' &&  // Allow contact page
    !location.pathname.startsWith('/product') // Allow product detail pages
   ) {
  return <Navigate to="/admin" replace />;
}

  return (
    <div>
      {/* Only show Navbar if NOT on admin routes */}
      {!isAdminRoute && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/about" element={<AboutPage />} />


          <Route path="/profile" element={<ProfilePage />} />
        
        {/* Protected Route - User must be logged in */}
        {/* <Route element={<PrivateRoute adminOnly={false} />}>
        </Route> */}

        {/* Admin Routes - For admin only */}
        <Route path="/admin" element={
          <PrivateRoute adminOnly={true}>
            <AdminLayout />
          </PrivateRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/create" element={<CreateProductPage />} />
          <Route path="products/:id/edit" element={<CreateProductPage />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="contacts" element={<AdminContacts />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="settings/roles" element={<AdminRoleManagement />} />
        </Route>
      </Routes>

      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <MobileBottomNav />}
    </div>
  );
}

export default App;