import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
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

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import CategoriesPage from './pages/admin/CategoriesPage';
import CreateProductPage from './pages/admin/CreateProductPage';
import AdminProfile from './pages/admin/AdminProfile';


function App() {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // If admin is trying to access non-admin routes, redirect to admin panel
  if (user?.role === 'admin' && !isAdminRoute && isAuthenticated && 
      location.pathname !== '/login' && location.pathname !== '/register') {
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
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
  
          <Route path="/profile" element={<ProfilePage />} />
  
        
        {/* Admin Routes - For admin only */}
        <Route path="/admin" element={
          <PrivateRoute adminOnly={true}>
            <AdminLayout />
          </PrivateRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/create" element={<CreateProductPage />} />
          <Route path="products/:id/edit" element={<CreateProductPage />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="profile" element={<AdminProfile />} />

        </Route>
      </Routes>
    </div>
  );
}

export default App;