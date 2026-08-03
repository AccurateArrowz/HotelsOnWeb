/**
 * Models index - exports all compiled models
 * Associations are defined in the sequelize-typescript decorator models
 * 
 * This file is copied to dist/models/index.js and requires models from the same directory
 */

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
const HotelOwner = require('./HotelOwner');
const HotelStaff = require('./HotelStaff');
const HotelStaffPermission = require('./HotelStaffPermission');
const RefreshToken = require('./RefreshToken');

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
  HotelOwner,
  HotelStaff,
  HotelStaffPermission,
  RefreshToken,
};
