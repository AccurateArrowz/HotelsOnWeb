import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@shared/components/Navbar';
import Footer from '@shared/components/Footer';
import { RequireAuth, RequireRole } from '@features/auth/RoleBasedComponents';
import { LoginModal } from '@features/auth';
import { Suspense, lazy, useState } from 'react';
import { useAuth } from '../features/auth/useAuth';

// Lazy-loaded page components
const Home = lazy(() => import('@app/pages/Home'));
const HotelsPage = lazy(() => import('@features/hotels/pages/HotelsPage'));
const HotelDetails = lazy(() => import('@features/hotels/pages/HotelDetails'));
const DashboardPage = lazy(() => import('@features/user/pages/DashboardPage'));
const ListYourProperty = lazy(() => import('@features/owner/pages/ListYourProperty'));
const Unauthorized = lazy(() => import('@app/pages/Unauthorized'));
const MyHotel = lazy(() => import('@features/owner/MyHotel'));

function App() {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const openLoginModal = () => setLoginModalOpen(true);


  const location = useLocation();
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();
  const redirectOnModalClosePrefixes = ['/list-property'];
  const shouldRedirectOnModalClose = redirectOnModalClosePrefixes.some(
    (prefix) => location.pathname === prefix || location.pathname.startsWith(`${prefix}/`)
  );

  const closeLoginModal = () => {
    setLoginModalOpen(false);
    console.log('isAuthenticated', isAuthenticated);
    console.log('shouldRedirectOnModalClose ', shouldRedirectOnModalClose);
    if (!isAuthenticated && shouldRedirectOnModalClose) {
      navigate('/', { replace: true });
    }
  };
  return (
    <>

      <Navbar />
      <main className="main-content">
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="hotels/:query" element={<HotelsPage />} />
            <Route path="/hotels/id/:id" element={<HotelDetails />} />
            {/*The following routes require authentication */}
            <Route path="/booking/:id" element={
              <RequireAuth onRequireLogin={openLoginModal}>
                {/* Place booking component here */}
              </RequireAuth>
            } />
            <Route path="/dashboard" element={
              <RequireAuth onRequireLogin={openLoginModal}>
                <DashboardPage />
              </RequireAuth>
            } />
            <Route path="/list-property" element={
              <RequireAuth onRequireLogin={openLoginModal}>
                <RequireRole role="hotelOwner">
                  <ListYourProperty />
                </RequireRole>
              </RequireAuth>
            } />
            <Route path="/my-hotel" element={
              <RequireAuth onRequireLogin={openLoginModal}>
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
      <LoginModal open={loginModalOpen} onClose={closeLoginModal} />

    </>
  );
}

export default App;
