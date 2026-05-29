import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetHotelByIdQuery } from '../hotelsApi';
import { useLazyGetHotelAvailabilityQuery } from '../availabilityApi';
import { useAuth, LoginForm, SignupForm } from '@features/auth';
import { Modal, Loading, ImageCarousel, TryAgainButton } from '@shared/components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './HotelDetails.css';
import {
  Waves, Users, Car, CigaretteOff, UtensilsCrossed, Bell,
  Wine, Coffee, ArrowUpDown, Dumbbell, Sparkles, Wifi, Bed, Baby,
  MapPin, Check, CreditCard, ShieldCheck, BadgeCheck, Banknote,
} from 'lucide-react';
import { formatDate, calculateNights } from '@hotelsonweb/shared';

// ---------------------------------------------------------------------------
// Helper: infer amenity chips from a room type name
// ---------------------------------------------------------------------------
const getRoomChips = (roomName = '') => {
  const name = roomName.toLowerCase();
  const chips = [
    { label: 'Wifi', color: 'chip-blue' },
    { label: 'AC', color: 'chip-teal' },
  ];
  if (name.includes('premium') || name.includes('suite') || name.includes('deluxe')) {
    chips.push({ label: 'Breakfast', color: 'chip-orange' });
    chips.push({ label: 'Spa Access', color: 'chip-purple' });
  }
  if (name.includes('suite') || name.includes('penthouse')) {
    chips.push({ label: 'Butler Service', color: 'chip-gold' });
  }
  if (name.includes('family')) {
    chips.push({ label: 'Extra Beds', color: 'chip-green' });
  }
  if (name.includes('business')) {
    chips.push({ label: 'Work Desk', color: 'chip-gray' });
  }
  return chips;
};

