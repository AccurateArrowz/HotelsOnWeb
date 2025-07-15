import React from 'react';
import { Link } from 'react-router-dom';

const HotelCard = ({ hotel }) => (
  <div className="hotel-card">
    <img src={hotel.image} alt={hotel.name} className="hotel-image" />
    <div className="hotel-info">
      <h3>{hotel.name}</h3>
      <p>{hotel.location}</p>
      <p>From ${hotel.price} / night</p>
      <p>Rating: {hotel.rating} ⭐</p>
      <Link to={`/hotels/${hotel.id}`} className="details-btn">View Details</Link>
    </div>
  </div>
);

export default HotelCard; 