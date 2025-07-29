import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { RequirePermission, RequireRole } from '../../auth/components/RoleBasedComponents';
import { hotels } from '../../../mockData';

const HotelDetails = () => {
  const { id } = useParams();
  const { hasPermission } = useAuth();
  
  const hotel = hotels.find(h => h.id === parseInt(id));
  
  if (!hotel) {
    return <div>Hotel not found</div>;
  }

  return (
    <div className="hotel-details">
      <div className="hotel-header">
        <img src={hotel.image} alt={hotel.name} className="hotel-image" />
        <div className="hotel-info">
          <h1>{hotel.name}</h1>
          <p className="location">{hotel.location}</p>
          <p className="rating">Rating: {hotel.rating} ⭐</p>
          <p className="description">{hotel.description}</p>
        </div>
      </div>

      <div className="hotel-content">
        <div className="rooms-section">
          <h2>Available Rooms</h2>
          <div className="rooms-grid">
            {hotel.rooms.map((room, index) => (
              <div key={index} className="room-card">
                <h3>{room.type}</h3>
                <p className="price">${room.price} / night</p>
                <p className="availability">{room.available} rooms available</p>
                
                <RequirePermission permission="book_hotels">
                  <button className="book-btn">Book Now</button>
                </RequirePermission>
                
                <RequirePermission permission="manage_hotels">
                  <div className="admin-actions">
                    <button className="edit-room-btn">Edit Room</button>
                    <button className="delete-room-btn">Delete Room</button>
                  </div>
                </RequirePermission>
              </div>
            ))}
          </div>
        </div>

        <div className="actions-section">
          <RequirePermission permission="book_hotels">
            <div className="action-card">
              <h3>Book This Hotel</h3>
              <p>Reserve your stay at {hotel.name}</p>
              <a href={`/booking?hotel=${hotel.id}`} className="primary-btn">
                Book Now
              </a>
            </div>
          </RequirePermission>

          <RequirePermission permission="create_reviews">
            <div className="action-card">
              <h3>Write a Review</h3>
              <p>Share your experience at {hotel.name}</p>
              <button className="review-btn">Write Review</button>
            </div>
          </RequirePermission>

          <RequirePermission permission="moderate_reviews">
            <div className="action-card">
              <h3>Moderate Reviews</h3>
              <p>Manage reviews for {hotel.name}</p>
              <button className="moderate-btn">Moderate Reviews</button>
            </div>
          </RequirePermission>

          <RequireRole role="admin">
            <div className="action-card admin-card">
              <h3>Admin Actions</h3>
              <p>Administrative controls for {hotel.name}</p>
              <div className="admin-buttons">
                <button className="admin-btn">Edit Hotel</button>
                <RequirePermission permission="delete_hotels">
                  <button className="delete-btn">Delete Hotel</button>
                </RequirePermission>
              </div>
            </div>
          </RequireRole>
        </div>
      </div>
  </div>
);
};

export default HotelDetails; 