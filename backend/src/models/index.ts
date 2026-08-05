/**
 * Model index - exports all models for convenience
 * Models must be added to the Sequelize instance via database.ts
 */

import User from './User';
import Hotel from './Hotel';
import HotelImage from './HotelImage';
import RoomType from './RoomType';
import Room from './Room';
import Booking from './Booking';
import BookingRoom from './BookingRoom';
import HotelRequest from './HotelRequest';
import HotelRequestImage from './HotelRequestImage';
import Role from './Role';
import Permission from './Permission';
import RolePermission from './RolePermission';
import HotelOwner from './HotelOwner';
import HotelStaff from './HotelStaff';
import HotelStaffPermission from './HotelStaffPermission';
import RefreshToken from './RefreshToken';

export { User, Hotel, HotelImage, RoomType, Room, Booking, BookingRoom, HotelRequest, HotelRequestImage, Role, Permission, RolePermission, HotelOwner, HotelStaff, HotelStaffPermission, RefreshToken };

export const models = [User, Hotel, HotelImage, RoomType, Room, Booking, BookingRoom, HotelRequest, HotelRequestImage, Role, Permission, RolePermission, HotelOwner, HotelStaff, HotelStaffPermission, RefreshToken];

export default models;
