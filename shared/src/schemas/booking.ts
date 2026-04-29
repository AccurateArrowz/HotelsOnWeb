export interface BookingRoom {
  id: number;
  roomTypeId: number;
  roomId?: number;
  pricePerNight: number;
  numberOfNights: number;
  totalPrice: number;
  roomType?: {
    id: number;
    name: string;
    basePrice: number;
  };
  room?: {
    id: number;
    roomNumber: string;
  };
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Booking {
  id: number;
  userId: number;
  hotelId: number;
  bookingNumber: string;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  specialRequests?: string;
  cancelledAt?: string;
  cancelledBy?: number;
  createdAt: string;
  updatedAt: string;
  hotel?: {
    id: number;
    name: string;
    street: string;
    city: string;
    country: string;
  };
  bookingRooms?: BookingRoom[];
}

export interface CreateBookingRequest {
  hotelId: number;
  roomTypeId: number;
  checkInDate: string;
  checkOutDate: string;
  specialRequests?: string;
}

export interface CreateBookingResponse {
  id: number;
  bookingNumber: string;
  hotelId: number;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  hotel: {
    name: string;
    address: string;
    city: string;
  };
  bookingRooms: Array<{
    roomTypeId: number;
    quantity: number;
    pricePerNight: number;
    roomType: {
      name: string;
      basePrice: number;
    };
  }>;
}

export interface PaymentRequest {
  paymentMethod: string;
}

export interface PaymentResponse {
  id: number;
  bookingNumber: string;
  paymentStatus: 'paid' | 'failed';
  status: string;
}

export interface CancelBookingResponse {
  id: number;
  bookingNumber: string;
  status: 'cancelled';
  cancelledAt: string;
}
