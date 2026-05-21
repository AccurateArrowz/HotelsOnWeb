const { Op } = require("sequelize");
const Room = require("../models/Room");
const BookingRoom = require("../models/BookingRoom");
const Booking = require("../models/Booking");
const RoomType = require("../models/RoomType");

const roomsAvailability = async (req, res) => {
  try {
    const { hotelId, requestedCheckIn, requestedCheckOut } = req.body;

    if (!hotelId || !requestedCheckIn || !requestedCheckOut) {
      return res.status(400).json({ error: "Missing required parameters: hotelId, requestedCheckIn, requestedCheckOut" });
    }

    const checkInDate = new Date(requestedCheckIn);
    const checkOutDate = new Date(requestedCheckOut);

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ error: "Check-in date must be before check-out date" });
    }

    const allRooms = await Room.findAll({
      where: {
        hotelId: hotelId,
        isActive: true,
        status: 'available'
      },
      include: [
        {
          model: RoomType,
          where: { isActive: true },
          attributes: ['id', 'name', 'description', 'basePrice', 'adults', 'children']
        }
      ],
      attributes: ['id', 'roomId', 'roomNumber', 'floor', 'adults', 'children']
    });

    const bookedRooms = await BookingRoom.findAll({
      where: {
        roomId: allRooms.map(room => room.id)
      },
      include: [
        {
          model: Booking,
          where: {
            hotelId: hotelId,
            status: { [Op.in]: ['confirmed', 'pending'] },
            [Op.and]: [
              { checkInDate: { [Op.lt]: checkOutDate } },
              { checkOutDate: { [Op.gt]: checkInDate } }
            ]
          },
          attributes: ['id', 'checkInDate', 'checkOutDate', 'status']
        }
      ],
      attributes: ['id', 'roomId', 'roomTypeId']
    });

    const bookedRoomIds = bookedRooms.map(br => br.roomId);
    const availableRooms = allRooms.filter(room => !bookedRoomIds.includes(room.id));

    const groupedByRoomType = availableRooms.reduce((acc, room) => {
      const roomTypeId = room.RoomType.id;
      const roomTypeName = room.RoomType.name;
      
      if (!acc[roomTypeId]) {
        acc[roomTypeId] = {
          roomTypeId: roomTypeId,
          roomTypeName: roomTypeName,
          description: room.RoomType.description,
          basePrice: room.RoomType.basePrice,
          maxAdults: room.RoomType.adults,
          maxChildren: room.RoomType.children,
          availableRooms: [],
          totalAvailable: 0
        };
      }
      
      acc[roomTypeId].availableRooms.push({
        id: room.id,
        roomId: room.roomId,
        roomNumber: room.roomNumber,
        floor: room.floor,
        adults: room.adults,
        children: room.children
      });
      
      acc[roomTypeId].totalAvailable = acc[roomTypeId].availableRooms.length;
      
      return acc;
    }, {});

    const response = Object.values(groupedByRoomType);

    res.status(200).json({
      hotelId: hotelId,
      requestedCheckIn: requestedCheckIn,
      requestedCheckOut: requestedCheckOut,
      totalRoomTypes: response.length,
      roomTypes: response
    });

  } catch (error) {
    console.error("Error checking room availability:", error);
    res.status(500).json({ error: "Failed to check room availability", details: error.message });
  }
};

module.exports = { roomsAvailability };