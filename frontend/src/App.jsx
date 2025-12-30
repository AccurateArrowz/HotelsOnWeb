import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '@shared/components/Navbar';
import Footer from '@shared/components/Footer';
import { RequireAuth, RequireRole, AuthProvider } from '@features/auth'; // Protects authenticated routes
import { LoginModal } from '@features/auth';
import { Suspense, lazy, useState } from 'react';

// Lazy-loaded page components
const Home = lazy(() => import('@app/pages/Home'));
const CityHotels = lazy(() => import('@features/hotels/pages/CityHotels'));
const HotelDetails = lazy(() => import('@features/hotels/pages/HotelDetails'));
const DashboardPage = lazy(() => import('./features/user/pages/DashboardPage'));
const ListYourProperty = lazy(() => import('@features/owner/pages/ListYourProperty'));
const Unauthorized = lazy(() => import('@app/pages/Unauthorized'));
const MyHotel = lazy(() => import('@features/owner/MyHotel'));

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
