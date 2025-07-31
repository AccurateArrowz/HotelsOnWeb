import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';

import Home from './public/Home';
import CityHotels from './public/hotels/pages/CityHotels';
import HotelDetails from './public/hotels/pages/HotelDetails';
// import DashboardPage from './private/user/DashboardPage';
import ListYourProperty from './public/ListYourProperty';
import Navbar from './components/Navbar';
import { RequireAuth } from './auth/components/RoleBasedComponents'; // Protects authenticated routes

function App() {
  return (
    <AuthProvider>

        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="hotels/:cityName" element={<CityHotels/>} />
            <Route path="/hotels/:id" element={<HotelDetails />} />
            {/* Booking and Dashboard require authentication */}
            <Route path="/booking/:id" element={
              <RequireAuth>

              </RequireAuth>
            } />
            {/* <Route path="/dashboard" element={
              <RequireAuth>
                <DashboardPage />
              </RequireAuth>
            } /> */}
            <Route path="/list-property" element={<ListYourProperty />} />
            <Route path="*" element={<div>Page not found</div>} />
          </Routes>
        </main>
        <footer className="app-footer">&copy; {new Date().getFullYear()} HotelBooker</footer>

   </AuthProvider>  
  );
}

export default App;
