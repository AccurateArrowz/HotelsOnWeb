import React from 'react';
import { Link } from 'react-router-dom';
import { AuthButton, ProfileModal, useAuth } from '@features/auth';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const [isProfileModalOpen, setIsProfileModalOpen] = React.useState(false);
  
  return (
    <header className="app-header">
      <nav className="navbar">
        <Link to="/" className="nav-logo">HotelsOnWeb</Link>
        
        <div className="nav-links">
          {user && user.role === 'owner' &&
                <Link to="/my-hotel">My Hotel</Link>}
              {user && user.role === 'customer'  && 
                <Link to="/dashboard">My Bookings</Link>
              }

           {user && user.role === 'admin'  &&
                  <>    
                  <Link to="/dashboard">Admin Dashboard</Link>
                  {/* <Link to="/admin/users">Manage Users</Link> */}
                  <Link to="/admin/hotels">Manage Hotels</Link>
                  <Link to="/admin/hotel-requests">Hotel Requests</Link>
                </>
}
          <div className="auth-section">
            {!isAuthenticated && <AuthButton />}
            {isAuthenticated && (
              <button
                className="profile-btn"
                onClick={() => { console.log('profile button clicked '); setIsProfileModalOpen(true); }}
                aria-label="Open profile"
              >
                <span className="profile-avatar">
                  {user.firstName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                </span>
              </button>
            )}
           {isProfileModalOpen && <ProfileModal onClose={() => setIsProfileModalOpen(false)}/>}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;