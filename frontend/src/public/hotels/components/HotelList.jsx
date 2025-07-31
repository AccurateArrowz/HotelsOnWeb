import React from 'react';
import PropTypes from 'prop-types';
import styles from './HotelList.module.css';
import { hotelFallbackImg } from '../../../assets';

/**
 * Renders a list of hotels as cards.
 * Expects an array of hotel objects via the `hotels` prop.
 */
const HotelList = ({ hotels }) => {
  if (!hotels || hotels.length === 0) return null;

  return (
    <div className={styles.hotelList}>
      {hotels.map(hotel => (
        <div className={styles.hotelCard} key={hotel.id}>
          <div className={styles.hotelImageWrapper}>
            <img
              src={hotel.hotelImg || hotelFallbackImg}
              alt={hotel.name}
              className={styles.hotelImage}
              loading="lazy"
            />
          </div>
          <div className={styles.hotelCardContent}>
            <h2 className={styles.hotelName}>{hotel.name}</h2>
            <div className={styles.hotelAddress}>{hotel.address}</div>
            <div className={styles.hotelInfoRow}>
              <span className={styles.hotelRating}>★ {hotel.rating ?? 4.5}</span>
              {hotel.price && (
                <span className={styles.hotelPrice}>From {hotel.price}</span>
              )}
            </div>
          </div>
        </div>
      ))}
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
