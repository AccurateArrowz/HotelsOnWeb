import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { RequirePermission } from '../../auth/components/RoleBasedComponents';
import { hotels } from '../../../mockData';

const Booking = () => {
  const { user, hasPermission } = useAuth();
  const [bookingData, setBookingData] = useState({
    hotelId: '',
    roomType: '',
    checkIn: '',
    checkOut: '',
    guests: 1
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Booking submitted! (This is a demo)');
  };

  return (
    <RequirePermission permission="book_hotels">
      <div className="booking-container">
        <div className="booking-header">
          <h1>Book Your Stay</h1>
          <p>Welcome, {user?.name}! You can book hotels with your current permissions.</p>
        </div>

        <div className="booking-content">
          <form onSubmit={handleSubmit} className="booking-form">
            <div className="form-group">
              <label htmlFor="hotelId">Select Hotel</label>
              <select
                id="hotelId"
                name="hotelId"
                value={bookingData.hotelId}
                onChange={handleChange}
                required
              >
                <option value="">Choose a hotel...</option>
                {hotels.map(hotel => (
                  <option key={hotel.id} value={hotel.id}>
                    {hotel.name} - {hotel.location}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="roomType">Room Type</label>
              <select
                id="roomType"
                name="roomType"
                value={bookingData.roomType}
                onChange={handleChange}
                required
              >
                <option value="">Choose room type...</option>
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Suite">Suite</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="checkIn">Check-in Date</label>
                <input
                  type="date"
                  id="checkIn"
                  name="checkIn"
                  value={bookingData.checkIn}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="checkOut">Check-out Date</label>
                <input
                  type="date"
                  id="checkOut"
                  name="checkOut"
                  value={bookingData.checkOut}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="guests">Number of Guests</label>
              <input
                type="number"
                id="guests"
                name="guests"
                min="1"
                max="10"
                value={bookingData.guests}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="booking-btn">
              Confirm Booking
            </button>
          </form>

          <div className="permissions-info">
            <h3>Your Booking Permissions</h3>
            <div className="permissions-list">
              {hasPermission('book_hotels') && (
                <span className="permission-tag">✓ Book Hotels</span>
              )}
              {hasPermission('view_bookings') && (
                <span className="permission-tag">✓ View Bookings</span>
              )}
              {hasPermission('cancel_bookings') && (
                <span className="permission-tag">✓ Cancel Bookings</span>
              )}
              {hasPermission('manage_all_bookings') && (
                <span className="permission-tag">✓ Manage All Bookings</span>
              )}
            </div>
          </div>
        </div>
  </div>
    </RequirePermission>
);
};

export default Booking; 