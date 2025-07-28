import React from 'react';
import { Link } from 'react-router-dom';

const HotelCard = ({ hotel }) => {
  // Handle both frontend mock data and backend data structures
  const hotelName = hotel.name || hotel.hotelName || 'Hotel Name';
  const hotelLocation = hotel.location || `${hotel.city || 'City'}, ${hotel.country || 'Country'}`;
  const hotelPrice = hotel.price || hotel.pricePerNight || 'Price not available';
  const hotelRating = hotel.rating || 0;
  const hotelImage = hotel.image || hotel.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
  const hotelId = hotel.id || hotel.hotelId;

  return (
  <div className="hotel-card">
      <img src={hotelImage} alt={hotelName} className="hotel-image" />
    <div className="hotel-info">
        <h3>{hotelName}</h3>
        <p>{hotelLocation}</p>
        <p>From ${hotelPrice} / night</p>
        <p>Rating: {hotelRating} ⭐</p>
        <Link to={`/hotels/${hotelId}`} className="details-btn">View Details</Link>
    </div>
  </div>
);
};

export default HotelCard; 