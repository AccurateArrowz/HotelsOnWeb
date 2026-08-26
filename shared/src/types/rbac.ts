/**
 * Permission keys for RBAC
 */
export const PERMISSION = {
  // Hotel management
  CREATE_HOTEL: 'create_hotel',
  READ_HOTEL: 'read_hotel',
  UPDATE_HOTEL: 'update_hotel',
  DELETE_HOTEL: 'delete_hotel',

  // Room management
  CREATE_ROOM: 'create_room',
  READ_ROOM: 'read_room',
  UPDATE_ROOM: 'update_room',
  DELETE_ROOM: 'delete_room',

  // Booking management
  CREATE_BOOKING: 'create_booking',
  READ_BOOKING: 'read_booking',
  UPDATE_BOOKING: 'update_booking',
  CANCEL_BOOKING: 'cancel_booking',

  // Hotel request management
  CREATE_HOTEL_REQUEST: 'create_hotel_request',
  READ_HOTEL_REQUEST: 'read_hotel_request',
  APPROVE_HOTEL_REQUEST: 'approve_hotel_request',
  REJECT_HOTEL_REQUEST: 'reject_hotel_request',

  // User management
  MANAGE_USERS: 'manage_users',
  MANAGE_STAFF: 'manage_staff',

  // System
  MANAGE_ROLES: 'manage_roles',
  MANAGE_PERMISSIONS: 'manage_permissions',
} as const;

export type Permission = (typeof PERMISSION)[keyof typeof PERMISSION];
