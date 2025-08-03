const Booking = require('../models/Booking');
const BookingRoom = require('../models/BookingRoom');
const Hotel = require('../models/Hotel');
const RoomType = require('../models/RoomType');
const User = require('../models/User');

const bookingController = {
  // Create a new booking
  createBooking: async (req, res) => {
    try {
      const { hotelId, roomTypeId, checkInDate, checkOutDate, specialRequests } = req.body;
      const userId = req.user.id;

      // Validate dates
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (checkIn < today) {
        return res.status(400).json({ message: 'Check-in date cannot be in the past' });
      }

      if (checkOut <= checkIn) {
        return res.status(400).json({ message: 'Check-out date must be after check-in date' });
      }

      // Get hotel and room type details
      const hotel = await Hotel.findByPk(hotelId);
      if (!hotel) {
        return res.status(404).json({ message: 'Hotel not found' });
      }

      const roomType = await RoomType.findByPk(roomTypeId);
      if (!roomType) {
        return res.status(404).json({ message: 'Room type not found' });
      }

      // Calculate total amount (simplified calculation)
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      const totalAmount = roomType.basePrice * nights;

      // Create booking
      const booking = await Booking.create({
        userId,
        hotelId,
        checkInDate,
        checkOutDate,
        totalAmount,
        specialRequests,
        status: 'pending',
        paymentStatus: 'pending'
      });

      // Create booking room entry
      await BookingRoom.create({
        bookingId: booking.id,
        roomTypeId,
        quantity: 1,
        pricePerNight: roomType.basePrice
      });

      // Fetch complete booking data
      const completeBooking = await Booking.findByPk(booking.id, {
        include: [
          {
            model: Hotel,
            attributes: ['name', 'address', 'city']
          },
          {
            model: BookingRoom,
            include: [
              {
                model: RoomType,
                attributes: ['name', 'basePrice']
              }
            ]
          }
        ]
      });

      res.status(201).json({
        message: 'Booking created successfully',
        booking: completeBooking
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      res.status(500).json({ message: 'Failed to create booking' });
    }
  },

  // Get user's bookings
  getUserBookings: async (req, res) => {
    try {
      const userId = req.user.id;

      const bookings = await Booking.findAll({
        where: { userId },
        include: [
          {
            model: Hotel,
            attributes: ['name', 'address', 'city']
          },
          {
            model: BookingRoom,
            include: [
              {
                model: RoomType,
                attributes: ['name', 'basePrice']
              }
            ]
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      res.json({ bookings });
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      res.status(500).json({ message: 'Failed to fetch bookings' });
    }
  },

  // Get booking by ID
  getBookingById: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const booking = await Booking.findOne({
        where: { id, userId },
        include: [
          {
            model: Hotel,
            attributes: ['name', 'address', 'city']
          },
          {
            model: BookingRoom,
            include: [
              {
                model: RoomType,
                attributes: ['name', 'basePrice']
              }
            ]
          }
        ]
      });

      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      res.json({ booking });
    } catch (error) {
      console.error('Error fetching booking:', error);
      res.status(500).json({ message: 'Failed to fetch booking' });
    }
  },

  // Process payment simulation
  processPayment: async (req, res) => {
    try {
      const { id } = req.params;
      const { paymentMethod } = req.body;
      const userId = req.user.id;

      const booking = await Booking.findOne({
        where: { id, userId }
      });

      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      if (booking.paymentStatus === 'paid') {
        return res.status(400).json({ message: 'Booking is already paid' });
      }

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate payment success (90% success rate)
      const paymentSuccess = Math.random() > 0.1;

      if (paymentSuccess) {
        await booking.update({
          paymentStatus: 'paid',
          paymentMethod,
          status: 'confirmed'
        });

        res.json({
          success: true,
          message: 'Payment processed successfully',
          booking: {
            id: booking.id,
            bookingNumber: booking.bookingNumber,
            paymentStatus: 'paid',
            status: 'confirmed'
          }
        });
      } else {
        await booking.update({
          paymentStatus: 'failed'
        });

        res.status(400).json({
          success: false,
          message: 'Payment failed. Please try again.'
        });
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      res.status(500).json({ message: 'Payment processing failed' });
    }
  },

  // Cancel booking
  cancelBooking: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const booking = await Booking.findOne({
        where: { id, userId }
      });

      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      if (booking.status === 'cancelled') {
        return res.status(400).json({ message: 'Booking is already cancelled' });
      }

      await booking.update({
        status: 'cancelled',
        cancelledAt: new Date(),
        cancelledBy: userId
      });

      res.json({
        message: 'Booking cancelled successfully',
        booking: {
          id: booking.id,
          bookingNumber: booking.bookingNumber,
          status: 'cancelled'
        }
      });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      res.status(500).json({ message: 'Failed to cancel booking' });
    }
  }
};

module.exports = bookingController;
