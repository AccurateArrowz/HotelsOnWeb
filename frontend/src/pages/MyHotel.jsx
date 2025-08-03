import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import '../styles/MyHotel.css';

const MyHotel = () => {
  const { user } = useAuth();

  // Mock data for now
  const hotel = {
    name: 'My Awesome Hotel',
    status: 'pending', // or 'pending'
    analytics: {
      revenue: 0,
      bookings: 0,
    },
  };

  // This is a simple check. Ideally, you'd use a protected route component.
  if (user?.role !== 'hotelOwner') {
    return (
      <div className="my-hotel-container unauthorized-message">
        <h2>Unauthorized</h2>
        <p>You do not have permission to view this page.</p>
        <Link to="/">Go to Homepage</Link>
      </div>
    );
  }

  return (
    <div className="my-hotel-container">
      <header className="hotel-header">
        <h1>{hotel.name}</h1>
        <Link to="/edit-hotel" className="btn btn-primary">Modify Hotel Details</Link>
      </header>

      <section className="hotel-status-section">
        <h2>Hotel Status</h2>
        <p className={`status-${hotel.status}`}>{hotel.status}</p>
      </section>

      <section className="analytics-section">
        <h2>Analytics</h2>
        <div className="analytics-grid">
          <div className="analytic-item">
            <h3>Total Revenue</h3>
            <p>${hotel.analytics.revenue}</p>
          </div>
          <div className="analytic-item">
            <h3>Total Bookings</h3>
            <p>{hotel.analytics.bookings}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MyHotel;
