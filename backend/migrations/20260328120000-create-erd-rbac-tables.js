'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Roles
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS "Roles" (
        id SERIAL PRIMARY KEY,
        key VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        scope VARCHAR(255) NOT NULL,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // Permissions
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS "Permissions" (
        id SERIAL PRIMARY KEY,
        key VARCHAR(255) NOT NULL UNIQUE,
        label VARCHAR(255) NOT NULL,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // RolePermissions (default permissions per role)
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS "RolePermissions" (
        id SERIAL PRIMARY KEY,
        "roleId" INTEGER NOT NULL REFERENCES "Roles"(id) ON UPDATE CASCADE ON DELETE CASCADE,
        "permissionId" INTEGER NOT NULL REFERENCES "Permissions"(id) ON UPDATE CASCADE ON DELETE CASCADE,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT role_permissions_unique UNIQUE ("roleId", "permissionId")
      );
    `);

    // HotelOwners (only owners can appear here – enforced via trigger below)
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS "HotelOwners" (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER NOT NULL REFERENCES "Users"(id) ON UPDATE CASCADE ON DELETE CASCADE,
        "hotelId" INTEGER NOT NULL REFERENCES "Hotels"(id) ON UPDATE CASCADE ON DELETE CASCADE,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT hotel_owners_unique UNIQUE ("userId", "hotelId")
      );
    `);

    // HotelStaff
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS "HotelStaff" (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER NOT NULL REFERENCES "Users"(id) ON UPDATE CASCADE ON DELETE CASCADE,
        "hotelId" INTEGER NOT NULL REFERENCES "Hotels"(id) ON UPDATE CASCADE ON DELETE CASCADE,
        "roleId" INTEGER NOT NULL REFERENCES "Roles"(id) ON UPDATE CASCADE ON DELETE RESTRICT,
        "invitedBy" INTEGER REFERENCES "Users"(id) ON UPDATE CASCADE ON DELETE SET NULL,
        salary NUMERIC(12,2),
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT hotel_staff_unique UNIQUE ("userId", "hotelId", "roleId")
      );
    `);

    // HotelStaffPermissions (override/modify for staff from frontend)
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS "HotelStaffPermissions" (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER NOT NULL REFERENCES "Users"(id) ON UPDATE CASCADE ON DELETE CASCADE,
        "hotelId" INTEGER NOT NULL REFERENCES "Hotels"(id) ON UPDATE CASCADE ON DELETE CASCADE,
        "roleId" INTEGER NOT NULL REFERENCES "Roles"(id) ON UPDATE CASCADE ON DELETE RESTRICT,
        "permissionId" INTEGER NOT NULL REFERENCES "Permissions"(id) ON UPDATE CASCADE ON DELETE CASCADE,
        granted BOOLEAN NOT NULL DEFAULT TRUE,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT hotel_staff_permissions_unique UNIQUE ("userId", "hotelId", "roleId", "permissionId")
      );
    `);

    // Minimal role seeds (no permission seeds per your instruction)
    await queryInterface.sequelize.query(`
      INSERT INTO "Roles"(key, name, scope, "createdAt", "updatedAt") VALUES
        ('customer', 'Customer', 'system', NOW(), NOW()),
        ('admin', 'Admin', 'system', NOW(), NOW()),
        ('owner', 'Owner', 'hotel', NOW(), NOW()),
        ('manager', 'Manager', 'hotel', NOW(), NOW()),
        ('receptionist', 'Receptionist', 'hotel', NOW(), NOW())
      ON CONFLICT (key) DO NOTHING;
    `);

    // Enforce: only users with 'hotelOwner' role can be inserted into HotelOwners.
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION enforce_hotel_owner_role()
      RETURNS TRIGGER AS $$
      DECLARE
        owner_role_id INTEGER;
        has_owner_role BOOLEAN;
      BEGIN
        SELECT id INTO owner_role_id FROM "Roles" WHERE key = 'owner' LIMIT 1;
        IF owner_role_id IS NULL THEN
          RAISE EXCEPTION 'Owner role is not defined in Roles';
        END IF;

        SELECT EXISTS(
          SELECT 1 FROM "UserRoles" ur
          WHERE ur."userId" = NEW."userId" AND ur."roleId" = owner_role_id
        ) INTO has_owner_role;

        IF NOT has_owner_role THEN
          RAISE EXCEPTION 'User % is not an owner and cannot be inserted into HotelOwners', NEW."userId";
        END IF;

        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_trigger WHERE tgname = 'trg_enforce_hotel_owner_role'
        ) THEN
          CREATE TRIGGER trg_enforce_hotel_owner_role
          BEFORE INSERT OR UPDATE ON "HotelOwners"
          FOR EACH ROW
          EXECUTE FUNCTION enforce_hotel_owner_role();
        END IF;
      END $$;
    `);
  },

  async down(queryInterface, Sequelize) {
    // Intentionally non-destructive: per requirement, do not drop tables in rollback.
  }
};
