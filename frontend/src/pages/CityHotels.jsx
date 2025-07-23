import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import HotelList from '../components/HotelList';
import './CityHotels.css';

const CityHotels = () => {
  const { cityName } = useParams();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotelsByCity = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3001/api/hotels/city/${encodeURIComponent(cityName)}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch hotels');
        }
        
        const data = await response.json();
        setHotels(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelsByCity();
  }, [cityName]);

  const formatCityName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  if (loading) {
    return (
      <div className="city-hotels-page">
        <div className="loading">Loading hotels in {formatCityName(cityName)}...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="city-hotels-page">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="city-hotels-page">
      <div className="city-header">
        <h1>Hotels in {formatCityName(cityName)}</h1>
        <p>{hotels.length} hotels found</p>
      </div>
      
      {hotels.length === 0 ? (
        <div className="no-hotels">
          <h3>No hotels found in {formatCityName(cityName)}</h3>
          <p>Try searching for a different city or check back later.</p>
        </div>
      ) : (
        <div className="hotels-grid">
          <HotelList hotels={hotels} />
        </div>
      )}
    </div>
  );
};

export default CityHotels; 