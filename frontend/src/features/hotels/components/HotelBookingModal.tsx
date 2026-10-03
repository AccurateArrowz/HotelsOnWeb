import React from 'react';
import { Modal } from '@shared/components';
import { BadgeCheck, CreditCard, Banknote, ShieldCheck } from 'lucide-react';
import { RoomType, formatDate } from '@hotelsonweb/shared';

interface HotelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotelName: string;
  selectedRoomType: RoomType | null;
  checkIn: Date | null;
  checkOut: Date | null;
  nights: number;
  total: number;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  paymentInProgress: boolean;
  handleConfirmBooking: () => void;
  bookingConfirmed: boolean;
  confirmationNumber: string;
}

export const HotelBookingModal: React.FC<HotelBookingModalProps> = ({
  isOpen,
  onClose,
  hotelName,
  selectedRoomType,
  checkIn,
  checkOut,
  nights,
  total,
  paymentMethod,
  setPaymentMethod,
  paymentInProgress,
  handleConfirmBooking,
  bookingConfirmed,
  confirmationNumber,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
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
              <strong>{hotelName}</strong>
            </div>
            <div className="booking-confirmation__line">
              <span>Room</span>
              <strong>{selectedRoomType?.name}</strong>
            </div>
            <div className="booking-confirmation__line">
              <span>Dates</span>
              <strong>
                {checkIn && checkOut
                  ? `${formatDate(checkIn)} → ${formatDate(checkOut)}`
                  : 'Not selected'}
              </strong>
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
                    className={`payment-option ${
                      paymentMethod === 'credit_card' ? 'payment-option--active' : ''
                    }`}
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
                    className={`payment-option ${
                      paymentMethod === 'bank_transfer' ? 'payment-option--active' : ''
                    }`}
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
                    onClick={onClose}
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
                    {paymentInProgress
                      ? 'Processing...'
                      : `Pay Rs.${total.toLocaleString()}`}
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
                  {selectedRoomType?.name} at {hotelName} is ready for your dates.
                </p>
                <div className="booking-confirmation__success-actions">
                  <button
                    type="button"
                    className="primary-button booking-confirmation__primary"
                    onClick={onClose}
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
  );
};
