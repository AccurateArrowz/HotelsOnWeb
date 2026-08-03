/**
 * Booking status enumeration
 */
export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

/**
 * Room status enumeration
 */
export enum RoomStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance',
  RESERVED = 'reserved',
}

/**
 * Hotel request status enumeration
 */
export enum HotelRequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  UNDER_REVIEW = 'under_review',
}

/**
 * User roles
 */
export enum UserRole {
  ADMIN = 'admin',
  HOTEL_OWNER = 'hotel_owner',
  HOTEL_STAFF = 'hotel_staff',
  GUEST = 'guest',
}

/**
 * Permission keys for RBAC
 */
export enum Permission {
  // Hotel management
  CREATE_HOTEL = 'create_hotel',
  READ_HOTEL = 'read_hotel',
  UPDATE_HOTEL = 'update_hotel',
  DELETE_HOTEL = 'delete_hotel',

  // Room management
  CREATE_ROOM = 'create_room',
  READ_ROOM = 'read_room',
  UPDATE_ROOM = 'update_room',
  DELETE_ROOM = 'delete_room',

  // Booking management
  CREATE_BOOKING = 'create_booking',
  READ_BOOKING = 'read_booking',
  UPDATE_BOOKING = 'update_booking',
  CANCEL_BOOKING = 'cancel_booking',

  // Hotel request management
  CREATE_HOTEL_REQUEST = 'create_hotel_request',
  READ_HOTEL_REQUEST = 'read_hotel_request',
  APPROVE_HOTEL_REQUEST = 'approve_hotel_request',
  REJECT_HOTEL_REQUEST = 'reject_hotel_request',

  // User management
  MANAGE_USERS = 'manage_users',
  MANAGE_STAFF = 'manage_staff',

  // System
  MANAGE_ROLES = 'manage_roles',
  MANAGE_PERMISSIONS = 'manage_permissions',
}

/**
 * Booking status type
 */
export type BookingStatusType = keyof typeof BookingStatus;

/**
 * Room status type
 */
export type RoomStatusType = keyof typeof RoomStatus;

/**
 * Hotel request status type
 */
export type HotelRequestStatusType = keyof typeof HotelRequestStatus;

/**
 * User role type
 */
export type UserRoleType = keyof typeof UserRole;

/**
 * Permission type
 */
export type PermissionType = keyof typeof Permission;
