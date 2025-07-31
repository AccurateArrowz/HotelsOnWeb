import React, { useState } from 'react';
import HotelList from './hotels/components/HotelList';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CityCard from './CityCard';
import './Home.css';

import { kathmandu as kathmanduImg, bhaktapur as bhaktapurImg, pokhara1 as pokharaImg, ilam as ilamImg, chitwan1 as chitwanImg, lumbini as lumbiniImg } from '../assets';


const Home = () => {
  const [search, setSearch] = useState({ 
    location: '',
    adults: 2,
    children: 0
  });
  const [showGuestSelector, setShowGuestSelector] = useState(false);
  const guestSelectorRef = React.useRef(null);

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (guestSelectorRef.current && !guestSelectorRef.current.contains(event.target)) {
        setShowGuestSelector(false);
      }
    }
    if (showGuestSelector) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showGuestSelector]);

  const getGuestSelectorLabel = () => {
    const { adults, children } = search;
    let label = `${adults} Adult${adults > 1 ? 's' : ''}`;
    if (children > 0) label += `, ${children} Child${children > 1 ? 'ren' : ''}`;
    return label;
  };
  const [checkin, setCheckin] = useState(null);
  const [checkout, setCheckout] = useState(null);

  // Popular cities data with realistic images
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearch(prev => ({
      ...prev,
      [name]: parseInt(value, 10)
    }));
  };

  const incrementGuests = (type) => {
    setSearch(prev => ({
      ...prev,
      [type]: Math.min(prev[type] + 1, type === 'adults' ? 30 : 10)
    }));
  };

  const decrementGuests = (type) => {
    setSearch(prev => ({
      ...prev,
      [type]: Math.max(prev[type] - 1, type === 'adults' ? 1 : 0)
    }));
  };

  const getTotalGuests = () => {
    return search.adults + search.children;
  };

  const handleGuestSelectorClick = (e) => {
    e.preventDefault();
    setShowGuestSelector(!showGuestSelector);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setShowGuestSelector(false);
    alert(`Searching hotels in ${search.location} for ${getTotalGuests()} guests (${search.adults} adults, ${search.children} children) from ${checkin ? checkin.toLocaleDateString() : ''} to ${checkout ? checkout.toLocaleDateString() : ''}`);
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
            <DatePicker
              selected={checkin}
              onChange={date => setCheckin(date)}
              selectsStart
              startDate={checkin}
              endDate={checkout}
              minDate={new Date()}
              placeholderText="Check-in"
              className="datepicker-input"
              required
            />
            <DatePicker
              selected={checkout}
              onChange={date => setCheckout(date)}
              selectsEnd
              startDate={checkin}
              endDate={checkout}
              minDate={checkin || new Date()}
              placeholderText="Check-out"
              className="datepicker-input"
              required
            />
            <div className="guest-selector-container" ref={guestSelectorRef}>
              <button 
                type="button" 
                className={`guest-selector-trigger${showGuestSelector ? ' open' : ''}`}
                onClick={handleGuestSelectorClick}
                aria-haspopup="listbox"
                aria-expanded={showGuestSelector}
              >
                {getGuestSelectorLabel()}
                <span className="dropdown-arrow">▼</span>
              </button>
              {showGuestSelector && (
                <div className="guest-selector-dropdown">
                  <div className="guest-option">
                    <div className="guest-type">
                      <span className="guest-label">Adults</span>
                      <span className="guest-age">Ages 13+</span>
                    </div>
                    <div className="guest-counter">
                      <button 
                        type="button" 
                        className="counter-btn"
                        onClick={() => decrementGuests('adults')}
                        disabled={search.adults <= 1}
                      >
                        -
                      </button>
                      <span className="guest-count">{search.adults}</span>
                      <button 
                        type="button" 
                        className="counter-btn"
                        onClick={() => incrementGuests('adults')}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="guest-option">
                    <div className="guest-type">
                      <span className="guest-label">Children</span>
                      <span className="guest-age">Ages 2-12</span>
                    </div>
                    <div className="guest-counter">
                      <button 
                        type="button" 
                        className="counter-btn"
                        onClick={() => decrementGuests('children')}
                        disabled={search.children <= 0}
                      >
                        -
                      </button>
                      <span className="guest-count">{search.children}</span>
                      <button 
                        type="button" 
                        className="counter-btn"
                        onClick={() => incrementGuests('children')}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button type="submit" className="search-btn">Search</button>
          </form>
          
        </div>
      </section>

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

      {/* Feature Highlight Hero Section */}
      <section className="feature-hero-section">
        <div className="feature-hero-container">
          <h2 className="feature-hero-title">Why Book With HotelsOnWeb?</h2>
          <p className="feature-hero-subtitle">Experience the best of hotel booking in Nepal with exclusive features designed for you.</p>
          <div className="feature-hero-grid">
            <div className="feature-hero-item">
              <span className="feature-hero-icon feature-hero-icon-green">
                {/* Price Tag SVG */}
                <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="12" fill="#E6F4EA"/><path d="M7 10.5V7.75C7 7.34 7.34 7 7.75 7h2.75M17 13.5v2.75c0 .41-.34.75-.75.75h-2.75M7 10.5l7 7c.3.3.77.3 1.06 0l2.44-2.44c.3-.3.3-.77 0-1.06l-7-7M7 10.5l7 7" stroke="#2ecc71" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
              <h3>Best Price Guarantee</h3>
              <p>We offer the lowest prices and exclusive deals you won’t find anywhere else.</p>
            </div>
            <div className="feature-hero-item">
              <span className="feature-hero-icon feature-hero-icon-blue">
                {/* Star/Review SVG */}
                <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="12" fill="#E6F0FA"/><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" stroke="#3498db" strokeWidth="1.5" strokeLinejoin="round"/></svg>
              </span>
              <h3>Verified Reviews</h3>
              <p>Read real reviews from verified guests to make confident choices.</p>
            </div>
            <div className="feature-hero-item">
              <span className="feature-hero-icon feature-hero-icon-yellow">
                {/* Headset/Support SVG */}
                <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="12" fill="#FFF9E6"/><path d="M12 4a8 8 0 0 0-8 8v2a2 2 0 0 0 2 2h1v-4H6a6 6 0 0 1 12 0h-1v4h1a2 2 0 0 0 2-2v-2a8 8 0 0 0-8-8z" stroke="#f1c40f" strokeWidth="1.5" strokeLinejoin="round"/></svg>
              </span>
              <h3>24/7 Customer Support</h3>
              <p>Our support team is always available to help you with your booking needs.</p>
            </div>
            <div className="feature-hero-item">
              <span className="feature-hero-icon feature-hero-icon-purple">
                {/* Shield/Security SVG */}
                <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="12" fill="#F3E6FA"/><path d="M12 3l7 4v5c0 5.25-3.5 10-7 10s-7-4.75-7-10V7l7-4z" stroke="#9b59b6" strokeWidth="1.5" strokeLinejoin="round"/></svg>
              </span>
              <h3>Secure Booking</h3>
              <p>Your data and payments are protected with industry-leading security.</p>
            </div>
          </div>
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