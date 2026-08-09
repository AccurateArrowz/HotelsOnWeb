'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create StaffInvitations table
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS "StaffInvitations" (
        id SERIAL PRIMARY KEY,
        "hotelId" INTEGER NOT NULL REFERENCES "Hotels"(id) ON UPDATE CASCADE ON DELETE CASCADE,
        "invitedEmail" VARCHAR(255) NOT NULL,
        "invitedBy" INTEGER NOT NULL REFERENCES "Users"(id) ON UPDATE CASCADE ON DELETE CASCADE,
        "roleId" INTEGER NOT NULL REFERENCES "Roles"(id) ON UPDATE CASCADE ON DELETE RESTRICT,
        token VARCHAR(255) NOT NULL UNIQUE,
        "tokenExpiresAt" TIMESTAMPTZ NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        "acceptedAt" TIMESTAMPTZ,
        "acceptedByUserId" INTEGER REFERENCES "Users"(id) ON UPDATE CASCADE ON DELETE SET NULL,
        "cancelledAt" TIMESTAMPTZ,
        "cancelledBy" INTEGER REFERENCES "Users"(id) ON UPDATE CASCADE ON DELETE SET NULL,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT "StaffInvitations_status_check" CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled', 'declined'))
      );
    `);

    // Create partial unique index to prevent duplicate pending invitations for same hotel/email
    await queryInterface.sequelize.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS staff_invitations_unique_pending
      ON "StaffInvitations"("hotelId", "invitedEmail")
      WHERE status = 'pending';
    `);

    // Create index for faster token lookups
    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_staff_invitations_token ON "StaffInvitations"(token);
    `);

    // Create index for hotel/email lookups
    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_staff_invitations_email_hotel ON "StaffInvitations"("invitedEmail", "hotelId");
    `);

    // Add status column to HotelStaffs if it doesn't exist (safety check)
    const [columns] = await queryInterface.sequelize.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'HotelStaffs' AND column_name = 'status'
    `);

    if (columns.length === 0) {
      await queryInterface.addColumn('HotelStaffs', 'status', {
        type: Sequelize.ENUM('active', 'inactive', 'suspended'),
        allowNull: false,
        defaultValue: 'active',
      });
    }
  },

  async down(queryInterface, Sequelize) {
    // Drop indexes
    await queryInterface.sequelize.query(`
      DROP INDEX IF EXISTS staff_invitations_unique_pending;
    `);

    await queryInterface.sequelize.query(`
      DROP INDEX IF EXISTS idx_staff_invitations_email_hotel;
    `);

    await queryInterface.sequelize.query(`
      DROP INDEX IF EXISTS idx_staff_invitations_token;
    `);

    // Drop table
    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS "StaffInvitations";
    `);
  }
};
