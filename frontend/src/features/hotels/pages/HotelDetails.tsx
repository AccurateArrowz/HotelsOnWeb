import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { RoomType, Hotel, HotelImage } from '@hotelsonweb/shared';
import { useGetHotelByIdQuery, useLazyGetHotelAvailabilityQuery } from '../api';
import type { HotelAvailabilityData, RoomTypeAvailability } from '@hotelsonweb/shared';
interface ApiError {
  data?: { message?: string };
  error?: string;
}
import { useAuth, LoginForm, SignupForm } from '@features/auth';
import { Modal, Loading, ImageCarousel, TryAgainButton } from '@shared/components';
import './HotelDetails.css';
import { MapPin } from 'lucide-react';
import { formatDate, calculateNights } from '@hotelsonweb/shared';

import {
  HotelAmenities,
  HotelRoomsList,
  HotelBookingSidebar,
  HotelBookingModal,
} from '../components';

const HotelDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();

  const { data: hotel, isLoading: loading, error, refetch } = useGetHotelByIdQuery(id);
  const [fetchAvailability, { data: roomTypeWithAvailableRooms, isFetching: availabilityLoading }] =
    useLazyGetHotelAvailabilityQuery();

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [paymentInProgress, setPaymentInProgress] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState('');

  const [selectedRoomType, setSelectedRoomType] = useState<RoomType | null>(null);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [checkIn, checkOut] = dateRange;

  const [roomCounts, setRoomCounts] = useState<Record<string | number, number>>({});

  const [datesError, setDatesError] = useState('');
  const [roomError, setRoomError] = useState('');

  const errorRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const bookingTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if ((datesError || roomError) && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [datesError, roomError]);

  useEffect(() => {
    return () => {
      if (bookingTimerRef.current) {
        window.clearTimeout(bookingTimerRef.current);
      }
    };
  }, []);

  const SERVICE_FEE = 250;

  useEffect(() => {
    if (checkIn && checkOut && id) {
      fetchAvailability({
        hotelId: Number(id),
        checkInDate: formatDate(checkIn),
        checkOutDate: formatDate(checkOut),
      });
      setDatesError('');
    }
  }, [checkIn, checkOut, id, fetchAvailability]);

  const scrollToError = (ref: React.RefObject<HTMLDivElement>) => {
    setTimeout(() => {
      if (ref?.current) {
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 50);
  };

  if (loading) {
    return (
      <div className="hotel-details-page">
        <Loading size="large" message="Loading hotel details..." />
      </div>
    );
  }

  if (error) {
    const apiError = error as ApiError;
    const message = apiError?.data?.message || apiError?.error || 'Failed to fetch hotel details';
    return (
      <div className="hotel-details-page">
        <div className="error">
          <span>{message}</span>
          <div className="error-actions">
            <TryAgainButton onClick={refetch} variant="secondary" size="sm" />
          </div>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="hotel-details-page">
        <div className="not-found">Hotel not found.</div>
      </div>
    );
  }

  const typedHotel = hotel as Hotel & { image?: string };
  const primaryImage = typedHotel.images?.find((img: HotelImage) => img.isPrimary)?.imageUrl || typedHotel.image;
  const otherImages = typedHotel.images?.filter((img: HotelImage) => !img.isPrimary) || [];
  const allImages = primaryImage
    ? [primaryImage, ...otherImages.map((img: HotelImage) => img.imageUrl)]
    : otherImages.map((img: HotelImage) => img.imageUrl);

  const nights = calculateNights(checkIn, checkOut);
  const minBasePrice = typedHotel.roomTypes?.length
    ? Math.min(...typedHotel.roomTypes.map((r: RoomType) => r.basePrice))
    : 0;

  const sidebarPrice = selectedRoomType ? selectedRoomType.basePrice : minBasePrice;
  const subtotal = nights > 0 ? sidebarPrice * nights : 0;
  const total = subtotal > 0 ? subtotal + SERVICE_FEE : 0;

  const baseRoomTypes = typedHotel.roomTypes || [];
  const availabilityMap: Record<string, RoomTypeAvailability> = {}; //contains
  if (roomTypeWithAvailableRooms) {
    console.log('roomTypeWithAvailableRooms ', roomTypeWithAvailableRooms)
      roomTypeWithAvailableRooms.forEach((rt) => {
      availabilityMap[rt.roomTypeId] = rt;
    });
  }

  const mergedRoomTypes: RoomType[] = baseRoomTypes.map((rt: RoomType) => {
    const avail = availabilityMap[rt.id];

    return {
      ...rt,
      availableRooms: avail?.availableRooms ?? null,
      isAvailable:  (avail?.availableRooms ?? 0) > 0,
    };
  });

  const handleRoomCountChange = (roomTypeId: string | number, value: string) => {
    if (!checkIn || !checkOut) {
      setDatesError('Please select dates from the right sidebar first');
      scrollToError(errorRef);
      return;
    }
    setRoomCounts((prev) => ({ ...prev, [roomTypeId]: Number(value) }));
  };

  const handleRoomDropdownAttempt = (event: React.MouseEvent<HTMLSelectElement>) => {
    if (checkIn && checkOut) {
      return;
    }

    event.preventDefault();
    setDatesError('Please select dates from the right sidebar first');
    scrollToError(errorRef);
  };

  const handleSelectRoom = (roomType: RoomType) => {
    if (!checkIn || !checkOut) {
      setDatesError('Please select dates from the right sidebar first');
      scrollToError(errorRef);
      return;
    }
    setSelectedRoomType(roomType);
    setRoomError('');
  };

  const handleBookNow = () => {
    if (!selectedRoomType) {
      setRoomError('Please select a room type before booking.');
      scrollToError(errorRef);
      return;
    }
    if (!isAuthenticated) {
      setLoginModalOpen(true);
      return;
    }
    setBookingConfirmed(false);
    setConfirmationNumber('');
    setPaymentMethod('credit_card');
    setBookingModalOpen(true);
  };

  const handleConfirmBooking = async () => {
    setPaymentInProgress(true);
    setRoomError('');

    if (bookingTimerRef.current) {
      window.clearTimeout(bookingTimerRef.current);
    }

    bookingTimerRef.current = window.setTimeout(() => {
      const bookingCode = `BK-${Math.floor(100000 + Math.random() * 900000)}`;
      setConfirmationNumber(bookingCode);
      setBookingConfirmed(true);
      setPaymentInProgress(false);
      bookingTimerRef.current = null;
    }, 1400);
  };

  const handleCloseBookingModal = () => {
    if (bookingTimerRef.current) {
      window.clearTimeout(bookingTimerRef.current);
      bookingTimerRef.current = null;
    }
    setBookingModalOpen(false);
    setPaymentInProgress(false);
    setBookingConfirmed(false);
    setConfirmationNumber('');
  };

  return (
    <div className="hotel-details-page">
      {allImages.length > 0 && (
        <div className="hotel-carousel-wrapper">
          <ImageCarousel images={allImages} alt={`${typedHotel.name} photo`} />
        </div>
      )}

      <div className="hotel-details-layout">
        <div className="hotel-main-content">
          <h1 className="hotel-title">{typedHotel.name}</h1>
          <p className="hotel-location">
            <MapPin size={16} className="location-icon" />
            {typedHotel.street}, {typedHotel.city}
          </p>

          <div className="description-section">
            <h2>About this property</h2>
            <p>{typedHotel.description}</p>
          </div>

          <HotelAmenities amenities={typedHotel.amenities ?? []} />

          <HotelRoomsList
            rooms={mergedRoomTypes}
            checkIn={checkIn}
            checkOut={checkOut}
            selectedRoomType={selectedRoomType}
            roomCounts={roomCounts}
            handleSelectRoom={handleSelectRoom}
            handleRoomCountChange={handleRoomCountChange}
            handleRoomDropdownAttempt={handleRoomDropdownAttempt}
            errorRef={errorRef}
            tableRef={tableRef}
            availabilityLoading={availabilityLoading}
            datesError={datesError}
            roomError={roomError}
          />
        </div>

        <HotelBookingSidebar
          sidebarPrice={sidebarPrice}
          selectedRoomType={selectedRoomType}
          checkIn={checkIn}
          checkOut={checkOut}
          setDateRange={setDateRange}
          setSelectedRoomType={setSelectedRoomType}
          nights={nights}
          subtotal={subtotal}
          SERVICE_FEE={SERVICE_FEE}
          total={total}
          handleBookNow={handleBookNow}
        />
      </div>

      <Modal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        size="md"
        className="login-modal"
      >
        <LoginForm
          onSuccess={() => setLoginModalOpen(false)}
          onSwitchToSignup={() => {
            setLoginModalOpen(false);
            setSignupModalOpen(true);
          }}
        />
      </Modal>

      <Modal
        isOpen={signupModalOpen}
        onClose={() => setSignupModalOpen(false)}
        size="md"
        className="signup-modal"
      >
        <SignupForm
          onSuccess={() => setSignupModalOpen(false)}
          onSwitchToLogin={() => {
            setSignupModalOpen(false);
            setLoginModalOpen(true);
          }}
        />
      </Modal>

      <HotelBookingModal
        isOpen={bookingModalOpen}
        onClose={handleCloseBookingModal}
        hotelName={typedHotel.name}
        selectedRoomType={selectedRoomType}
        checkIn={checkIn}
        checkOut={checkOut}
        nights={nights}
        total={total}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        paymentInProgress={paymentInProgress}
        handleConfirmBooking={handleConfirmBooking}
        bookingConfirmed={bookingConfirmed}
        confirmationNumber={confirmationNumber}
      />
    </div>
  );
};

export default HotelDetailsPage;
