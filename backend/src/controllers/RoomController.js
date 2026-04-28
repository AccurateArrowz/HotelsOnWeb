const { Room, RoomType, Hotel, Booking, BookingRoom, HotelOwner, User } = require('../models');
const { sendSuccess, sendBadRequest, sendNotFound, sendInternalError, sendForbidden } = require('../utils/apiResponse');
const { Op } = require('sequelize');

// Get all rooms for a hotel
exports.getRoomsByHotel = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const userId = req.user.id;
    console.log('rooms controller,  rooms requested for hotel id:', hotelId)

    // Verify hotel ownership
    const hotel = await Hotel.findByPk(hotelId);
    if (!hotel) {
      return sendNotFound(res, 'Hotel not found');
    }

    const ownership = await HotelOwner.findOne({ where: { hotelId, userId } });
    if (!ownership) {
      return sendForbidden(res, 'Not authorized to view this hotel\'s rooms');
    }

    const rooms = await Room.findAll({
      where: { hotelId },
      include: [
        {
          model: RoomType,
          as: 'roomType',
          attributes: ['id', 'name', 'basePrice']
        }
      ],
      order: [['roomNumber', 'ASC']]
    });

    // Get current guest info for occupied rooms
    const occupiedRooms = rooms.filter(r => r.status === 'occupied');
    const roomIds = occupiedRooms.map(r => r.id);

    if (roomIds.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const activeBookings = await Booking.findAll({
        where: {
          hotelId,
          status: { [Op.in]: ['confirmed', 'checked_in'] },
          checkInDate: { [Op.lte]: today },
          checkOutDate: { [Op.gte]: today }
        },
        include: [
          {
            model: BookingRoom,
            as: 'bookingRooms',
            where: { roomId: { [Op.in]: roomIds } },
            required: true
          },
          {
            model: User,
            as: 'user',
            attributes: ['firstName', 'lastName']
          }
        ]
      });

      // Map guest names to rooms
      const roomGuestMap = {};
      activeBookings.forEach(booking => {
        booking.bookingRooms.forEach(br => {
          const firstName = booking.user?.firstName || '';
          const lastName = booking.user?.lastName || '';
          roomGuestMap[br.roomId] = `${firstName.charAt(0)}. ${lastName}`;
        });
      });

      // Add current guest to response
      const roomsWithGuests = rooms.map(room => ({
        ...room.toJSON(),
        currentGuest: roomGuestMap[room.id] || null
      }));

      return sendSuccess(res, { data: roomsWithGuests });
    }

    return sendSuccess(res, { data: rooms.map(r => ({ ...r.toJSON(), currentGuest: null })) });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return sendInternalError(res, 'Failed to fetch rooms');
  }
};

// Get a single room by ID
exports.getRoomById = async (req, res) => {
  try {
    const { hotelId, id } = req.params;
    const userId = req.user.id;

    const hotel = await Hotel.findByPk(hotelId);
    if (!hotel) {
      return sendNotFound(res, 'Hotel not found');
    }

    const ownership = await HotelOwner.findOne({ where: { hotelId, userId } });
    if (!ownership) {
      return sendForbidden(res, 'Not authorized to view this room');
    }

    const room = await Room.findOne({
      where: { id, hotelId },
      include: [
        {
          model: RoomType,
          as: 'roomType'
        }
      ]
    });

    if (!room) {
      return sendNotFound(res, 'Room not found');
    }

    return sendSuccess(res, { data: room });
  } catch (error) {
    console.error('Error fetching room:', error);
    return sendInternalError(res, 'Failed to fetch room');
  }
};

