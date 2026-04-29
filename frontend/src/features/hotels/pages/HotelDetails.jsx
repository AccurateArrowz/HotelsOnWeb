import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetHotelByIdQuery } from '../hotelsApi';
import { useAuth, LoginForm, SignupForm } from '@features/auth';
import { BookingForm } from '@bookings/components';
import { Modal, Loading, ImageCarousel } from '@shared/components';
import './HotelDetails.css';
import { MdPool, MdFamilyRestroom, MdLocalParking, MdSmokeFree, MdRestaurant, MdRoomService, MdLocalBar, MdFreeBreakfast, MdElevator, MdFitnessCenter, MdSpa, MdWifi } from 'react-icons/md';
import { FaBed } from 'react-icons/fa';
import RoomCard from '../components/RoomCard';

const HotelDetailsPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const {
    data: hotel,
    isLoading: loading,
    error,
  } = useGetHotelByIdQuery(id);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState(null);

  if (loading) {
    return (
      <div className="hotel-details-page">
        <Loading size="large" message="Loading hotel details..." />
      </div>
    );
  }

  if (error) {
    const message = error?.data?.message || error?.error || 'Failed to fetch hotel details';
    return <div className="hotel-details-page"><div className="error">{message}</div></div>;
  }

  if (!hotel) {
    return <div className="hotel-details-page"><div className="not-found">Hotel not found.</div></div>;
  }

  const primaryImage = hotel.images?.find(img => img.isPrimary)?.imageUrl || hotel.image;
  const otherImages = hotel.images?.filter(img => !img.isPrimary) || [];

  // Prepare all images for carousel: primary first, then others
  const allImages = primaryImage
    ? [primaryImage, ...otherImages.map(img => img.imageUrl)]
    : otherImages.map(img => img.imageUrl);

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
      {allImages.length > 0 && (
        <div className="hotel-carousel-wrapper">
          <ImageCarousel
            images={allImages}
            alt={`${hotel.name} photo`}
          />
        </div>
      )}

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
            <RoomCard key={roomType.id} roomType={roomType} onBookNow={()=>handleBookNow(roomType)}>
            </RoomCard>
          )) : <div>No rooms available.</div>}
        </div>
      </div>

      <Modal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} size="md" className="login-modal">
        <LoginForm
          onSuccess={() => setLoginModalOpen(false)}
          onSwitchToSignup={() => {
            setLoginModalOpen(false);
            setSignupModalOpen(true);
          }}
        />
      </Modal>

      <Modal isOpen={signupModalOpen} onClose={() => setSignupModalOpen(false)} size="md" className="signup-modal">
        <SignupForm
          onSuccess={() => setSignupModalOpen(false)}
          onSwitchToLogin={() => {
            setSignupModalOpen(false);
            setLoginModalOpen(true);
          }}
        />
      </Modal>

      <Modal isOpen={bookingModalOpen} onClose={() => setBookingModalOpen(false)} size="lg" className="booking-modal">
        <BookingForm
          hotel={hotel}
          roomType={selectedRoomType}
          onClose={() => setBookingModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default HotelDetailsPage;
