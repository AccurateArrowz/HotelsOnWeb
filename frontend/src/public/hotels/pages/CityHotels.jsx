import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import HotelList from '../components/HotelList';
import { fetchHotelsByCity } from '../../../services/api';
import './CityHotels.css';

const PAGE_SIZE = 20;
const ITEM_HEIGHT = 160; // Approximate height of each hotel card

const CityHotels = () => {
  const { cityName } = useParams();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [retryCount, setRetryCount] = useState(0);
  const listRef = useRef();

  // Fetch hotels for the current city/page
  const fetchMoreHotels = useCallback(async (IsInitialLoad = false) => {
    try {
      setLoading(true);
      setError(null);
      const nextPage = IsInitialLoad ? 1 : page;
      const hotelResponse = await fetchHotelsByCity({ city: cityName});
      console.log("API response:", hotelResponse);
      if (IsInitialLoad) {
        setHotels(Array.isArray(hotelResponse) ? hotelResponse : []);
      } else {
        setHotels(prev => [...prev, ...(Array.isArray(hotelResponse) ? hotelResponse : [])]);
      }
      setHasMore((Array.isArray(hotelResponse) ? hotelResponse.length : 0) === PAGE_SIZE);
      setPage(nextPage + 1);
    } catch (err) {
      setError(err.response?.hotelResponse?.message || err.message || 'Failed to fetch hotels');
    } finally {
      setLoading(false);
    }
  }, [cityName, page]);

  // Initial load or city change
  useEffect(() => {
    setHotels([]);
    setPage(1);
    setHasMore(true);
    fetchMoreHotels(true);
    // eslint-disable-next-line
  }, [cityName, retryCount]);

  // Virtualized row renderer
  const Row = ({ index, style }) => {
    const hotel = hotels[index];
    if (!hotel) return null;
    return (
      <div style={style} key={hotel.id} className="virtual-hotel-row">
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

  const formatCityName = name => name.charAt(0).toUpperCase() + name.slice(1);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setRetryCount(c => c + 1);
  };

  return (
    <div className="city-hotels-page">
      <div className="city-header">
        <h1>Hotels in {formatCityName(cityName)}</h1>
        <p>{hotels.length} hotels found</p>
      </div>
      {loading && hotels.length === 0 && (
        <div className="loading">Loading hotels in {formatCityName(cityName)}...</div>
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
          <h3>No hotels found in {formatCityName(cityName)}</h3>
          <p>Try searching for a different city or check back later.</p>
        </div>
      )}
      {!error && hotels.length > 0 && (
        <div className="hotels-virtual-list">
          <AutoSizer>
            {({ height, width }) => (
              <List
                height={height}
                itemCount={hotels.length}
                itemSize={ITEM_HEIGHT}
                width={width}
                onScroll={handleScroll}
                ref={listRef}
              >
                {Row}
              </List>
            )}
          </AutoSizer>
          {loading && <div className="loading more">Loading more hotels...</div>}
        </div>
      )}
    </div>
  );
};

export default CityHotels;
