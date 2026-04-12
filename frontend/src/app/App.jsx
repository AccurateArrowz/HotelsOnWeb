import { Routes, Route } from 'react-router-dom';
import { Navbar, Footer } from '@shared/components';
import { RequireAuth, RequireRole } from '@features/auth/RoleBasedComponents';
import { Suspense, lazy } from 'react';
import OwnerDashboard from '@features/owner/pages/OwnerDashboard';

// Lazy-loaded page components
const Home = lazy(() => import('@app/pages/Home'));
const HotelsPage = lazy(() => import('@features/hotels/pages/HotelsPage'));
const HotelDetails = lazy(() => import('@features/hotels/pages/HotelDetails'));
const DashboardPage = lazy(() => import('@features/user/pages/DashboardPage'));
const ListYourProperty = lazy(() => import('@features/owner/pages/ListYourProperty'));
const Unauthorized = lazy(() => import('@app/pages/Unauthorized'));
const MyHotel = lazy(() => import('@features/owner/MyHotel'));

function App() {


  // const location = useLocation();
  // const navigate = useNavigate();

  // const { isAuthenticated } = useAuth();
  // const redirectOnModalClosePrefixes = ['/list-property'];
  // const shouldRedirectOnModalClose = redirectOnModalClosePrefixes.some(
  //   (prefix) => location.pathname === prefix || location.pathname.startsWith(`${prefix}/`)
  // );

  
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
              // <RequireAuth onRequireLogin={openLoginModal}>
                <RequireRole role="owner">
                  <ListYourProperty />
                </RequireRole>
              // </RequireAuth>
            } />
            <Route path="/my-hotel" element={
              <RequireAuth onRequireLogin={openLoginModal}>
                <RequireRole role="owner">
                  <OwnerDashboard></OwnerDashboard>
                </RequireRole>
              </RequireAuth>
            } />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<div>Page not found</div>} />
          </Routes>
        </Suspense>
      </main>
      <Footer />


    </>
  );
}

export default App;

