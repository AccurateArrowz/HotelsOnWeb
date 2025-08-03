import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { AuthButton } from '../auth/components/AuthButton';
import ProfileModal from '../auth/components/ProfileModal';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const [profileOpen, setProfileOpen] = React.useState(false);
  
  return (
    <header className="app-header">
      <nav className="navbar">
        <Link to="/" className="nav-logo">HotelsOnWeb</Link>
        
        <div className="nav-links">
          {/* Show only if not a plain user */}
          {(!user || user.role !== 'customer') && (
            <Link to="/list-property">List your Property</Link>
          )}
          
          {user && (
            <>
              {user.role === 'hotelOwner' ? (
                <Link to="/my-hotel">My Hotel</Link>
              ) : (
                <Link to="/dashboard">My Bookings</Link>
              )}
            </>
          )}
          
          <div className="auth-section">
            {!isAuthenticated && <AuthButton />}
            {isAuthenticated && (
              <button
                className="profile-btn"
                onClick={() => setProfileOpen(true)}
                aria-label="Open profile"
              >
                <span className="profile-avatar">
                  {user.firstName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                </span>
              </button>
            )}
            <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;