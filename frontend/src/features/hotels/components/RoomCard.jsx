import React from 'react';
import { useAuth } from '@features/auth';

const RoomCard = ({ roomType, onBookNow }) => {
  const { isAuthenticated } = useAuth();  
  const handleBookNow = () => {
    onBookNow(roomType);
  };
// if(!isAuthenticated){

// }
  return (
    <div className="room-card">
      <h3>{roomType.name}</h3>
      <p className="price">Rs.{roomType.basePrice} / night</p>
      <button className="book-btn" onClick={handleBookNow}>Book Now</button>
    </div>
  );
};

export default RoomCard;
