import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useCreateBookingMutation, useProcessPaymentMutation } from '../bookingsApi';
import Spinner from '@shared/components/Spinner';
import '../../../styles/bookingModal.css';

const BookingForm = ({ hotel, roomType, onClose }) => {
  const [createBooking, { isLoading: isCreating }] = useCreateBookingMutation();
  const [processPayment, { isLoading: isPaying }] = useProcessPaymentMutation();

  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [specialRequests, setSpecialRequests] = useState('');
  const [error, setError] = useState('');
  const [booking, setBooking] = useState(null);
  const [paymentStep, setPaymentStep] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSpecialRequestsChange = (e) => {
    setSpecialRequests(e.target.value);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const calculateNights = () => {
    if (startDate && endDate) {
      const diffTime = endDate - startDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    }
    return 0;
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    return nights * roomType.basePrice;
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const result = await createBooking({
        hotelId: hotel.id,
        roomTypeId: roomType.id,
        checkInDate: formatDate(startDate),
        checkOutDate: formatDate(endDate),
        specialRequests: specialRequests,
      }).unwrap();

      setBooking(result);
      setPaymentStep(true);
    } catch (err) {
      setError(err?.data?.message || 'Failed to create booking. Please try again.');
    }
  };

  const handlePayment = async () => {
    if (!booking) return;
    
    setError('');

    try {
      await processPayment({
        id: booking.id,
        paymentMethod: 'credit_card',
      }).unwrap();

      setPaymentSuccess(true);
    } catch (err) {
      setError(err?.data?.message || 'Payment failed. Please try again.');
    }
  };

  const resetForm = () => {
    setDateRange([null, null]);
    setSpecialRequests('');
    setError('');
    setBooking(null);
    setPaymentStep(false);
    setPaymentSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose?.();
  };

  return (
    <>
      {error && <div className="error-message">{error}</div>}

      {paymentSuccess ? (
        <div className="success-content">
          <h2 className="form-title">Book Room</h2>
          <div className="success-icon">✓</div>
          <h3>Payment Successful!</h3>
          <p>Your booking has been confirmed.</p>
          <div className="booking-details">
            <p><strong>Booking Number:</strong> {booking?.bookingNumber}</p>
            <p><strong>Hotel:</strong> {hotel.name}</p>
            <p><strong>Room:</strong> {roomType.name}</p>
            <p><strong>Check-in:</strong> {formatDate(startDate)}</p>
            <p><strong>Check-out:</strong> {formatDate(endDate)}</p>
            <p><strong>Total:</strong> Rs.{calculateTotal()}</p>
          </div>
          <button className="primary-button" onClick={handleClose}>
            Close
          </button>
        </div>
      ) : paymentStep ? (
        <div className="payment-content">
          <h2 className="form-title">Book Room</h2>
          <div className="booking-summary">
            <h3>Booking Summary</h3>
            <div className="summary-item">
              <span>Hotel:</span>
              <span>{hotel.name}</span>
            </div>
            <div className="summary-item">
              <span>Room:</span>
              <span>{roomType.name}</span>
            </div>
            <div className="summary-item">
              <span>Check-in:</span>
              <span>{formatDate(startDate)}</span>
            </div>
            <div className="summary-item">
              <span>Check-out:</span>
              <span>{formatDate(endDate)}</span>
            </div>
            <div className="summary-item">
              <span>Nights:</span>
              <span>{calculateNights()}</span>
            </div>
            <div className="summary-item total">
              <span>Total:</span>
              <span>Rs.{calculateTotal()}</span>
            </div>
          </div>

          <div className="payment-section">
            <h3>Payment Information</h3>
            <div className="payment-method">
              <p>Payment Method: Credit Card (Simulated)</p>
              <p className="payment-note">
                This is a payment simulation. No real transaction will be processed.
              </p>
            </div>

            <div className="payment-actions">
              <button
                className="secondary-button"
                onClick={() => setPaymentStep(false)}
                disabled={isPaying}
              >
                Back
              </button>
              <button
                className="primary-button"
                onClick={handlePayment}
                disabled={isPaying}
              >
                {isPaying ? (
                  <div className="flex items-center justify-center gap-2">
                    <Spinner size="small" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  'Pay Now'
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleBookingSubmit} className="booking-form">
          <h2 className="form-title">Book Room</h2>
          <div className="hotel-info">
            <h3>{hotel.name}</h3>
            <p>{hotel.street}, {hotel.city}</p>
            <div className="room-info">
              <strong>{roomType.name}</strong> - Rs.{roomType.basePrice}/night
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="dateRange">Select Dates</label>
            <DatePicker
              id="dateRange"
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setDateRange(update)}
              minDate={new Date()}
              dateFormat="yyyy-MM-dd"
              placeholderText="Click to select check-in and check-out dates"
              className="date-picker-input"
              popperPlacement="bottom-start"
              monthsShown={2}
            />
          </div>

          {calculateNights() > 0 && (
            <div className="booking-summary">
              <div className="summary-item">
                <span>Nights:</span>
                <span>{calculateNights()}</span>
              </div>
              <div className="summary-item total">
                <span>Total:</span>
                <span>Rs.{calculateTotal()}</span>
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="specialRequests">Special Requests (Optional)</label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              value={specialRequests}
              onChange={handleSpecialRequestsChange}
              placeholder="Any special requests or preferences..."
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={handleClose}
              disabled={isCreating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="primary-button"
              disabled={isCreating || calculateNights() <= 0}
            >
              {isCreating ? (
                <div className="flex items-center justify-center gap-2">
                  <Spinner size="small" />
                  <span>Creating Booking...</span>
                </div>
              ) : (
                'Continue to Payment'
              )}
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default BookingForm;
