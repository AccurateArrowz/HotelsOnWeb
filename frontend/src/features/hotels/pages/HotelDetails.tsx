import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { RoomType, Hotel } from '@hotelsonweb/shared';
import { useGetHotelByIdQuery, useLazyGetHotelAvailabilityQuery } from '../api';
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

interface Chip {
  label: string;
  color: string;
}

const getRoomChips = (roomName = ''): Chip[] => {
  const name = roomName.toLowerCase();
  const chips: Chip[] = [
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

const amenityIcons: Record<string, React.ReactNode> = {
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


const HotelDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();

  const { data: hotel, isLoading: loading, error, refetch } = useGetHotelByIdQuery(id);
  const [fetchAvailability, { data: availabilityData, isFetching: availabilityLoading }] =
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
    const message = (error as any)?.data?.message || (error as any)?.error || 'Failed to fetch hotel details';
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

  const primaryImage = (hotel as any).images?.find((img: any) => img.isPrimary)?.imageUrl || (hotel as any).image;
  const otherImages = (hotel as any).images?.filter((img: any) => !img.isPrimary) || [];
  const allImages = primaryImage
    ? [primaryImage, ...otherImages.map((img: any) => img.imageUrl)]
    : otherImages.map((img: any) => img.imageUrl);

  const nights = calculateNights(checkIn, checkOut);
  const minBasePrice = (hotel as any).roomTypes?.length
    ? Math.min(...(hotel as any).roomTypes.map((r: any) => r.basePrice))
    : 0;

  const sidebarPrice = selectedRoomType ? selectedRoomType.basePrice : minBasePrice;
  const subtotal = nights > 0 ? sidebarPrice * nights : 0;
  const total = subtotal > 0 ? subtotal + SERVICE_FEE : 0;

  const baseRoomTypes = (hotel as any).roomTypes || [];
  const availabilityMap: Record<string | number, any> = {};
  if (availabilityData?.roomTypes) {
    availabilityData.roomTypes.forEach((rt: any) => {
      availabilityMap[rt.roomTypeId] = rt;
    });
  }

  const mergedRoomTypes: RoomType[] = baseRoomTypes.map((rt: any) => {
    const avail = availabilityMap[rt.id];
    const totalAvailable = avail?.totalAvailable;
    return {
      ...rt,
      availableRooms: totalAvailable ?? rt.totalRooms ?? null,
      isAvailable: totalAvailable == null ? true : totalAvailable > 0,
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
          <ImageCarousel images={allImages} alt={`${(hotel as any).name} photo`} />
        </div>
      )}

      <div className="hotel-details-layout">
        <div className="hotel-main-content">
          <h1 className="hotel-title">{(hotel as any).name}</h1>
          <p className="hotel-location">
            <MapPin size={16} className="location-icon" />
            {(hotel as any).street}, {(hotel as any).city}
          </p>

          <div className="description-section">
            <h2>About this property</h2>
            <p>{(hotel as any).description}</p>
          </div>

          {(hotel as any).amenities && (hotel as any).amenities.length > 0 && (
            <div className="amenities-section">
              <h2>Amenities</h2>
              <div className="amenities-grid">
                {(hotel as any).amenities.map((amenity: string, index: number) => (
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

          <div className="rooms-section" ref={tableRef}>
            <h2>Available Rooms</h2>

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

                          <td className="room-price-cell">
                            <span className="room-price">Rs.{roomType.basePrice}</span>
                            <span className="room-price-unit"> / night</span>
                          </td>

                          <td className="room-count-cell">
                            {unavailable ? (
                              <span className="unavailable-label">Unavailable</span>
                            ) : (
                              <select
                                className="rooms-select"
                                value={count}
                                onMouseDown={handleRoomDropdownAttempt as any}
                                onKeyDown={(event) => {
                                  if ((!checkIn || !checkOut) && ['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
                                    handleRoomDropdownAttempt(event as any);
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

        <aside className="hotel-booking-sidebar">
          <div className="sidebar-card">
            <div className="sidebar-price-row">
              <span className="sidebar-price">Rs.{sidebarPrice.toLocaleString()}</span>
              <span className="sidebar-price-label"> / night</span>
            </div>
            {selectedRoomType && (
              <div className="sidebar-selected-room">
                {selectedRoomType.name}
              </div>
            )}

            <div className="sidebar-dates">
              <div className="sidebar-date-field">
                <label className="sidebar-date-label">Check-in</label>
                <DatePicker
                  selected={checkIn}
                  onChange={(dates: any) => {
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
                  onChange={(dates: any) => {
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

            <button type="button" className="sidebar-book-btn" onClick={handleBookNow}>
              Book Now
            </button>
            <p className="sidebar-no-charge">You won't be charged yet</p>
          </div>
        </aside>
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
                <strong>{(hotel as any).name}</strong>
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
                    {selectedRoomType?.name} at {(hotel as any).name} is ready for your dates.
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
