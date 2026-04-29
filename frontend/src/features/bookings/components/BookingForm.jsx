import { useState } from 'react';
import { useCreateBookingMutation, useProcessPaymentMutation } from '../bookingsApi';
import Spinner from '@shared/components/Spinner';
import '../../../styles/bookingModal.css';

const BookingForm = ({ hotel, roomType, onClose }) => {
  const [createBooking, { isLoading: isCreating }] = useCreateBookingMutation();
  const [processPayment, { isLoading: isPaying }] = useProcessPaymentMutation();

  const [formData, setFormData] = useState({
    checkInDate: '',
    checkOutDate: '',
    specialRequests: ''
  });
  const [error, setError] = useState('');
  const [booking, setBooking] = useState(null);
  const [paymentStep, setPaymentStep] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateNights = () => {
    if (formData.checkInDate && formData.checkOutDate) {
      const checkIn = new Date(formData.checkInDate);
      const checkOut = new Date(formData.checkOutDate);
      const diffTime = checkOut - checkIn;
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
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        specialRequests: formData.specialRequests,
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
    setFormData({
      checkInDate: '',
      checkOutDate: '',
      specialRequests: ''
    });
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
            <p><strong>Check-in:</strong> {formData.checkInDate}</p>
            <p><strong>Check-out:</strong> {formData.checkOutDate}</p>
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
              <span>{formData.checkInDate}</span>
            </div>
            <div className="summary-item">
              <span>Check-out:</span>
              <span>{formData.checkOutDate}</span>
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
                  <>
                    <span className="spinner"></span>
                    Processing...
                  </>
                {paymentLoading ? (
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
            <label htmlFor="checkInDate">Check-in Date</label>
            <input
              id="checkInDate"
              name="checkInDate"
              type="date"
              value={formData.checkInDate}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="checkOutDate">Check-out Date</label>
            <input
              id="checkOutDate"
              name="checkOutDate"
              type="date"
              value={formData.checkOutDate}
              onChange={handleInputChange}
              min={formData.checkInDate || new Date().toISOString().split('T')[0]}
              required
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
              value={formData.specialRequests}
              onChange={handleInputChange}
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
                <>
                  <span className="spinner"></span>
                  Creating Booking...
                </>
              {loading ? (
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
