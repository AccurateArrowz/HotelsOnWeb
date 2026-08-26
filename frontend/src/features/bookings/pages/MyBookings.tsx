import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Booking } from '@hotelsonweb/shared';
import {
  useGetUserBookingsQuery,
  useCancelBookingMutation,
  useProcessPaymentMutation,
} from '@bookings/api';
import { Loading, Modal, TryAgainButton } from '@shared/components';

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'confirmed':
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getPaymentStatusColor = (status: string): string => {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    case 'refunded':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export default function MyBookings() {
  const { data: bookings, isLoading, error, refetch } = useGetUserBookingsQuery();
  const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation();
  const [processPayment, { isLoading: isProcessingPayment }] = useProcessPaymentMutation();

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [actionError, setActionError] = useState('');

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;

    try {
      setActionError('');
      await cancelBooking(selectedBooking.id).unwrap();
      setCancelModalOpen(false);
      setSelectedBooking(null);
      refetch();
    } catch (err: any) {
      setActionError(err?.data?.message || 'Failed to cancel booking');
    }
  };

  const handleProcessPayment = async () => {
    if (!selectedBooking) return;

    try {
      setActionError('');
      await processPayment(selectedBooking.id).unwrap();
      setPaymentModalOpen(false);
      setSelectedBooking(null);
      refetch();
    } catch (err: any) {
      setActionError(err?.data?.message || 'Failed to process payment');
    }
  };

  if (isLoading) {
    return <Loading size="large" message="Loading your bookings..." />;
  }

  if (error) {
    const message = (error as any)?.data?.message || 'Failed to load bookings';
    return (
      <div className="my-bookings-page">
        <div className="error">
          <span>{message}</span>
          <TryAgainButton onClick={refetch} variant="secondary" size="sm" />
        </div>
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="my-bookings-page">
        <div className="no-bookings">
          <h2>No bookings yet</h2>
          <p>Start exploring and book your perfect stay today!</p>
          <Link to="/hotels/kathmandu" className="primary-button">
            Browse Hotels
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="my-bookings-page">
      <h1>My Bookings</h1>
      <div className="bookings-list">
        {bookings.map((booking: Booking) => (
          <div key={booking.id} className="booking-card">
            <div className="booking-header">
              <h3>{(booking as any).hotelName}</h3>
              <span className={`status-badge ${getStatusColor(booking.status)}`}>
                {booking.status}
              </span>
            </div>
            <div className="booking-details">
              <p><strong>Check-in:</strong> {formatDate((booking as any).checkInDate)}</p>
              <p><strong>Check-out:</strong> {formatDate((booking as any).checkOutDate)}</p>
              <p><strong>Room:</strong> {(booking as any).roomTypeName}</p>
              <p><strong>Total:</strong> Rs.{(booking as any).totalPrice}</p>
            </div>
            <div className="booking-actions">
              {booking.paymentStatus === 'pending' && (
                <button
                  onClick={() => {
                    setSelectedBooking(booking);
                    setPaymentModalOpen(true);
                  }}
                  className="primary-button"
                  disabled={isProcessingPayment}
                >
                  {isProcessingPayment ? 'Processing...' : 'Pay Now'}
                </button>
              )}
              {booking.status === 'pending' && (
                <button
                  onClick={() => {
                    setSelectedBooking(booking);
                    setCancelModalOpen(true);
                  }}
                  className="secondary-button"
                  disabled={isCancelling}
                >
                  {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={paymentModalOpen} onClose={() => setPaymentModalOpen(false)} size="md">
        <div className="payment-modal">
          <h2>Complete Payment</h2>
          {actionError && <div className="error-message">{actionError}</div>}
          <p>Booking ID: {selectedBooking?.id}</p>
          <p>Amount: Rs.{(selectedBooking as any)?.totalPrice}</p>
          <div className="modal-actions">
            <button onClick={() => setPaymentModalOpen(false)} className="secondary-button">
              Cancel
            </button>
            <button onClick={handleProcessPayment} className="primary-button" disabled={isProcessingPayment}>
              {isProcessingPayment ? 'Processing...' : 'Confirm Payment'}
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={cancelModalOpen} onClose={() => setCancelModalOpen(false)} size="md">
        <div className="cancel-modal">
          <h2>Cancel Booking</h2>
          {actionError && <div className="error-message">{actionError}</div>}
          <p>Are you sure you want to cancel this booking?</p>
          <div className="modal-actions">
            <button onClick={() => setCancelModalOpen(false)} className="secondary-button">
              Keep Booking
            </button>
            <button onClick={handleCancelBooking} className="danger-button" disabled={isCancelling}>
              {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
