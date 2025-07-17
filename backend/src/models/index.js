const User = require('./User');
const Hotel = require('./Hotel');
const HotelImage = require('./HotelImage');
const RoomType = require('./RoomType');
const Room = require('./Room');
const Booking = require('./Booking');
const BookingRoom = require('./BookingRoom');

// User associations
User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings' });
User.hasMany(Booking, { foreignKey: 'cancelledBy', as: 'cancelledBookings' });

// Hotel associations
Hotel.hasMany(HotelImage, { foreignKey: 'hotelId', as: 'images' });
Hotel.hasMany(RoomType, { foreignKey: 'hotelId', as: 'roomTypes' });
Hotel.hasMany(Room, { foreignKey: 'hotelId', as: 'rooms' });
Hotel.hasMany(Booking, { foreignKey: 'hotelId', as: 'bookings' });

// HotelImage associations
HotelImage.belongsTo(Hotel, { foreignKey: 'hotelId', as: 'hotel' });

// RoomType associations
RoomType.belongsTo(Hotel, { foreignKey: 'hotelId', as: 'hotel' });
RoomType.hasMany(Room, { foreignKey: 'roomTypeId', as: 'rooms' });
RoomType.hasMany(BookingRoom, { foreignKey: 'roomTypeId', as: 'bookingRooms' });

// Room associations
Room.belongsTo(Hotel, { foreignKey: 'hotelId', as: 'hotel' });
Room.belongsTo(RoomType, { foreignKey: 'roomTypeId', as: 'roomType' });
Room.hasMany(BookingRoom, { foreignKey: 'roomId', as: 'bookingRooms' });

// Booking associations
Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Booking.belongsTo(User, { foreignKey: 'cancelledBy', as: 'cancelledByUser' });
Booking.belongsTo(Hotel, { foreignKey: 'hotelId', as: 'hotel' });
Booking.hasMany(BookingRoom, { foreignKey: 'bookingId', as: 'bookingRooms' });

// BookingRoom associations
BookingRoom.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' });
BookingRoom.belongsTo(Room, { foreignKey: 'roomId', as: 'room' });
BookingRoom.belongsTo(RoomType, { foreignKey: 'roomTypeId', as: 'roomType' });

module.exports = {
  User,
  Hotel,
  HotelImage,
  RoomType,
  Room,
  Booking,
  BookingRoom
}; 