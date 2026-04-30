import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar, Footer, Loading } from '@shared/components';
import { RequireAuth, RequireRole } from '@features/auth';
import { Suspense, lazy, useEffect } from 'react';
import OwnerDashboard from '@features/owner/pages/OwnerDashboard';

/**
 * ScrollToTop - Resets window scroll position on route navigation.
 * Prevents users landing at the bottom of new pages when switching routes.
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

// Route definitions use React Router v6 with lazy loading for code splitting
// Protected routes wrap components with RequireAuth/RequireRole guards

// Lazy-loaded page components for performance optimization
// Suspense fallback renders while chunks load
const Home = lazy(() => import('@app/pages/Home'));
const HotelsPage = lazy(() => import('@features/hotels/pages/HotelsPage'));
const HotelDetails = lazy(() => import('@features/hotels/pages/HotelDetails'));
// const DashboardPage = lazy(() => import('@features/user/pages/DashboardPage'));
const ListYourProperty = lazy(() => import('@features/owner/pages/ListYourProperty'));
const Unauthorized = lazy(() => import('@app/pages/Unauthorized'));
const MyHotel = lazy(() => import('@features/owner/pages/MyHotelPage'));
const HotelRequestsPage = lazy(() => import('@features/admin/HotelRequestsPage'));
const ProfilePage = lazy(() => import('@features/auth/pages/ProfilePage'));
const MyBookings = lazy(() => import('@features/bookings/pages/MyBookings'));

function App() {
  const location = useLocation();
  
  // Hide footer on owner dashboard pages to prevent sidebar overlap
  const hideFooter = location.pathname === '/my-hotel' || location.pathname === '/list-property';
  // const navigate = useNavigate();

  // const { isAuthenticated } = useAuth();
  // const redirectOnModalClosePrefixes = ['/list-property'];
  // const shouldRedirectOnModalClose = redirectOnModalClosePrefixes.some(
  //   (prefix) => location.pathname === prefix || location.pathname.startsWith(`${prefix}/`)
  // );


  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="main-content">
        {/* Route-level code splitting with Suspense boundary */}
        <Suspense fallback={<Loading size="large" fullScreen />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="hotels/:query" element={<HotelsPage />} />
            <Route path="/hotels/id/:id" element={<HotelDetails />} />

            {/* Protected routes */}
            
            <Route path="/booking/:id" element={
              <RequireRole role="owner">
                <div>Booking component placeholder</div>
              </RequireRole>
            } />
            <Route path="/list-property" element={
              // <RequireRole  role='owner' onRequireLogin={openLoginModal}>
                <RequireRole role="owner">
                  <ListYourProperty />
                </RequireRole>
              // </RequireRole> role='owner' 
            } />
            <Route path="/my-hotel" element={
              <RequireRole role="owner">
                <MyHotel />
              </RequireRole>
            } />
           
             <Route path="/admin/hotel-requests" element={
              <RequireRole role='admin'>
                <HotelRequestsPage />
              </RequireRole>
            } />
            <Route path="/profile" element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            } />
            <Route path="/my-bookings" element={
              <RequireAuth>
                <MyBookings />
              </RequireAuth>
            } />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<div>Page not found</div>} />
          </Routes>
        </Suspense>
      </main>
      {!hideFooter && <Footer />}


    </>
  );
}

export default App;

