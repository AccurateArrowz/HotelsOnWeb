import { Star } from 'lucide-react';
import { Hotel } from '@hotelsonweb/shared';
import styles from './HotelList.module.css';
import { hotelFallbackImg } from '../../../assets';

interface HotelListProps {
  hotels: Hotel[];
}

/**
 * Renders a list of hotels as cards.
 * Expects an array of hotel objects via the `hotels` prop.
 */
const HotelList = ({ hotels }: HotelListProps) => {
  if (!hotels || hotels.length === 0) return null;

  const generateRandomRating = (hotelId: string | number): string => {
    const seed = hotelId.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = (seed * 9301 + 49297) % 233280;
    const normalized = random / 233280;
    return (normalized * 2 + 3).toFixed(1);
  };

  const generateRandomPrice = (hotelId: string | number): number => {
    const seed = hotelId.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = (seed * 9301 + 49297) % 233280;
    const normalized = random / 233280;
    return Math.floor(normalized * 3501 + 1500);
  };

  const renderStars = (rating: string | number) => {
    const displayRating = Math.min(Math.max(Number(rating) || 0, 3), 5);
    const fullStars = Math.floor(displayRating);
    const hasHalfStar = displayRating % 1 >= 0.5;
    const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));

    return (
      <div className={styles.starRating}>
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
                src={hotel.image || hotelFallbackImg}
                alt={hotel.name}
                className={styles.hotelImage}
                loading="lazy"
              />
            </div>
            <div className={styles.hotelMainInfo}>
              <h2 className={styles.hotelName}>{hotel.name}</h2>
              <div className={styles.hotelAddress}>{hotel.street}</div>
              {hotel.description && (
                <p className={styles.hotelDescription}>{hotel.description}</p>
              )}
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

export default HotelList;
