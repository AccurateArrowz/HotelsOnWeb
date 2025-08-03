import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchHotelById } from '../../../services/api';
import { useAuth } from '../../../auth/AuthContext';
import { LoginModal } from '../../../auth/components/LoginModal';
import { SignupModal } from '../../../auth/components/SignupModal';
import BookingModal from '../../../components/BookingModal';
import './HotelDetails.css';
import { MdPool, MdFamilyRestroom, MdLocalParking, MdSmokeFree, MdRestaurant, MdRoomService, MdLocalBar, MdFreeBreakfast, MdElevator, MdFitnessCenter, MdSpa, MdWifi } from 'react-icons/md';
import { FaBed } from 'react-icons/fa';

const HotelDetailsPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState(null);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchHotelById(id);
        console.log("individual hotel:", data);
        setHotel(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch hotel details');
        setHotel(null);
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id]);

  if (loading) {
    return <div className="hotel-details-page"><div className="loading">Loading hotel details...</div></div>;
  }

  if (error) {
    return (
      <div className="hotel-details-page">
        <div className="error">
          <span>Error: {error}</span>
          <button className="try-again-btn" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return <div className="hotel-details-page"><div className="not-found">Hotel not found.</div></div>;
  }

  const primaryImage = hotel.images?.find(img => img.isPrimary)?.imageUrl || hotel.image;
  const otherImages = hotel.images?.filter(img => !img.isPrimary) || [];

  // Map amenity names to appropriate icons from react-icons
  const amenityIcons = {
    "Outdoor swimming pool": <MdPool />,
    "Family rooms": <MdFamilyRestroom />,
    "Free parking": <MdLocalParking />,
    "Non-smoking rooms": <MdSmokeFree />,
    "Restaurant": <MdRestaurant />,
    "Room service": <MdRoomService />,
    "Bar": <MdLocalBar />,
    "Breakfast": <MdFreeBreakfast />,
    "Elevator": <MdElevator />,
    "Fitness center": <MdFitnessCenter />,
    "Spa and wellness center": <MdSpa />,
    "Wifi": <MdWifi />
  };

  const handleBookNow = (roomType) => {
    if (!isAuthenticated) {
      setLoginModalOpen(true);
    } else {
      setSelectedRoomType(roomType);
      setBookingModalOpen(true);
    }
  };

  return (
    <div className="hotel-details-page">
      {/* Image Gallery */}
      <div className="image-gallery">
        <div className="primary-image">
          <img src={primaryImage} alt={hotel.name} />
        </div>
        {otherImages.length > 0 && (
          <div className="image-grid">
            {otherImages.slice(0, 3).map((image, index) => (
              <div key={image.id} className="grid-image">
                <img src={image.imageUrl} alt={`${hotel.name} ${index + 2}`} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hotel Info */}
      <div className="hotel-info-section">
        <h1>{hotel.name}</h1>
        <p className="location">{hotel.street}, {hotel.city}</p>
        
        {/* Description */}
        <div className="description-section">
          <h2>About this property</h2>
          <p>{hotel.description}</p>
        </div>

        {/* Amenities */}
        {hotel.amenities && hotel.amenities.length > 0 && (
          <div className="amenities-section">
            <h2>Amenities</h2>
            <div className="amenities-grid">
              {hotel.amenities.map((amenity, index) => (
                <div key={index} className="amenity-item">
                  <span className="amenity-icon">
                    {amenityIcons[amenity] || <FaBed />}
                  </span>
                  <span className="amenity-name">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Rooms Section */}
      <div className="rooms-section">
        <h2>Available Rooms</h2>
        <div className="rooms-grid">
          {hotel.roomTypes && hotel.roomTypes.length > 0 ? hotel.roomTypes.map((roomType) => (
            <div key={roomType.id} className="room-card">
              <h3>{roomType.name}</h3>
              <p className="price">Rs.{roomType.basePrice} / night</p>
              <button className="book-btn" onClick={() => handleBookNow(roomType)}>Book Now</button>
            </div>
          )) : <div>No rooms available.</div>}
        </div>
      </div>

      <LoginModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSwitchToSignup={() => {
          setLoginModalOpen(false);
          setSignupModalOpen(true);
        }}
      />

      <SignupModal
        open={signupModalOpen}
        onClose={() => setSignupModalOpen(false)}
        onSwitchToLogin={() => {
          setSignupModalOpen(false);
          setLoginModalOpen(true);
        }}
      />

      <BookingModal
        open={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        hotel={hotel}
        roomType={selectedRoomType}
      />
    </div>
  );
};

export default HotelDetailsPage;
