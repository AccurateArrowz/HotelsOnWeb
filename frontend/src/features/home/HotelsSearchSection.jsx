import  { useState, useEffect,useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function HotelsSearchSection() {
      const navigate = useNavigate();
      const [search, setSearch] = useState({ 
        location: '',
        adults: 2,
        children: 0
      });
      const [showGuestSelector, setShowGuestSelector] = useState(false);
      const guestSelectorRef = useRef(null);
    
    useEffect(() => {
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
    
      
      const handleChange = (e) => {
        const { name, value } = e.target;
        setSearch(prev => ({
          ...prev,
          [name]: (name === 'adults' || name === 'children') ? parseInt(value, 10) : value
        }));
      };
    
      const incrementGuests = (type) => {
        setSearch(prev => ({
          ...prev,
          [type]: Math.min(prev[type] + 1, type === 'adults' ? 20 : 10)
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
    
        // Create a slug/encoded version of the city for the URL
        const citySlug = search.location.trim().toLowerCase();
        if (!citySlug) return;
    
        // Navigate to the CityHotels page, passing extra search info via location state
        navigate(`/hotels/${encodeURIComponent(citySlug)}`, {
          state: {
            ...search,
            checkin,
            checkout,
          },
        });
      };

  return (
      <section className="hero-section">
        <div className="hero-overlay">
          <h1 className="hero-title">Find Your Perfect Stay</h1>
          <p className="hero-subtitle">Book top hotels, resorts, and more—tailored for you.</p>
          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              name="location"
              placeholder="Search by City or Hotel"
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
  )
}
