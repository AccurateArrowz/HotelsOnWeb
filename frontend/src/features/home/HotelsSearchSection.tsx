import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface SearchState {
  query: string;
  adults: number;
  children: number;
}

export default function HotelsSearchSection() {
  const navigate = useNavigate();
  const [search, setSearch] = useState<SearchState>({ 
    query: '',
    adults: 2,
    children: 0
  });
  const [showGuestSelector, setShowGuestSelector] = useState(false);
  const guestSelectorRef = useRef<HTMLDivElement>(null);
  const [checkin, setCheckin] = useState<Date | null>(null);
  const [checkout, setCheckout] = useState<Date | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (guestSelectorRef.current && !guestSelectorRef.current.contains(event.target as Node)) {
        setShowGuestSelector(false);
      }
    };
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearch(prev => ({
      ...prev,
      [name]: (name === 'adults' || name === 'children') ? parseInt(value, 10) : value
    }));
  };

  const incrementGuests = (type: 'adults' | 'children') => {
    setSearch(prev => ({
      ...prev,
      [type]: Math.min(prev[type] + 1, type === 'adults' ? 20 : 10)
    }));
  };

  const decrementGuests = (type: 'adults' | 'children') => {
    setSearch(prev => ({
      ...prev,
      [type]: Math.max(prev[type] - 1, type === 'adults' ? 1 : 0)
    }));
  };

  const getTotalGuests = () => {
    return search.adults + search.children;
  };

  const handleGuestSelectorClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowGuestSelector(!showGuestSelector);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowGuestSelector(false);

    const querySlug = search.query.trim().toLowerCase();
    if (!querySlug) return;

    navigate(`/hotels/${encodeURIComponent(querySlug)}`, {
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
            name="query"
            placeholder="Search by City or Hotel"
            value={search.query}
            onChange={handleChange}
            required
          />
          <DatePicker
            selected={checkin}
            onChange={(date: Date | null) => setCheckin(date)}
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
            onChange={(date: Date | null) => setCheckout(date)}
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
