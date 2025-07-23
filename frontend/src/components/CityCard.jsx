import React from 'react';
import { useNavigate } from 'react-router-dom';

const CityCard = ({ city }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/${city.name.toLowerCase()}`);
  };

  return (
    <div 
      className="city-card"
      onClick={handleClick}
    >
      <div className="city-image">
        <img src={city.image} alt={city.name} />
        <div className="city-overlay">
          <h3 className="city-name">{city.name}</h3>
          <p className="hotel-count">{city.hotelCount} Hotels</p>
        </div>
      </div>
    </div>
  );
};

export default CityCard; 