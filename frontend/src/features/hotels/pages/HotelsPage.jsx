import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HotelList } from '@features/hotels/components';
import { Loading, TryAgainButton } from '@shared/components';
import { toast } from '@shared/utils/toast';
import { useLazyGetHotelsQuery } from '../hotelsApi';
import './HotelsPage.css';

const PAGE_SIZE = 20;
const SORT_OPTIONS = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'price-asc', label: 'Price (Low to High)' },
  { value: 'price-desc', label: 'Price (High to Low)' },
  { value: 'rating-desc', label: 'Highest Rated' },
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' }
];

const HotelsPage = () => {
  const { query } = useParams();
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [sortBy, setSortBy] = useState('popularity');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const loadMoreRef = useRef(null);

  const [triggerGetHotels] = useLazyGetHotelsQuery();

  // Fetch hotels for the current search — offset-based for infinite scroll
  const fetchMoreHotels = useCallback(async (isInitialLoad = false) => {
    try {
      setLoading(true);
      setError(null);
      const nextOffset = isInitialLoad ? 0 : offset;
      const result = await triggerGetHotels({
        search: query,
        limit: PAGE_SIZE,
        offset: nextOffset
      }).unwrap();
      const newHotels = result?.data ?? [];
      const pagination = result?.pagination;
      if (isInitialLoad) {
        setHotels(newHotels);
      } else {
        setHotels(prev => [...prev, ...newHotels]);
      }
      setHasMore(pagination?.hasMore ?? false);
      setOffset(nextOffset + PAGE_SIZE);
    } catch (err) {
      const errorMessage = err?.data?.message || err?.error || err?.message || 'Failed to fetch hotels';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [query, offset, triggerGetHotels]);

  // Initial load or city change
  useEffect(() => {
    setHotels([]);
    setOffset(0);
    setHasMore(true);
    fetchMoreHotels(true);
    // eslint-disable-next-line
  }, [query, retryCount]);

  useEffect(() => {
    if (!loadMoreRef.current) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting && !loading && hasMore && hotels.length > 0) {
          fetchMoreHotels();
        }
      },
      {
        root: null,
        rootMargin: '400px 0px',
        threshold: 0.1
      }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [fetchMoreHotels, hasMore, hotels.length, loading]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatQueryName = name => name.charAt(0).toUpperCase() + name.slice(1);

  // Sort hotels based on the current sort order
  const sortedHotels = [...hotels].sort((a, b) => {
    switch (sortBy) {
      case 'popularity':
        return (b.rating || 0) - (a.rating || 0);
      case 'price-asc':
        return (a.price || 0) - (b.price || 0);
      case 'price-desc':
        return (b.price || 0) - (a.price || 0);
      case 'rating-desc':
        return (b.rating || 0) - (a.rating || 0);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'name-asc':
        return a.name.localeCompare(b.name);
      default:
        return (b.rating || 0) - (a.rating || 0);
    }
  });

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setRetryCount(c => c + 1);
  };

  return (
    <div className="city-hotels-page">
      <div className="city-header-row">
        <div className="city-header-info">
          <h1>Hotels for "{formatQueryName(query)}"</h1>
          <p>{hotels.length} hotels found</p>
        </div>
        <div className="sort-options" ref={dropdownRef}>
          <span className="sort-label">Sort by:</span>
          <div className="custom-dropdown">
            <button
              type="button"
              className="dropdown-trigger"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-haspopup="listbox"
              aria-expanded={isDropdownOpen}
              aria-label="Sort hotels by"
            >
              {SORT_OPTIONS.find(opt => opt.value === sortBy)?.label}
              <svg
                className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {isDropdownOpen && (
              <ul className="dropdown-menu" role="listbox" aria-label="Sort options">
                {SORT_OPTIONS.map((option) => (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={sortBy === option.value}
                    className={`dropdown-item ${sortBy === option.value ? 'selected' : ''}`}
                    onClick={() => {
                      setSortBy(option.value);
                      setIsDropdownOpen(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSortBy(option.value);
                        setIsDropdownOpen(false);
                      }
                    }}
                    tabIndex={0}
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      {loading && hotels.length === 0 && (
        <Loading size="large" message={`Loading hotels for "${formatQueryName(query)}"...`} />
      )}
      {error && (
        <div className="error">
          <span>Error: {error}</span>
          <TryAgainButton onClick={handleRetry} variant="secondary" size="sm" />
        </div>
      )}
      {!loading && !error && hotels.length === 0 && (
        <div className="no-hotels">
          <h3>No hotels found for "{formatQueryName(query)}"</h3>
          <p>Try searching for a different city, hotel name, or check back later.</p>
        </div>
      )}
      {!error && hotels.length > 0 && (
        <div className="hotels-list">
          {sortedHotels.map((hotel) => (
            <div
              key={hotel.id}
              className="hotel-list-row"
              onClick={() => navigate(`/hotels/id/${hotel.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(`/hotels/id/${hotel.id}`);
                }
              }}
            >
              <HotelList hotels={[hotel]} />
            </div>
          ))}
          <div ref={loadMoreRef} className="hotels-load-more-trigger" aria-hidden="true" />
          {loading && <Loading size="medium" message="Loading more hotels..." />}
          {!hasMore && hotels.length > 0 && (
            <p className="hotels-end-message">You've reached the end of the list.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default HotelsPage;
