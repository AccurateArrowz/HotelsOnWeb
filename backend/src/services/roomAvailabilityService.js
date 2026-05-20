const { Op } = require('sequelize');
const { Room, RoomType, Booking, BookingRoom } = require('../models');
const { parseLocalDate } = require('@hotelsonweb/shared');

/**
 * Service for checking room availability across date ranges
 * Handles the core overlap logic using complementary form:
 * noOverlap = requestedCheckout <= existingCheckin || requestedCheckin >= existingCheckout
 * Therefore: overlap = NOT (noOverlap)
 */
const roomAvailabilityService = {
  /**
   * Get availability for all room types at a hotel for given dates
   * @param {number} hotelId - Hotel ID
   * @param {string} checkInDate - Check-in date (YYYY-MM-DD)
   * @param {string} checkOutDate - Check-out date (YYYY-MM-DD)
   * @returns {Promise<Array>} Availability per room type with pricing
   */
  getAvailability: async (hotelId, checkInDate, checkOutDate) => {
    // Parse as local dates to avoid UTC shift
    const checkIn = parseLocalDate(checkInDate);
    const checkOut = parseLocalDate(checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
      throw new Error('Check-out date must be after check-in date');
    }

    // Get all active room types for this hotel
    const roomTypes = await RoomType.findAll({
      where: { hotelId, isActive: true },
      attributes: ['id', 'name', 'description', 'basePrice', 'adults', 'children'],
    });

    // Get all rooms for this hotel grouped by room type
    const rooms = await Room.findAll({
      where: { hotelId, isActive: true },
      attributes: ['id', 'roomTypeId', 'status'],
    });

    // Group rooms by room type
    const roomsByType = {};
    rooms.forEach((room) => {
      if (!roomsByType[room.roomTypeId]) {
        roomsByType[room.roomTypeId] = [];
      }
      roomsByType[room.roomTypeId].push(room);
    });

    // Find overlapping bookings using: NOT (noOverlap condition)
    // noOverlap: existing checkout <= requested checkin OR existing checkin >= requested checkout
    const overlappingBookings = await Booking.findAll({
      where: {
        hotelId,
        status: { [Op.notIn]: ['cancelled'] },
        [Op.not]: {
          [Op.or]: [
            { checkOutDate: { [Op.lte]: checkInDate } },  // existing ends before/at requested start
            { checkInDate: { [Op.gte]: checkOutDate } },  // existing starts after/at requested end
          ],
        },
      },
      include: [
        {
          model: BookingRoom,
          as: 'bookingRooms',
          attributes: ['roomTypeId'],
        },
      ],
    });

    // Count booked rooms per room type
    const bookedCounts = {};
    overlappingBookings.forEach((booking) => {
      booking.bookingRooms.forEach((br) => {
        bookedCounts[br.roomTypeId] = (bookedCounts[br.roomTypeId] || 0) + 1;
      });
    });

    // Calculate availability for each room type
    const availability = roomTypes.map((roomType) => {
      const totalRooms = (roomsByType[roomType.id] || []).length;
      const bookedRooms = bookedCounts[roomType.id] || 0;
      const availableRooms = Math.max(0, totalRooms - bookedRooms);
      const totalPrice = roomType.basePrice * nights;

      return {
        roomTypeId: roomType.id,
        name: roomType.name,
        description: roomType.description,
        basePrice: parseFloat(roomType.basePrice),
        adults: roomType.adults,
        children: roomType.children,
        totalRooms,
        bookedRooms,
        availableRooms,
        nights,
        totalPrice: parseFloat(totalPrice.toFixed(2)),
        isAvailable: availableRooms > 0,
      };
    });

    return availability;
  },

  /**
   * Check if a specific room type is available for given dates
   * @param {number} hotelId - Hotel ID
   * @param {number} roomTypeId - Room Type ID
   * @param {string} checkInDate - Check-in date (YYYY-MM-DD)
   * @param {string} checkOutDate - Check-out date (YYYY-MM-DD)
   * @returns {Promise<Object>} Availability status and details
   */
  checkRoomTypeAvailability: async (hotelId, roomTypeId, checkInDate, checkOutDate) => {
    const roomType = await RoomType.findOne({
      where: { id: roomTypeId, hotelId, isActive: true },
      attributes: ['id', 'name', 'basePrice'],
    });

    if (!roomType) {
      return { available: false, reason: 'Room type not found' };
    }

    const totalRooms = await Room.count({
      where: { roomTypeId, hotelId, isActive: true },
    });

    if (totalRooms === 0) {
      return { available: false, reason: 'No rooms configured for this room type' };
    }

    // Count overlapping bookings using: NOT (noOverlap condition)
    const overlappingBookings = await Booking.count({
      where: {
        hotelId,
        status: { [Op.notIn]: ['cancelled'] },
        [Op.not]: {
          [Op.or]: [
            { checkOutDate: { [Op.lte]: checkInDate } },
            { checkInDate: { [Op.gte]: checkOutDate } },
          ],
        },
      },
      include: [
        {
          model: BookingRoom,
          as: 'bookingRooms',
          where: { roomTypeId },
          required: true,
        },
      ],
    });

    const availableRooms = totalRooms - overlappingBookings;
    // Parse as local dates to avoid UTC shift
    const checkIn = parseLocalDate(checkInDate);
    const checkOut = parseLocalDate(checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const totalPrice = roomType.basePrice * nights;

    return {
      available: availableRooms > 0,
      roomTypeId: roomType.id,
      roomTypeName: roomType.name,
      totalRooms,
      bookedRooms: overlappingBookings,
      availableRooms,
      nights,
      basePrice: parseFloat(roomType.basePrice),
      totalPrice: parseFloat(totalPrice.toFixed(2)),
    };
  },
};

module.exports = roomAvailabilityService;
