const { RoomType, Room, Hotel, HotelOwner } = require('../models');
const { sendSuccess, sendBadRequest, sendNotFound, sendInternalError, sendForbidden } = require('../utils/apiResponse');

// Get all room types for a hotel
exports.getRoomTypesByHotel = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const userId = req.user.id;

    // Verify hotel ownership
    const hotel = await Hotel.findByPk(hotelId);
    if (!hotel) {
      return sendNotFound(res, 'Hotel not found');
    }

    const ownership = await HotelOwner.findOne({ where: { hotelId, userId } });
    if (!ownership) {
      return sendForbidden(res, 'Not authorized to view this hotel\'s room types');
    }

    const roomTypes = await RoomType.findAll({
      where: { hotelId },
      order: [['name', 'ASC']]
    });

    return sendSuccess(res, { data: roomTypes });
  } catch (error) {
    console.error('Error fetching room types:', error);
    return sendInternalError(res, 'Failed to fetch room types');
  }
};

// Get a single room type by ID
exports.getRoomTypeById = async (req, res) => {
  try {
    const { hotelId, id } = req.params;
    const userId = req.user.id;

    const hotel = await Hotel.findByPk(hotelId);
    if (!hotel) {
      return sendNotFound(res, 'Hotel not found');
    }

    const ownership = await HotelOwner.findOne({ where: { hotelId, userId } });
    if (!ownership) {
      return sendForbidden(res, 'Not authorized to view this room type');
    }

    const roomType = await RoomType.findOne({
      where: { id, hotelId },
      include: [{
        model: Room,
        as: 'rooms',
        attributes: ['id', 'roomNumber', 'status']
      }]
    });

    if (!roomType) {
      return sendNotFound(res, 'Room type not found');
    }

    return sendSuccess(res, { data: roomType });
  } catch (error) {
    console.error('Error fetching room type:', error);
    return sendInternalError(res, 'Failed to fetch room type');
  }
};

// Create a new room type
exports.createRoomType = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const userId = req.user.id;
    const { name, description, basePrice, adults, children } = req.body;

    // Verify hotel ownership
    const hotel = await Hotel.findByPk(hotelId);
    if (!hotel) {
      return sendNotFound(res, 'Hotel not found');
    }

    const ownership = await HotelOwner.findOne({ where: { hotelId, userId } });
    if (!ownership) {
      return sendForbidden(res, 'Not authorized to create room types for this hotel');
    }

    // Validation
    if (!name || !basePrice) {
      return sendBadRequest(res, 'Name and base price are required');
    }

    if (isNaN(basePrice) || basePrice <= 0) {
      return sendBadRequest(res, 'Base price must be a positive number');
    }

    const roomType = await RoomType.create({
      hotelId,
      name: name.trim(),
      description: description?.trim() || null,
      basePrice,
      adults: adults || 2,
      children: children || 0
    });

    return sendSuccess(res, { data: roomType, message: 'Room type created successfully' }, 201);
  } catch (error) {
    console.error('Error creating room type:', error);
    return sendInternalError(res, 'Failed to create room type');
  }
};

// Update a room type
exports.updateRoomType = async (req, res) => {
  try {
    const { hotelId, id } = req.params;
    const userId = req.user.id;
    const { name, description, basePrice, adults, children, isActive } = req.body;

    const hotel = await Hotel.findByPk(hotelId);
    if (!hotel) {
      return sendNotFound(res, 'Hotel not found');
    }

    const ownership = await HotelOwner.findOne({ where: { hotelId, userId } });
    if (!ownership) {
      return sendForbidden(res, 'Not authorized to update this room type');
    }

    const roomType = await RoomType.findOne({ where: { id, hotelId } });
    if (!roomType) {
      return sendNotFound(res, 'Room type not found');
    }

    // Validation
    if (basePrice !== undefined && (isNaN(basePrice) || basePrice <= 0)) {
      return sendBadRequest(res, 'Base price must be a positive number');
    }

    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (description !== undefined) updates.description = description?.trim() || null;
    if (basePrice !== undefined) updates.basePrice = basePrice;
    if (adults !== undefined) updates.adults = adults;
    if (children !== undefined) updates.children = children;
    if (isActive !== undefined) updates.isActive = isActive;

    await roomType.update(updates);

    return sendSuccess(res, { data: roomType, message: 'Room type updated successfully' });
  } catch (error) {
    console.error('Error updating room type:', error);
    return sendInternalError(res, 'Failed to update room type');
  }
};

// Delete a room type
exports.deleteRoomType = async (req, res) => {
  try {
    const { hotelId, id } = req.params;
    const userId = req.user.id;

    const hotel = await Hotel.findByPk(hotelId);
    if (!hotel) {
      return sendNotFound(res, 'Hotel not found');
    }

    const ownership = await HotelOwner.findOne({ where: { hotelId, userId } });
    if (!ownership) {
      return sendForbidden(res, 'Not authorized to delete this room type');
    }

    const roomType = await RoomType.findOne({ where: { id, hotelId } });
    if (!roomType) {
      return sendNotFound(res, 'Room type not found');
    }

    // Check if any rooms are using this room type
    const roomCount = await Room.count({ where: { roomTypeId: id } });
    if (roomCount > 0) {
      return sendBadRequest(res, `Cannot delete: ${roomCount} room(s) are using this room type. Reassign or delete those rooms first.`);
    }

    await roomType.destroy();

    return sendSuccess(res, { message: 'Room type deleted successfully' });
  } catch (error) {
    console.error('Error deleting room type:', error);
    return sendInternalError(res, 'Failed to delete room type');
  }
};
