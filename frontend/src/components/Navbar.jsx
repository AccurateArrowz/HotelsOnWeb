import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { RequirePermission, RequireRole, RequireAuth } from '../features/auth/components/RoleBasedComponents';
import { AuthButton } from '../features/auth/components/AuthButton';

const Navbar = () => {
  return (
    <header className="app-header">
      <nav className="navbar">
        <Link to="/" className="nav-logo">HotelBooker</Link>
        
        <div className="nav-links">
          {/* Public links - visible to everyone */}
          <Link to="/hotels">Hotels</Link>
          
          {/* Protected links - each handles its own auth/permission */}
          <RequirePermission permission="book_hotels">
            <Link to="/booking">Book</Link>
          </RequirePermission>
          <RequirePermission permission="view_bookings">
            <Link to="/dashboard">Dashboard</Link>
          </RequirePermission>
          <RequireRole role="hotelOwner">
            <Link to="/manage-hotels">Manage Hotels</Link>
          </RequireRole>
          <RequireRole role="admin">
            <Link to="/admin">Admin Panel</Link>
            <Link to="/manage-users">Manage Users</Link>
          </RequireRole>
          
          {/* Authentication button */}
          <div className="auth-section">
            <AuthButton />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;