/**
 * Model index - exports all models for convenience
 * Models are auto-loaded by sequelize-typescript via the models directory
 */

export { default as User } from './User';
export { default as Hotel } from './Hotel';
export { default as HotelImage } from './HotelImage';
export { default as RoomType } from './RoomType';
export { default as Room } from './Room';
export { default as Booking } from './Booking';
export { default as BookingRoom } from './BookingRoom';
export { default as HotelRequest } from './HotelRequest';
export { default as HotelRequestImage } from './HotelRequestImage';
export { default as Role } from './Role';
export { default as Permission } from './Permission';
export { default as RolePermission } from './RolePermission';
export { default as HotelOwner } from './HotelOwner';
export { default as HotelStaff } from './HotelStaff';
export { default as HotelStaffPermission } from './HotelStaffPermission';
export { default as RefreshToken } from './RefreshToken';
