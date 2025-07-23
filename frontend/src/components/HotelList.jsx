import React, { useState, useEffect } from 'react';
import HotelCard from './HotelCard';

const HotelList = ({ hotels: propHotels }) => {
  const [hotels, setHotels] = useState(propHotels || []);
  const [loading, setLoading] = useState(!propHotels);

  useEffect(() => {
    // If hotels are provided as props, use them
    if (propHotels) {
      setHotels(propHotels);
      return;
    }

    // Otherwise, fetch from API
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/api/hotels');
        
        if (!response.ok) {
          throw new Error('Failed to fetch hotels');
        }
        
        const data = await response.json();
        setHotels(data);
      } catch (error) {
        console.error('Error fetching hotels:', error);
        setHotels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [propHotels]);

  if (loading) {
    return (
      <div className="hotel-list">
        <div className="loading">Loading hotels...</div>
      </div>
    );
  }

  if (hotels.length === 0) {
    return (
      <div className="hotel-list">
        <div className="no-hotels">No hotels found.</div>
      </div>
    );
  }

  return (
    <div className="hotel-list">
      {hotels.map(hotel => (
        <HotelCard key={hotel.id} hotel={hotel} />
      ))}
    </div>
  );
};

export default HotelList; 