// Create a new room
exports.createRoom = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const userId = req.user.id;
    const { roomNumber, floor, roomTypeId, adults, children, status } = req.body;

    // Verify hotel ownership
    const hotel = await Hotel.findByPk(hotelId);
    if (!hotel) {
      return sendNotFound(res, 'Hotel not found');
    }

    const ownership = await HotelOwner.findOne({ where: { hotelId, userId } });
    if (!ownership) {
      return sendForbidden(res, 'Not authorized to create rooms for this hotel');
    }

    // Validation
    if (!roomNumber || !roomTypeId) {
      return sendBadRequest(res, 'Room number and room type are required');
    }

    // Verify room type belongs to this hotel
    const roomType = await RoomType.findOne({ where: { id: roomTypeId, hotelId } });
    if (!roomType) {
      return sendBadRequest(res, 'Invalid room type for this hotel');
    }

    // Check for duplicate room number
    const existingRoom = await Room.findOne({ where: { hotelId, roomNumber } });
    if (existingRoom) {
      return sendBadRequest(res, 'Room number already exists');
    }

    const room = await Room.create({
      hotelId,
      roomTypeId,
      roomNumber: roomNumber.trim(),
      floor: floor || null,
      adults: adults || roomType.adults || 2,
      children: children || roomType.children || 0,
      status: status || 'available'
    });

    // Fetch complete room with room type info
    const roomWithType = await Room.findByPk(room.id, {
      include: [{ model: RoomType, as: 'roomType', attributes: ['id', 'name', 'basePrice'] }]
    });

    return sendSuccess(res, { data: roomWithType, message: 'Room created successfully' }, 201);
  } catch (error) {
    console.error('Error creating room:', error);
    return sendInternalError(res, 'Failed to create room');
  }
};

// Update a room
exports.updateRoom = async (req, res) => {
  try {
    const { hotelId, id } = req.params;
    const userId = req.user.id;
    const { roomNumber, floor, roomTypeId, adults, children, status, isActive } = req.body;

    const hotel = await Hotel.findByPk(hotelId);
    if (!hotel) {
      return sendNotFound(res, 'Hotel not found');
    }

    const ownership = await HotelOwner.findOne({ where: { hotelId, userId } });
    if (!ownership) {
      return sendForbidden(res, 'Not authorized to update this room');
    }

    const room = await Room.findOne({ where: { id, hotelId } });
    if (!room) {
      return sendNotFound(res, 'Room not found');
    }

    // Check for duplicate room number if changing
    if (roomNumber && roomNumber !== room.roomNumber) {
      const existingRoom = await Room.findOne({ where: { hotelId, roomNumber } });
      if (existingRoom) {
        return sendBadRequest(res, 'Room number already exists');
      }
    }

    // Verify room type if changing
    if (roomTypeId && roomTypeId !== room.roomTypeId) {
      const roomType = await RoomType.findOne({ where: { id: roomTypeId, hotelId } });
      if (!roomType) {
        return sendBadRequest(res, 'Invalid room type for this hotel');
      }
    }

    const updates = {};
    if (roomNumber !== undefined) updates.roomNumber = roomNumber.trim();
    if (floor !== undefined) updates.floor = floor;
    if (roomTypeId !== undefined) updates.roomTypeId = roomTypeId;
    if (adults !== undefined) updates.adults = adults;
    if (children !== undefined) updates.children = children;
    if (status !== undefined) updates.status = status;
    if (isActive !== undefined) updates.isActive = isActive;

    await room.update(updates);

    // Fetch updated room with room type
    const updatedRoom = await Room.findByPk(room.id, {
      include: [{ model: RoomType, as: 'roomType', attributes: ['id', 'name', 'basePrice'] }]
    });

    return sendSuccess(res, { data: updatedRoom, message: 'Room updated successfully' });
  } catch (error) {
    console.error('Error updating room:', error);
    return sendInternalError(res, 'Failed to update room');
  }
};

// Delete a room
exports.deleteRoom = async (req, res) => {
  try {
    const { hotelId, id } = req.params;
    const userId = req.user.id;

    const hotel = await Hotel.findByPk(hotelId);
    if (!hotel) {
      return sendNotFound(res, 'Hotel not found');
    }

    const ownership = await HotelOwner.findOne({ where: { hotelId, userId } });
    if (!ownership) {
      return sendForbidden(res, 'Not authorized to delete this room');
    }

    const room = await Room.findOne({ where: { id, hotelId } });
    if (!room) {
      return sendNotFound(res, 'Room not found');
    }

    // Check if room has any active bookings
    const activeBookings = await BookingRoom.count({
      where: { roomId: id },
      include: [{
        model: Booking,
        as: 'booking',
        where: {
          status: { [Op.in]: ['pending', 'confirmed', 'checked_in'] }
        }
      }]
    });

    if (activeBookings > 0) {
      return sendBadRequest(res, 'Cannot delete room with active bookings');
    }

    await room.destroy();

    return sendSuccess(res, { message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Error deleting room:', error);
    return sendInternalError(res, 'Failed to delete room');
  }
};
