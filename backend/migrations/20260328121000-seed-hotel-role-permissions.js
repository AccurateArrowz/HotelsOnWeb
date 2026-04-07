'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Insert permissions for hotel-scoped roles (owner, manager, receptionist)
    await queryInterface.sequelize.query(`
      INSERT INTO "Permissions"(key, label, "createdAt", "updatedAt") VALUES
        -- Owner permissions
        ('view_revenue', 'View Revenue Dashboard', NOW(), NOW()),
        ('invite_managers', 'Invite and Remove Managers', NOW(), NOW()),
        ('manage_hotel_settings', 'Manage Hotel Settings', NOW(), NOW()),
        ('view_all_bookings', 'View All Bookings', NOW(), NOW()),
        
        -- Manager permissions (shared with owner but scoped)
        ('manage_staff', 'Manage Hotel Staff', NOW(), NOW()),
        ('manage_rooms', 'Manage Rooms and Room Types', NOW(), NOW()),
        ('manage_pricing', 'Manage Pricing and Availability', NOW(), NOW()),
        
        -- Receptionist/Staff permissions
        ('view_reservations', 'View and Manage Reservations', NOW(), NOW()),
        ('change_room_status', 'Change Room Status (pending, reserved, cleaning, etc.)', NOW(), NOW()),
        ('check_in_guests', 'Check-in and Check-out Guests', NOW(), NOW()),
        ('handle_payments', 'Process Payments', NOW(), NOW())
      ON CONFLICT (key) DO NOTHING;
    `);

    // Map default permissions to roles via RolePermissions
    await queryInterface.sequelize.query(`
      WITH role_ids AS (
        SELECT id, key FROM "Roles" WHERE key IN ('owner', 'manager', 'receptionist')
      ),
      perm_ids AS (
        SELECT id, key FROM "Permissions" WHERE key IN (
          'view_revenue', 'invite_managers', 'manage_hotel_settings', 'view_all_bookings',
          'manage_staff', 'manage_rooms', 'manage_pricing',
          'view_reservations', 'change_room_status', 'check_in_guests', 'handle_payments'
        )
      )
      INSERT INTO "RolePermissions"("roleId", "permissionId", "createdAt", "updatedAt")
      
      -- Owner: full access to everything
      SELECT r.id, p.id, NOW(), NOW()
      FROM role_ids r
      CROSS JOIN perm_ids p
      WHERE r.key = 'owner'
      
      UNION ALL
      
      -- Manager: manage staff/rooms/pricing + reservations/status/payments (no revenue, no invite managers)
      SELECT r.id, p.id, NOW(), NOW()
      FROM role_ids r
      JOIN perm_ids p ON p.key IN (
        'manage_staff', 'manage_rooms', 'manage_pricing',
        'view_reservations', 'change_room_status', 'check_in_guests', 'handle_payments',
        'view_all_bookings'
      )
      WHERE r.key = 'manager'
      
      UNION ALL
      
      -- Receptionist: reservations and room status only
      SELECT r.id, p.id, NOW(), NOW()
      FROM role_ids r
      JOIN perm_ids p ON p.key IN (
        'view_reservations', 'change_room_status', 'check_in_guests', 'handle_payments'
      )
      WHERE r.key = 'receptionist'
      
      ON CONFLICT ("roleId", "permissionId") DO NOTHING;
    `);
  },

  async down(queryInterface, Sequelize) {
    // Non-destructive: do not delete permissions/role_permissions on rollback
  }
};
