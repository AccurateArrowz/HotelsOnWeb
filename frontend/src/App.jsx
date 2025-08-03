import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import Navbar from './components/Navbar';
import Footer from './public/Footer';
import { RequireAuth, RequireRole } from './auth/components/RoleBasedComponents'; // Protects authenticated routes
import { LoginModal } from './auth/components/LoginModal';
import { Suspense, lazy, useState } from 'react';

// Lazy-loaded page components
const Home = lazy(() => import('./public/Home'));
const CityHotels = lazy(() => import('./public/hotels/pages/CityHotels'));
const HotelDetails = lazy(() => import('./public/hotels/pages/HotelDetails'));
const DashboardPage = lazy(() => import('./private/user/DashboardPage'));
const ListYourProperty = lazy(() => import('./public/ListYourProperty'));
const Unauthorized = lazy(() => import('./public/Unauthorized'));
const MyHotel = lazy(() => import('./pages/MyHotel'));

function App() {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const handleRequireLogin = () => setLoginModalOpen(true);
  return (

    <AuthProvider>
      <Navbar />
      <main className="main-content">
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="hotels/:cityName" element={<CityHotels />} />
            <Route path="/hotels/id/:id" element={<HotelDetails />} />
            {/* Booking and Dashboard require authentication */}
            <Route path="/booking/:id" element={
              <RequireAuth onRequireLogin={handleRequireLogin}>
                {/* Place booking component here */}
              </RequireAuth>
            } />
            <Route path="/dashboard" element={
              <RequireAuth onRequireLogin={handleRequireLogin}>
                <DashboardPage />
              </RequireAuth>
            } />
            <Route path="/list-property" element={
              <RequireAuth onRequireLogin={handleRequireLogin}>
                <RequireRole role="hotelOwner">
                  <ListYourProperty />
                </RequireRole>
              </RequireAuth>
            } />
            <Route path="/my-hotel" element={
              <RequireAuth onRequireLogin={handleRequireLogin}>
                <RequireRole role="hotelOwner">
                  <MyHotel />
                </RequireRole>
              </RequireAuth>
            } />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<div>Page not found</div>} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <LoginModal open={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </AuthProvider>

  );
}

export default App;
