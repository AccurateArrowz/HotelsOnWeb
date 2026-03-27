const User = require('./User');
const Hotel = require('./Hotel');
const HotelImage = require('./HotelImage');
const RoomType = require('./RoomType');
const Room = require('./Room');
const Booking = require('./Booking');
const BookingRoom = require('./BookingRoom');
const HotelRequest = require('./HotelRequest');
const HotelRequestImage = require('./HotelRequestImage');
const Role = require('./Role');
const Permission = require('./Permission');
const RolePermission = require('./RolePermission');
// const UserRole = require('./UserRole');

// User associations
User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings' });
User.hasMany(Booking, { foreignKey: 'cancelledBy', as: 'cancelledBookings' });

// Hotel associations
Hotel.hasMany(HotelImage, { foreignKey: 'hotelId', as: 'images' });
Hotel.hasMany(RoomType, { foreignKey: 'hotelId', as: 'roomTypes' });
Hotel.hasMany(Room, { foreignKey: 'hotelId', as: 'rooms' });
Hotel.hasMany(Booking, { foreignKey: 'hotelId', as: 'bookings' });
Hotel.belongsTo(User, { foreignKey: 'hotelOwnerId', as: 'hotelOwner' });

// User associations for hotel ownership
User.hasMany(Hotel, { foreignKey: 'hotelOwnerId', as: 'ownedHotels' });

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

// HotelRequest associations
HotelRequest.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(HotelRequest, { foreignKey: 'userId', as: 'hotelRequests' });

// HotelRequestImage associations
HotelRequestImage.belongsTo(HotelRequest, { foreignKey: 'hotelRequestId', as: 'hotelRequest' });
HotelRequest.hasMany(HotelRequestImage, { foreignKey: 'hotelRequestId', as: 'images' });

// RBAC associations
// Role.belongsToMany(Permission, {
//   through: RolePermission,
//   foreignKey: 'roleId',
//   otherKey: 'permissionId',
//   as: 'permissions'
// });
// Permission.belongsToMany(Role, {
//   through: RolePermission,
//   foreignKey: 'permissionId',
//   otherKey: 'roleId',
//   as: 'roles'
// });

// User.hasMany(UserRole, { foreignKey: 'userId', as: 'userRoles' });
// UserRole.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Role.hasMany(UserRole, { foreignKey: 'roleId', as: 'userRoles' });
// UserRole.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });

// Hotel.hasMany(UserRole, { foreignKey: 'hotelId', as: 'userRoles' });
// UserRole.belongsTo(Hotel, { foreignKey: 'hotelId', as: 'hotel' });

module.exports = {
  User,
  Hotel,
  HotelImage,
  RoomType,
  Room,
  Booking,
  BookingRoom,
  HotelRequest,
  HotelRequestImage,
  Role,
  Permission,
  RolePermission,
  // UserRole
};