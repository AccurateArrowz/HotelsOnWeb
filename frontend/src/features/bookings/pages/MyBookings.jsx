import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  useGetUserBookingsQuery,
  useCancelBookingMutation,
  useProcessPaymentMutation,
} from '../bookingsApi';
import { Loading, Modal } from '@shared/components';

const getStatusColor = (status) => {
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

const getPaymentStatusColor = (status) => {
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

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export default function MyBookings() {
  const { data: bookings, isLoading, error } = useGetUserBookingsQuery();
  const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation();
  const [processPayment, { isLoading: isProcessingPayment }] = useProcessPaymentMutation();
  
  const [selectedBooking, setSelectedBooking] = useState(null);
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
    } catch (err) {
      setActionError(err?.data?.message || 'Failed to cancel booking');
    }
  };

  const handlePayment = async () => {
    if (!selectedBooking) return;
    
    try {
      setActionError('');
      await processPayment({ 
        id: selectedBooking.id, 
        paymentMethod: 'credit_card' 
      }).unwrap();
      setPaymentModalOpen(false);
      setSelectedBooking(null);
    } catch (err) {
      setActionError(err?.data?.message || 'Payment failed');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="large" message="Loading your bookings..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Bookings</h2>
          <p className="text-gray-600">Unable to fetch your bookings. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">My Bookings</h1>
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">No Bookings Yet</h2>
              <p className="text-gray-500 mb-6">You haven't made any hotel bookings yet.</p>
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Start Exploring Hotels
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>
        
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Hotel Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {booking.hotel?.name || 'Unknown Hotel'}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      {booking.hotel?.street}, {booking.hotel?.city}
                    </p>
                    <p className="text-sm text-gray-500">
                      Booking #{booking.bookingNumber}
                    </p>
                  </div>

                  {/* Dates & Price */}
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Check-in</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(booking.checkInDate)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Check-out</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(booking.checkOutDate)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
                      <p className="text-lg font-bold text-gray-900">Rs.{booking.totalAmount}</p>
                    </div>
                  </div>
                </div>

                {/* Room Details */}
                {booking.bookingRooms && booking.bookingRooms.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Room:</span>{' '}
                      {booking.bookingRooms[0].roomType?.name || 'Standard Room'}
                    </p>
                  </div>
                )}

                {/* Payment Status & Actions */}
                <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Payment:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
                      {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    {booking.status !== 'cancelled' && booking.paymentStatus === 'pending' && (
                      <button
                        onClick={() => {
                          setSelectedBooking(booking);
                          setPaymentModalOpen(true);
                        }}
                        disabled={isProcessingPayment}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                      >
                        Pay Now
                      </button>
                    )}
                    
                    {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                      <button
                        onClick={() => {
                          setSelectedBooking(booking);
                          setCancelModalOpen(true);
                        }}
                        disabled={isCancelling}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      <Modal
        isOpen={paymentModalOpen}
        onClose={() => {
          setPaymentModalOpen(false);
          setSelectedBooking(null);
          setActionError('');
        }}
        size="md"
        title="Complete Payment"
      >
        <div className="p-6">
          {actionError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {actionError}
            </div>
          )}
          
          {selectedBooking && (
            <div className="mb-6">
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Hotel:</span> {selectedBooking.hotel?.name}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Amount:</span> Rs.{selectedBooking.totalAmount}
              </p>
              <p className="text-sm text-gray-500">
                Payment method: Credit Card (simulated)
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => {
                setPaymentModalOpen(false);
                setSelectedBooking(null);
                setActionError('');
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={isProcessingPayment}
              className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {isProcessingPayment ? 'Processing...' : 'Confirm Payment'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Cancel Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => {
          setCancelModalOpen(false);
          setSelectedBooking(null);
          setActionError('');
        }}
        size="md"
        title="Cancel Booking"
      >
        <div className="p-6">
          {actionError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {actionError}
            </div>
          )}
          
          <p className="text-gray-600 mb-6">
            Are you sure you want to cancel this booking? This action cannot be undone.
          </p>

          {selectedBooking && (
            <div className="bg-gray-50 rounded-md p-4 mb-6">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Booking:</span> #{selectedBooking.bookingNumber}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Hotel:</span> {selectedBooking.hotel?.name}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => {
                setCancelModalOpen(false);
                setSelectedBooking(null);
                setActionError('');
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Keep Booking
            </button>
            <button
              onClick={handleCancelBooking}
              disabled={isCancelling}
              className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              {isCancelling ? 'Cancelling...' : 'Yes, Cancel'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
