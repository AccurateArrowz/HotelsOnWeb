import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { HotelList } from '@features/hotels/components';
import { Loading } from '@shared/components';
import { useLazyGetHotelsQuery } from '../hotelsApi';
import './HotelsPage.css';

const PAGE_SIZE = 20;
const ITEM_HEIGHT = 225; // Updated height: 200px card + 25px gap

const HotelsPage = () => {
  const { query } = useParams();
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [retryCount, setRetryCount] = useState(0);
  const listRef = useRef();
  const [sortBy, setSortBy] = useState('name-asc'); // Default sort

  const [triggerGetHotels] = useLazyGetHotelsQuery();

  // Fetch hotels for the current query/page
  const fetchMoreHotels = useCallback(async (IsInitialLoad = false) => {
    try {
      setLoading(true);
      setError(null);
      const nextPage = IsInitialLoad ? 1 : page;
      const hotelResponse = await triggerGetHotels({ q: query, page: nextPage, limit: PAGE_SIZE }).unwrap();
      // console.log("API response:", hotelResponse);
      if (IsInitialLoad) {
        setHotels(Array.isArray(hotelResponse) ? hotelResponse : []);
      } else {
        setHotels(prev => [...prev, ...(Array.isArray(hotelResponse) ? hotelResponse : [])]);
      }
      setHasMore((Array.isArray(hotelResponse) ? hotelResponse.length : 0) === PAGE_SIZE);
      setPage(nextPage + 1);
    } catch (err) {
      setError(err?.data?.message || err?.error || err?.message || 'Failed to fetch hotels');
    } finally {
      setLoading(false);
    }
  }, [query, page, triggerGetHotels]);

  // Initial load or city change
  useEffect(() => {
    setHotels([]);
    setPage(1);
    setHasMore(true);
    fetchMoreHotels(true);
    // eslint-disable-next-line
  }, [query, retryCount]);

  // Virtualized row renderer
  const Row = ({ index, style }) => {
    const hotel = sortedHotels[index];
    if (!hotel) return null;
    
    const handleHotelClick = () => {
      navigate(`/hotels/id/${hotel.id}`);
    };
    
    return (
      <div 
        style={style} 
        key={hotel.id} 
        className="virtual-hotel-row"
        onClick={handleHotelClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleHotelClick();
          }
        }}
      >
        <HotelList hotels={[hotel]} />
      </div>
    );
  };

  // Infinite loader
  const handleScroll = ({ scrollOffset, scrollHeight, clientHeight }) => {
    if (!loading && hasMore && scrollOffset + clientHeight >= scrollHeight - ITEM_HEIGHT * 2) {
      fetchMoreHotels();
    }
  };

  const formatQueryName = name => name.charAt(0).toUpperCase() + name.slice(1);

  // Sort hotels based on the current sort order
  const sortedHotels = [...hotels].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return (a.price || 0) - (b.price || 0);
      case 'price-desc':
        return (b.price || 0) - (a.price || 0);
      case 'rating-desc':
        return (b.rating || 0) - (a.rating || 0);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'name-asc':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setRetryCount(c => c + 1);
  };

  return (
    <div className="city-hotels-page">
      <div className="city-header">
        <h1>Hotels for "{formatQueryName(query)}"</h1>
        <p>{hotels.length} hotels found</p>
      </div>
      <div className="sort-options">
        <label htmlFor="sort-by">Sort by: </label>
        <select id="sort-by" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="price-asc">Price (Lowest to Highest)</option>
          <option value="price-desc">Price (Highest to Lowest)</option>
          <option value="rating-desc">Rating (Highest to Lowest)</option>
        </select>
      </div>
      {loading && hotels.length === 0 && (
        <Loading size="large" message={`Loading hotels for "${formatQueryName(query)}"...`} />
      )}
      {error && (
        <div className="error">
          <span>Error: {error}</span>
          <button className="try-again-btn" onClick={handleRetry}>
            Try Again
          </button>
        </div>
      )}
      {!loading && !error && hotels.length === 0 && (
        <div className="no-hotels">
          <h3>No hotels found for "{formatQueryName(query)}"</h3>
          <p>Try searching for a different city, hotel name, or check back later.</p>
        </div>
      )}
      {!error && hotels.length > 0 && (
        <div className="hotels-virtual-list">
          <AutoSizer>
            {({ height, width }) => (
              <List
                height={height}
                itemCount={sortedHotels.length}
                itemSize={ITEM_HEIGHT}
                width={width}
                onScroll={handleScroll}
                ref={listRef}
              >
                {Row}
              </List>
            )}
          </AutoSizer>
          {loading && <Loading size="medium" message="Loading more hotels..." />}
        </div>
      )}
    </div>
  );
};

export default HotelsPage;
