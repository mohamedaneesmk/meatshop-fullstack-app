import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import CartSidebar from './components/cart/CartSidebar';

// Pages
import ShopPage from './pages/shop/ShopPage';
import CheckoutPage from './pages/checkout/CheckoutPage';
import OrderSuccessPage from './pages/order/OrderSuccessPage';
import TrackOrderPage from './pages/order/TrackOrderPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProfilePage from './pages/auth/ProfilePage';

// Layout wrapper for pages with header and footer
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-surface-50 dark:bg-surface-950 text-surface-900 dark:text-white transition-colors">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartSidebar />
    </div>
  );
};

// Admin layout (no footer)
const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-surface-50 dark:bg-surface-950 text-surface-900 dark:text-white transition-colors">
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  );
};

// Auth layout (minimal header)
const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 text-surface-900 dark:text-white transition-colors">
      {children}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <Routes>
              {/* Customer Routes */}
              <Route
                path="/"
                element={
                  <MainLayout>
                    <ShopPage />
                  </MainLayout>
                }
              />
              <Route
                path="/checkout"
                element={
                  <MainLayout>
                    <CheckoutPage />
                  </MainLayout>
                }
              />
              <Route
                path="/order-success/:orderId"
                element={
                  <MainLayout>
                    <OrderSuccessPage />
                  </MainLayout>
                }
              />
              <Route
                path="/track-order"
                element={
                  <MainLayout>
                    <TrackOrderPage />
                  </MainLayout>
                }
              />

              {/* Auth Routes */}
              <Route
                path="/login"
                element={
                  <AuthLayout>
                    <LoginPage />
                  </AuthLayout>
                }
              />
              <Route
                path="/register"
                element={
                  <AuthLayout>
                    <RegisterPage />
                  </AuthLayout>
                }
              />
              <Route
                path="/profile"
                element={
                  <MainLayout>
                    <ProfilePage />
                  </MainLayout>
                }
              />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route
                path="/admin"
                element={
                  <AdminLayout>
                    <AdminDashboardPage />
                  </AdminLayout>
                }
              />
              <Route
                path="/admin/*"
                element={
                  <AdminLayout>
                    <AdminDashboardPage />
                  </AdminLayout>
                }
              />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
