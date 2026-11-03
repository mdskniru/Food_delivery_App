import { useEffect } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import EmptyState from './components/EmptyState';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import MyOrders from './pages/MyOrders';
import RestaurantLogin from './pages/RestaurantLogin';
import RestaurantSignup from './pages/RestaurantSignup';
import RestaurantDashboard from './pages/RestaurantDashboard';
import RiderLogin from './pages/RiderLogin';
import RiderSignup from './pages/RiderSignup';
import RiderDashboard from './pages/RiderDashboard';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function NotFound() {
  return (
    <div className="container-page py-14">
      <EmptyState
        emoji="🍽️"
        title="Page not found"
        description="That page may have been eaten. Let's get you back to the food."
        action={
          <Link to="/" className="btn-primary">
            Back to menu
          </Link>
        }
      />
    </div>
  );
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute role="customer">
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-success/:id"
            element={
              <ProtectedRoute role="customer">
                <OrderSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-orders"
            element={
              <ProtectedRoute role="customer">
                <MyOrders />
              </ProtectedRoute>
            }
          />
          <Route path="/restaurant/signup" element={<RestaurantSignup />} />
          <Route path="/restaurant/login" element={<RestaurantLogin />} />
          <Route
            path="/restaurant/dashboard"
            element={
              <ProtectedRoute role="restaurant">
                <RestaurantDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/rider/signup" element={<RiderSignup />} />
          <Route path="/rider/login" element={<RiderLogin />} />
          <Route
            path="/rider/dashboard"
            element={
              <ProtectedRoute role="rider">
                <RiderDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
