import React from 'react'
import CityCard from './CityCard';
import { kathmandu as kathmanduImg, bhaktapur as bhaktapurImg, pokhara1 as pokharaImg, ilam as ilamImg, chitwan1 as chitwanImg, lumbini as lumbiniImg } from '@assets';

export default function PopularCities() {
    // Popular cities data with images
  const popularCities = [
    {
      name: 'Kathmandu',
      image: kathmanduImg,
      hotelCount: 45
    },
    {
      name: 'Bhaktapur',
      image: bhaktapurImg,
      hotelCount: 12
    },
    {
      name: 'Pokhara',
      image: pokharaImg,
      hotelCount: 28
    },
    {
      name: 'Ilam',
      image: ilamImg,
      hotelCount: 8
    },
    {
      name: 'Chitwan',
      image: chitwanImg,
      hotelCount: 15
    },
    {
      name: 'Lumbini',
      image: lumbiniImg,
      hotelCount: 6
    }
  ];

  return (
     <section className="popular-cities-section">
        <div className="container">
          <h2>Popular Destinations</h2>
          <p>Explore hotels in Nepal's most visited cities</p>
          <div className="cities-grid">
            {popularCities.map((city, index) => (
              <CityCard key={index} city={city} />
            ))}
          </div>
        </div>
      </section>
  )
}
