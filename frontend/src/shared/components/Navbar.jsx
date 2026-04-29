import React from 'react';
import { Link } from 'react-router-dom';
import { AuthButton, ProfileModal, useAuth } from '@features/auth';
import { User } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const [isProfileModalOpen, setIsProfileModalOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="app-header">
      <nav className="navbar">
        <Link to="/" className="nav-logo" onClick={closeMobileMenu}>HotelsOnWeb</Link>

        <div className="navbar-right">
          <button
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav-menu"
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
            <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
            <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="mobile-menu-backdrop" onClick={closeMobileMenu} aria-hidden="true" />
        )}

        <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`} id="mobile-nav-menu">
          {user && user.role === 'owner' &&
                <Link to="/my-hotel" onClick={closeMobileMenu}>My Hotel</Link>}
              {user && user.role === 'customer'  &&
                <Link to="/dashboard" onClick={closeMobileMenu}>My Bookings</Link>
              }

           {user && user.role === 'admin'  &&
                  <>
                  <Link to="/dashboard" onClick={closeMobileMenu}>Admin Dashboard</Link>
                  {/* <Link to="/admin/users">Manage Users</Link> */}
                  <Link to="/admin/hotels" onClick={closeMobileMenu}>Manage Hotels</Link>
                  <Link to="/admin/hotel-requests" onClick={closeMobileMenu}>Hotel Requests</Link>
                </>
          }
          <div className="auth-section">
            {!isAuthenticated && <AuthButton />}
            {isAuthenticated && (
              <>
                <Link
                  to="/profile"
                  className="profile-link-btn"
                  aria-label="Go to profile page"
                  onClick={closeMobileMenu}
                >
                  <User size={20} aria-hidden="true" />
                  <span className="profile-link-label">Profile</span>
                </Link>
                <button
                  className="account-menu-btn"
                  onClick={() => setIsProfileModalOpen(true)}
                  aria-label="Open account menu"
                  aria-expanded={isProfileModalOpen}
                  aria-haspopup="dialog"
                >
                  <span className="account-avatar">
                    {user.firstName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                  </span>
                </button>
              </>
            )}
            {isProfileModalOpen && <ProfileModal onClose={() => setIsProfileModalOpen(false)}/>}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;