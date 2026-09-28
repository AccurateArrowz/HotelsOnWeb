'use strict';

/**
 * Migration: Add missing columns to Bookings table
 *
 * Adds totalPrice, paymentStatus, cancelledBy, and cancellationReason
 * columns that exist in the Sequelize model but were absent from the DB.
 * All ADD COLUMN statements are guarded with IF NOT EXISTS to be idempotent.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE "Bookings"
        ADD COLUMN IF NOT EXISTS "totalPrice"         NUMERIC(10, 2) NOT NULL DEFAULT 0,
        ADD COLUMN IF NOT EXISTS "paymentStatus"      VARCHAR(255),
        ADD COLUMN IF NOT EXISTS "cancelledBy"        INTEGER REFERENCES "Users"(id) ON UPDATE CASCADE ON DELETE SET NULL,
        ADD COLUMN IF NOT EXISTS "cancellationReason" TEXT;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE "Bookings"
        DROP COLUMN IF EXISTS "totalPrice",
        DROP COLUMN IF EXISTS "paymentStatus",
        DROP COLUMN IF EXISTS "cancelledBy",
        DROP COLUMN IF EXISTS "cancellationReason";
    `);
  },
};
