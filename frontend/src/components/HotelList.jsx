import React from 'react';
import { hotels } from '../mockData';
import HotelCard from './HotelCard';

const HotelList = () => (
  <div className="hotel-list">
    {hotels.map(hotel => (
      <HotelCard key={hotel.id} hotel={hotel} />
    ))}
  </div>
);

export default HotelList; 