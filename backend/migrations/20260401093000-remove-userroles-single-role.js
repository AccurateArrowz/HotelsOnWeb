'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS trg_enforce_hotel_owner_role ON "HotelOwners";
    `);

    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS enforce_hotel_owner_role();
    `);

    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION enforce_hotel_owner_role()
      RETURNS TRIGGER AS $$
      DECLARE
        has_owner_role BOOLEAN;
      BEGIN
        SELECT EXISTS(
          SELECT 1 FROM "Users" u
          WHERE u.id = NEW."userId" AND u.role = 'hotelOwner'
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

    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS "UserRoles";
    `);
  },

  async down(queryInterface, Sequelize) {
    // Non-destructive
  }
};
