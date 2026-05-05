import React from 'react';
import PropTypes from 'prop-types';
import { Star } from 'lucide-react';
import styles from './HotelList.module.css';
import { hotelFallbackImg } from '../../../assets';

/**
 * Renders a list of hotels as cards.
 * Expects an array of hotel objects via the `hotels` prop.
 */
const HotelList = ({ hotels }) => {
  if (!hotels || hotels.length === 0) return null;

  // Helper function to generate consistent random rating between 6-10 based on hotel ID
  const generateRandomRating = (hotelId) => {
    // Use hotel ID as seed for consistent random values
    const seed = hotelId.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = (seed * 9301 + 49297) % 233280;
    const normalized = random / 233280;
    return (normalized * 4 + 6).toFixed(1);
  };

  // Helper function to generate consistent random price between 1500-5000 based on hotel ID
  const generateRandomPrice = (hotelId) => {
    // Use hotel ID as seed for consistent random values
    const seed = hotelId.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = (seed * 9301 + 49297) % 233280;
    const normalized = random / 233280;
    return Math.floor(normalized * 3501 + 1500);
  };

  // Helper function to render star rating using Lucide icons
  const renderStars = (rating) => {
    // Ensure rating doesn't exceed 5 stars for display
    const displayRating = Math.min(rating, 5);
    const fullStars = Math.floor(displayRating);
    const hasHalfStar = displayRating % 1 >= 0.5;
    const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));

    return (
      <div className={styles.starRating}>
        {/* Full stars */}
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            size={18}
            fill="#fbbf24"
            stroke="#fbbf24"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        ))}
        {/* Half star */}
        {hasHalfStar && (
          <div style={{ position: 'relative', width: 18, height: 18 }}>
            <Star
              size={18}
              fill="#e5e7eb"
              stroke="#e5e7eb"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '50%',
                overflow: 'hidden',
              }}
            >
              <Star
                size={18}
                fill="#fbbf24"
                stroke="#fbbf24"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </div>
          </div>
        )}
        {/* Empty stars */}
        {[...Array(emptyStars)].map((_, i) => (
          <Star
            key={`empty-${i}`}
            size={18}
            fill="#e5e7eb"
            stroke="#e5e7eb"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        ))}
        <span className={styles.ratingText}>{rating}</span>
      </div>
    );
  };

  return (
    <div className={styles.hotelList}>
      {hotels.map(hotel => {
        const randomRating = generateRandomRating(hotel.id);
        const randomPrice = generateRandomPrice(hotel.id);
        
        return (
          <div className={styles.hotelCard} key={hotel.id}>
            <div className={styles.hotelImageWrapper}>
              <img
                src={hotel.hotelImg || hotelFallbackImg}
                alt={hotel.name}
                className={styles.hotelImage}
                loading="lazy"
              />
            </div>
            <div className={styles.hotelMainInfo}>
              <h2 className={styles.hotelName}>{hotel.name}</h2>
              <div className={styles.hotelAddress}>{hotel.street}</div>
            </div>
            <div className={styles.hotelDetails}>
              <div className={styles.ratingContainer}>
                {renderStars(randomRating)}
              </div>
              <div className={styles.priceContainer}>
                <span className={styles.hotelPrice}>From Rs.{randomPrice}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

HotelList.propTypes = {
  hotels: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      address: PropTypes.string,
      hotelImg: PropTypes.string,
      rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
};

export default HotelList;
