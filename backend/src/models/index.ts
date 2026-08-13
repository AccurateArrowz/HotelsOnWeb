/**
 * Centralized models index - exports all Sequelize models
 */

// Auth models
export { default as User } from '@/features/auth/models/User';
export { default as RefreshToken } from '@/features/auth/models/RefreshToken';

// Hotel models
export { default as Hotel } from '@/features/hotel/models/Hotel';
export { default as HotelImage } from '@/features/hotel/models/HotelImage';
export { default as HotelOwner } from '@/features/hotel/models/HotelOwner';
export { default as HotelStaff } from '@/features/hotel/models/HotelStaff';
export { default as HotelStaffPermission } from '@/features/hotel/models/HotelStaffPermission';

// Room models
export { default as Room } from '@/features/room/models/Room';

// RoomType models
export { default as RoomType } from '@/features/roomType/models/RoomType';

// Booking models
export { default as Booking } from '@/features/booking/models/Booking';
export { default as BookingRoom } from '@/features/booking/models/BookingRoom';

// Hotel Request models
export { default as HotelRequest } from '@/features/hotel-request/models/HotelRequest';
export { default as HotelRequestImage } from '@/features/hotel-request/models/HotelRequestImage';

// Invitation models
export { default as Invitation } from '@/features/invitation/models/Invitation';

// RBAC models
export { default as Permission } from '@/features/rbac/models/Permission';
export { default as Role } from '@/features/rbac/models/Role';
export { default as RolePermission } from '@/features/rbac/models/RolePermission';

// Export all models as an array for Sequelize.addModels()
export const models = [
  // Auth
  require('@/features/auth/models/User').default,
  require('@/features/auth/models/RefreshToken').default,
  // Hotel
  require('@/features/hotel/models/Hotel').default,
  require('@/features/hotel/models/HotelImage').default,
  require('@/features/hotel/models/HotelOwner').default,
  require('@/features/hotel/models/HotelStaff').default,
  require('@/features/hotel/models/HotelStaffPermission').default,
  // Room
  require('@/features/room/models/Room').default,
  // RoomType
  require('@/features/roomType/models/RoomType').default,
  // Booking
  require('@/features/booking/models/Booking').default,
  require('@/features/booking/models/BookingRoom').default,
  // Hotel Request
  require('@/features/hotel-request/models/HotelRequest').default,
  require('@/features/hotel-request/models/HotelRequestImage').default,
  // Invitation
  require('@/features/invitation/models/Invitation').default,
  // RBAC
  require('@/features/rbac/models/Permission').default,
  require('@/features/rbac/models/Role').default,
  require('@/features/rbac/models/RolePermission').default,
];
