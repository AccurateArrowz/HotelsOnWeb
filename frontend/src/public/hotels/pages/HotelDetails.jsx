import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchHotelById } from '../../../services/api';
import './HotelDetails.css';

const HotelDetailsPage = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchHotelById(id);
        setHotel(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch hotel details');
        setHotel(null);
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id]);

  if (loading) {
    return <div className="hotel-details-page"><div className="loading">Loading hotel details...</div></div>;
  }

  if (error) {
    return (
      <div className="hotel-details-page">
        <div className="error">
          <span>Error: {error}</span>
          <button className="try-again-btn" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return <div className="hotel-details-page"><div className="not-found">Hotel not found.</div></div>;
  }

  return (
    <div className="hotel-details-page">
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
            {hotel.rooms && hotel.rooms.length > 0 ? hotel.rooms.map((room, index) => (
              <div key={index} className="room-card">
                <h3>{room.type}</h3>
                <p className="price">${room.price} / night</p>
                <p className="availability">{room.available} rooms available</p>
                <button className="book-btn">Book Now</button>
              </div>
            )) : <div>No rooms available.</div>}
          </div>
        </div>
        {/* Add more hotel details/features here as needed */}
      </div>
    </div>
  );
};

export default HotelDetailsPage;
