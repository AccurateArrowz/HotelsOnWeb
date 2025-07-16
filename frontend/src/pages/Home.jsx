import React, { useState } from 'react';
import HotelList from '../components/HotelList';
import './Home.css';

const Home = () => {
  const [search, setSearch] = useState({ location: '', checkin: '', checkout: '', guests: 1 });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearch((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // For now, just log the search. Later, filter hotels.
    alert(`Searching hotels in ${search.location} for ${search.guests} guest(s) from ${search.checkin} to ${search.checkout}`);
  };

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-overlay">
          <h1 className="hero-title">Find Your Perfect Stay</h1>
          <p className="hero-subtitle">Book top hotels, resorts, and more—tailored for you.</p>
          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              name="location"
              placeholder="Where to? (City, Hotel...)"
              value={search.location}
              onChange={handleChange}
              required
            />
            <input
              type="date"
              name="checkin"
              value={search.checkin}
              onChange={handleChange}
              required
            />
            <input
              type="date"
              name="checkout"
              value={search.checkout}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="guests"
              min="1"
              max="10"
              value={search.guests}
              onChange={handleChange}
              required
              className="guests-input"
            />
            <button type="submit" className="search-btn">Search</button>
          </form>
        </div>
      </section>
      <section className="top-hotels-section">
        <h2>Top Hotels</h2>
        <HotelList />
      </section>
    </div>
  );
};

export default Home; 