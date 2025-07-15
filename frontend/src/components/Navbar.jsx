import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  // Mock user role as 'guest' for now
  const userRole = 'guest';

  return (
    <header className="app-header">
      <nav className="navbar">
        <Link to="/" className="nav-logo">HotelBooker</Link>
        <div className="nav-links">
          <Link to="/hotels">Hotels</Link>
          <Link to="/booking">Book</Link>
          <Link to="/dashboard">Dashboard</Link>
          {userRole === 'guest' && <Link to="/login">Login</Link>}
          {userRole === 'guest' && <Link to="/signup">Signup</Link>}
        </div>
      </nav>
    </header>
  );
};

export default Navbar; 