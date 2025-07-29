import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthContext';

import Home from './pages/Home';
import HotelsPage from './features/hotels/pages/HotelsPage';
import HotelDetailsPage from './features/hotels/pages/HotelDetailsPage';
import BookingPage from './features/bookings/pages/BookingPage';
import DashboardPage from './features/user/pages/DashboardPage';
import { AuthButton } from './features/auth/components/AuthButton';
import Navbar from './components/Navbar';
import { RequireAuth } from './features/auth/components/RoleBasedComponents'; // Protects authenticated routes

function App() {
  return (
    <AuthProvider>

        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hotels" element={<HotelsPage />} />
            <Route path="/hotels/:id" element={<HotelDetailsPage />} />
            {/* Booking and Dashboard require authentication */}
            <Route path="/booking/:id" element={
              <RequireAuth>
                <BookingPage />
              </RequireAuth>
            } />
            <Route path="/dashboard" element={
              <RequireAuth>
                <DashboardPage />
              </RequireAuth>
            } />
            <Route path="*" element={<div>Page not found</div>} />
          </Routes>
        </main>
        <footer className="app-footer">&copy; {new Date().getFullYear()} HotelBooker</footer>

   </AuthProvider>  
  );
}

export default App;
