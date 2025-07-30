import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { AuthButton } from '../features/auth/components/AuthButton';

const Navbar = () => {
  const { user } = useAuth();
  
  return (
    <header className="app-header">
      <nav className="navbar">
        <Link to="/" className="nav-logo">HotelBooker</Link>
        
        <div className="nav-links">
          <Link to="/hotels">Hotels</Link>
          
          {user && (
            <>
              {user.role === 'customer' && (
                <Link to="/booking">Book a Room</Link>
              )}
              
              {user.role === 'hotelOwner' && (
                <Link to="/my-hotel">My Hotel</Link>
              )}
              
              <Link to="/dashboard">My Bookings</Link>
            </>
          )}
          
          <div className="auth-section">
            <AuthButton />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;