// ---------------------------------------------------------------------------
// Amenity icon map
// ---------------------------------------------------------------------------
const amenityIcons = {
  'Outdoor swimming pool': <Waves size={18} />,
  'Family rooms': <Users size={18} />,
  'Free parking': <Car size={18} />,
  'Non-smoking rooms': <CigaretteOff size={18} />,
  'Restaurant': <UtensilsCrossed size={18} />,
  'Room service': <Bell size={18} />,
  'Bar': <Wine size={18} />,
  'Breakfast': <Coffee size={18} />,
  'Elevator': <ArrowUpDown size={18} />,
  'Fitness center': <Dumbbell size={18} />,
  'Spa and wellness center': <Sparkles size={18} />,
  'Wifi': <Wifi size={18} />,
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
const HotelDetailsPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();

  const { data: hotel, isLoading: loading, error, refetch } = useGetHotelByIdQuery(id);
  const [fetchAvailability, { data: availabilityData, isFetching: availabilityLoading }] =
    useLazyGetHotelAvailabilityQuery();

  // ── Modal state ────────────────────────────────────────────────────────────
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [paymentInProgress, setPaymentInProgress] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState('');

  // ── Booking state ──────────────────────────────────────────────────────────
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [dateRange, setDateRange] = useState([null, null]);
  const [checkIn, checkOut] = dateRange;

  // roomCounts: { [roomTypeId]: number }
  const [roomCounts, setRoomCounts] = useState({});

  // ── Error / message state ──────────────────────────────────────────────────
  const [datesError, setDatesError] = useState('');
  const [roomError, setRoomError] = useState('');

  // ── Refs for scrolling to errors ───────────────────────────────────────────
  const errorRef = useRef(null);
  const tableRef = useRef(null);
  const bookingTimerRef = useRef(null);

  // Scroll to error banner whenever it appears
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

  // ── Fetch availability when both dates are chosen ──────────────────────────
  useEffect(() => {
    if (checkIn && checkOut && id) {
      fetchAvailability({
        hotelId: Number(id),
        checkInDate: formatDate(checkIn),
        checkOutDate: formatDate(checkOut),
      });
      // Clear date-related error when dates are now selected
      setDatesError('');
    }
  }, [checkIn, checkOut, id, fetchAvailability]);

  // ── Scroll to error helper ─────────────────────────────────────────────────
  // scrollToError is kept for imperative use; the useEffect above handles
  // the case where the DOM node isn't mounted yet on first trigger
  const scrollToError = (ref) => {
    setTimeout(() => {
      if (ref?.current) {
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 50);
  };

  // ── Early returns ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="hotel-details-page">
        <Loading size="large" message="Loading hotel details..." />
      </div>
    );
  }

  if (error) {
    const message = error?.data?.message || error?.error || 'Failed to fetch hotel details';
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

  // ── Image data ─────────────────────────────────────────────────────────────
  const primaryImage = hotel.images?.find((img) => img.isPrimary)?.imageUrl || hotel.image;
  const otherImages = hotel.images?.filter((img) => !img.isPrimary) || [];
  const allImages = primaryImage
    ? [primaryImage, ...otherImages.map((img) => img.imageUrl)]
    : otherImages.map((img) => img.imageUrl);

  // ── Price helpers ──────────────────────────────────────────────────────────
  const nights = calculateNights(checkIn, checkOut);
  const minBasePrice = hotel.roomTypes?.length
    ? Math.min(...hotel.roomTypes.map((r) => r.basePrice))
    : 0;

  const sidebarPrice = selectedRoomType ? selectedRoomType.basePrice : minBasePrice;
  const subtotal = nights > 0 ? sidebarPrice * nights : 0;
  const total = subtotal > 0 ? subtotal + SERVICE_FEE : 0;

  // ── Room type rows: merge static hotel data with availability data ──────────
  const baseRoomTypes = hotel.roomTypes || [];
  const availabilityMap = {};
  if (availabilityData?.roomTypes) {
    availabilityData.roomTypes.forEach((rt) => {
      availabilityMap[rt.roomTypeId] = rt;
    });
  }

  const mergedRoomTypes = baseRoomTypes.map((rt) => {
    const avail = availabilityMap[rt.id];
    const totalAvailable = avail?.totalAvailable;
    return {
      ...rt,
      availableRooms: totalAvailable ?? rt.totalRooms ?? null,
      isAvailable: totalAvailable == null ? true : totalAvailable > 0,
    };
  });

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleRoomCountChange = (roomTypeId, value) => {
    if (!checkIn || !checkOut) {
      setDatesError('Please select dates from the right sidebar first');
      scrollToError(errorRef);
      return;
    }
    setRoomCounts((prev) => ({ ...prev, [roomTypeId]: Number(value) }));
  };

  const handleRoomDropdownAttempt = (event) => {
    if (checkIn && checkOut) {
      return;
    }

    event.preventDefault();
    setDatesError('Please select dates from the right sidebar first');
    scrollToError(errorRef);
  };

  const handleSelectRoom = (roomType) => {
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
      // Scroll to error which is above the table
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

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="hotel-details-page">
      {/* ── Full-width Carousel ────────────────────────────────────────────── */}
      {allImages.length > 0 && (
        <div className="hotel-carousel-wrapper">
          <ImageCarousel images={allImages} alt={`${hotel.name} photo`} />
        </div>
      )}

      {/* ── Two-column layout ──────────────────────────────────────────────── */}
      <div className="hotel-details-layout">

        {/* ════════════════════════════════════════════════════════════════════
            LEFT — Main content
        ════════════════════════════════════════════════════════════════════ */}
        <div className="hotel-main-content">

          {/* Hotel name + location */}
          <h1 className="hotel-title">{hotel.name}</h1>
          <p className="hotel-location">
            <MapPin size={16} className="location-icon" />
            {hotel.street}, {hotel.city}
          </p>

          {/* About */}
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
                      {amenityIcons[amenity] || <Bed size={18} />}
                    </span>
                    <span className="amenity-name">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Available Rooms Table ──────────────────────────────────────── */}
          <div className="rooms-section" ref={tableRef}>
            <h2>Available Rooms</h2>

            {/* Error banner — anchored here so scrollIntoView lands above table */}
            {(datesError || roomError) && (
              <div className="dates-required-msg" ref={errorRef}>
                {datesError || roomError}
              </div>
            )}

            {availabilityLoading && (
              <div className="availability-loading">Checking availability…</div>
            )}

            {mergedRoomTypes.length === 0 ? (
              <div className="no-rooms">No room types found for this hotel.</div>
            ) : (
              <div className="rooms-table-wrapper">
                <table className="rooms-table">
                  <thead>
                    <tr>
                      <th>Room Type</th>
                      <th>Price</th>
                      <th>Rooms</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {mergedRoomTypes.map((roomType) => {
                      const chips = getRoomChips(roomType.name);
                      const adultCapacity = roomType.adults ?? roomType.maxAdults ?? null;
                      const childrenCapacity = roomType.children ?? roomType.maxChildren ?? null;
                      const count = roomCounts[roomType.id] ?? '';
                      const isSelected = selectedRoomType?.id === roomType.id;
                      const maxRooms = (checkIn && checkOut && roomType.availableRooms != null)
                        ? Math.max(1, roomType.availableRooms)
                        : 5;
                      const unavailable = checkIn && checkOut && !roomType.isAvailable;

                      return (
                        <tr
                          key={roomType.id}
                          className={`room-row ${isSelected ? 'room-row--selected' : ''} ${unavailable ? 'room-row--unavailable' : ''}`}
                        >
                          {/* Room name + chips */}
                          <td className="room-name-cell">
                            <div className="room-name">{roomType.name}</div>
                            <div className="room-chips">
                              {chips.map((chip) => (
                                <span key={chip.label} className={`room-type-chip ${chip.color}`}>
                                  {chip.label}
                                </span>
                              ))}
                            </div>
                            <div className="room-capacity">
                              {adultCapacity != null && (
                                <span className="room-capacity-item">
                                  <Users size={14} />
                                  <span>{adultCapacity} Adult{adultCapacity !== 1 ? 's' : ''}</span>
                                </span>
                              )}
                              {childrenCapacity != null && (
                                <span className="room-capacity-item">
                                  <Baby size={14} />
                                  <span>{childrenCapacity} Child{childrenCapacity !== 1 ? 'ren' : ''}</span>
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Price */}
                          <td className="room-price-cell">
                            <span className="room-price">Rs.{roomType.basePrice}</span>
                            <span className="room-price-unit"> / night</span>
                          </td>

                          {/* Room count dropdown */}
                          <td className="room-count-cell">
                            {unavailable ? (
                              <span className="unavailable-label">Unavailable</span>
                            ) : (
                              <select
                                className="rooms-select"
                                value={count}
                                onMouseDown={handleRoomDropdownAttempt}
                                onKeyDown={(event) => {
                                  if ((!checkIn || !checkOut) && ['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
                                    handleRoomDropdownAttempt(event);
                                  }
                                }}
                                onChange={(e) => handleRoomCountChange(roomType.id, e.target.value)}
                                aria-label={`Number of ${roomType.name} rooms`}
                              >
                                {!checkIn || !checkOut ? <option value="" disabled hidden /> : null}
                                {Array.from({ length: maxRooms }, (_, i) => i + 1).map((n) => (
                                  <option key={n} value={n}>{n}</option>
                                ))}
                              </select>
                            )}
                          </td>

                          {/* Select button */}
                          <td className="room-action-cell">
                            <button
                              className={`select-room-btn ${isSelected ? 'selected' : ''}`}
                              onClick={() => handleSelectRoom(roomType)}
                              disabled={!!unavailable}
                            >
                              {isSelected ? (
                                <>
                                  <Check size={15} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                                  Selected
                                </>
                              ) : (
                                'Select'
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            RIGHT — Sticky booking sidebar
        ════════════════════════════════════════════════════════════════════ */}
        <aside className="hotel-booking-sidebar">
          <div className="sidebar-card">

            {/* Price display */}
            <div className="sidebar-price-row">
              <span className="sidebar-price">Rs.{sidebarPrice.toLocaleString()}</span>
              <span className="sidebar-price-label"> / night</span>
            </div>
            {selectedRoomType && (
              <div className="sidebar-selected-room">
                {selectedRoomType.name}
              </div>
            )}

            {/* Date pickers */}
            <div className="sidebar-dates">
              <div className="sidebar-date-field">
                <label className="sidebar-date-label">Check-in</label>
                <DatePicker
                  selected={checkIn}
                  onChange={(dates) => {
                    setDateRange(dates);
                    setSelectedRoomType(null);
                  }}
                  selectsRange
                  startDate={checkIn}
                  endDate={checkOut}
                  minDate={new Date()}
                  dateFormat="MMM d, yyyy"
                  placeholderText="Add date"
                  className="sidebar-date-input"
                  popperPlacement="bottom-start"
                />
              </div>
              <div className="sidebar-date-field">
                <label className="sidebar-date-label">Check-out</label>
                <DatePicker
                  selected={checkOut}
                  onChange={(dates) => {
                    setDateRange(dates);
                    setSelectedRoomType(null);
                  }}
                  selectsRange
                  startDate={checkIn}
                  endDate={checkOut}
                  minDate={checkIn || new Date()}
                  dateFormat="MMM d, yyyy"
                  placeholderText="Add date"
                  className="sidebar-date-input"
                  popperPlacement="bottom-end"
                />
              </div>
            </div>

            {/* Price breakdown — shown only when dates are selected */}
            {nights > 0 && (
              <div className="sidebar-breakdown">
                <div className="breakdown-row">
                  <span>
                    Rs.{sidebarPrice.toLocaleString()} × {nights} night{nights !== 1 ? 's' : ''}
                  </span>
                  <span>Rs.{subtotal.toLocaleString()}</span>
                </div>
                <div className="breakdown-row">
                  <span>Service fee</span>
                  <span>Rs.{SERVICE_FEE.toLocaleString()}</span>
                </div>
                <div className="breakdown-divider" />
                <div className="breakdown-row breakdown-total">
                  <span>Total</span>
                  <span>Rs.{total.toLocaleString()}</span>
                </div>
              </div>
            )}

            {/* Book Now button */}
            <button type="button" className="sidebar-book-btn" onClick={handleBookNow}>
              Book Now
            </button>
            <p className="sidebar-no-charge">You won't be charged yet</p>
          </div>
        </aside>
      </div>

      {/* ── Modals ──────────────────────────────────────────────────────────── */}
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

      <Modal
        isOpen={bookingModalOpen}
        onClose={handleCloseBookingModal}
        size="lg"
        className="booking-confirmation-modal"
      >
        <div className="booking-confirmation">
          <div className="booking-confirmation__hero">
            <div className="booking-confirmation__icon-wrap">
              {bookingConfirmed ? <BadgeCheck size={28} /> : <CreditCard size={28} />}
            </div>
            <div>
              <p className="booking-confirmation__eyebrow">
                {bookingConfirmed ? 'Booking confirmed' : 'Secure payment'}
              </p>
              <h2 className="booking-confirmation__title">
                {bookingConfirmed ? 'Your stay is locked in' : 'Choose a payment option'}
              </h2>
              <p className="booking-confirmation__subtitle">
                {bookingConfirmed
                  ? 'This is a local simulation. No payment was sent to the server.'
                  : 'Review the trip summary below, then simulate a completed booking.'}
              </p>
            </div>
          </div>

          <div className="booking-confirmation__grid">
            <section className="booking-confirmation__panel booking-confirmation__panel--summary">
              <h3>Trip summary</h3>
              <div className="booking-confirmation__line">
                <span>Hotel</span>
                <strong>{hotel.name}</strong>
              </div>
              <div className="booking-confirmation__line">
                <span>Room</span>
                <strong>{selectedRoomType?.name}</strong>
              </div>
              <div className="booking-confirmation__line">
                <span>Dates</span>
                <strong>{checkIn && checkOut ? `${formatDate(checkIn)} → ${formatDate(checkOut)}` : 'Not selected'}</strong>
              </div>
              <div className="booking-confirmation__line">
                <span>Nights</span>
                <strong>{nights}</strong>
              </div>
              <div className="booking-confirmation__line booking-confirmation__line--total">
                <span>Total due</span>
                <strong>Rs.{total.toLocaleString()}</strong>
              </div>
            </section>

            <section className="booking-confirmation__panel">
              {!bookingConfirmed ? (
                <>
                  <h3>Payment method</h3>
                  <div className="payment-options">
                    <button
                      type="button"
                      className={`payment-option ${paymentMethod === 'credit_card' ? 'payment-option--active' : ''}`}
                      onClick={() => setPaymentMethod('credit_card')}
                    >
                      <CreditCard size={18} />
                      <span>
                        <strong>Credit card</strong>
                        <small>Instant approval simulation</small>
                      </span>
                    </button>
                    <button
                      type="button"
                      className={`payment-option ${paymentMethod === 'bank_transfer' ? 'payment-option--active' : ''}`}
                      onClick={() => setPaymentMethod('bank_transfer')}
                    >
                      <Banknote size={18} />
                      <span>
                        <strong>Bank transfer</strong>
                        <small>Queued but confirmed here</small>
                      </span>
                    </button>
                  </div>

                  <div className="booking-confirmation__note">
                    <ShieldCheck size={18} />
                    <span>Payment Simulation only.</span>
                  </div>

                  <div className="booking-confirmation__actions">
                    <button
                      type="button"
                      className="secondary-button booking-confirmation__secondary"
                      onClick={handleCloseBookingModal}
                      disabled={paymentInProgress}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="primary-button booking-confirmation__primary"
                      onClick={handleConfirmBooking}
                      disabled={paymentInProgress}
                    >
                      {paymentInProgress ? 'Processing...' : `Pay Rs.${total.toLocaleString()}`}
                    </button>
                  </div>
                </>
              ) : (
                <div className="booking-confirmation__success">
                  <div className="booking-confirmation__success-badge">
                    <BadgeCheck size={30} />
                  </div>
                  <h3>Booking confirmed</h3>
                  <p>
                    Confirmation number <strong>{confirmationNumber}</strong>
                  </p>
                  <p>
                    {selectedRoomType?.name} at {hotel.name} is ready for your dates.
                  </p>
                  <div className="booking-confirmation__success-actions">
                    <button
                      type="button"
                      className="primary-button booking-confirmation__primary"
                      onClick={handleCloseBookingModal}
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default HotelDetailsPage;
