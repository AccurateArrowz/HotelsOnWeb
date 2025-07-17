import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { RequirePermission, RequireRole, RequireAuth, RequireGuest } from './RoleBasedComponents';

const Navbar = () => {
  const { user, logout, hasPermission, hasRole } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="app-header">
      <nav className="navbar">
        <Link to="/" className="nav-logo">HotelBooker</Link>
        
        <div className="nav-links">
          {/* Public links - visible to everyone */}
          <Link to="/hotels">Hotels</Link>
          
          {/* Links for authenticated users */}
          <RequireAuth>
            <RequirePermission permission="book_hotels">
          <Link to="/booking">Book</Link>
            </RequirePermission>
            
            <RequirePermission permission="view_bookings">
          <Link to="/dashboard">Dashboard</Link>
            </RequirePermission>
            
            {/* Admin panel link */}
            <RequirePermission permission="access_admin_panel">
              <Link to="/admin">Admin Panel</Link>
            </RequirePermission>
            
            {/* Hotel management for owners */}
            <RequireRole role="hotelOwner">
              <Link to="/manage-hotels">Manage Hotels</Link>
            </RequireRole>
            
            {/* User management for admins */}
            <RequireRole role="admin">
              <Link to="/manage-users">Manage Users</Link>
            </RequireRole>
          </RequireAuth>
          
          {/* Authentication links */}
          <RequireGuest>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </RequireGuest>
          
          {/* User menu for authenticated users */}
          <RequireAuth>
            <div className="user-menu">
              <span className="user-name">
                {user?.name} ({user?.role})
              </span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          </RequireAuth>
        </div>
      </nav>
    </header>
  );
};

export default Navbar; 