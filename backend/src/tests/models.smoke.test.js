/**
 * Smoke test for database models
 * Verifies that model structure hasn't changed after migration
 */

const sequelize = require('../config/database');

// Models are auto-loaded by sequelize-typescript when database.js is required
// No need to explicitly load them

async function runSmokeTest() {
  try {
    console.log('[SMOKE TEST] Starting model structure verification...');

    // Get all models
    const models = sequelize.models;
    const expectedModels = [
      'User',
      'Hotel',
      'HotelImage',
      'RoomType',
      'Room',
      'Booking',
      'BookingRoom',
      'HotelRequest',
      'HotelRequestImage',
      'Role',
      'Permission',
      'RolePermission',
      'HotelOwner',
      'HotelStaff',
      'HotelStaffPermission',
      'RefreshToken',
    ];

    // Check all models are registered
    const modelNames = Object.keys(models);
    const missingModels = expectedModels.filter(m => !modelNames.includes(m));

    if (missingModels.length > 0) {
      throw new Error(`Missing models: ${missingModels.join(', ')}`);
    }

    console.log(`[SMOKE TEST] ✓ All ${expectedModels.length} models registered`);

    // Check User model structure
    const User = models.User;
    const userAttributes = Object.keys(User.rawAttributes);
    const expectedUserAttrs = ['id', 'email', 'password', 'firstName', 'lastName', 'phone', 'roleId', 'createdAt', 'updatedAt'];
    const missingUserAttrs = expectedUserAttrs.filter(attr => !userAttributes.includes(attr));

    if (missingUserAttrs.length > 0) {
      throw new Error(`User model missing attributes: ${missingUserAttrs.join(', ')}`);
    }

    console.log('[SMOKE TEST] ✓ User model structure intact');

    // Check Hotel model structure
    const Hotel = models.Hotel;
    const hotelAttributes = Object.keys(Hotel.rawAttributes);
    const expectedHotelAttrs = ['id', 'name', 'description', 'street', 'city', 'country', 'amenities', 'isActive', 'createdAt', 'updatedAt'];
    const missingHotelAttrs = expectedHotelAttrs.filter(attr => !hotelAttributes.includes(attr));

    if (missingHotelAttrs.length > 0) {
      throw new Error(`Hotel model missing attributes: ${missingHotelAttrs.join(', ')}`);
    }

    console.log('[SMOKE TEST] ✓ Hotel model structure intact');

    // Check associations exist
    const userAssociations = Object.keys(User.associations);
    if (userAssociations.length === 0) {
      throw new Error('User model has no associations');
    }

    console.log(`[SMOKE TEST] ✓ User model has ${userAssociations.length} associations`);

    const hotelAssociations = Object.keys(Hotel.associations);
    if (hotelAssociations.length === 0) {
      throw new Error('Hotel model has no associations');
    }

    console.log(`[SMOKE TEST] ✓ Hotel model has ${hotelAssociations.length} associations`);

    console.log('[SMOKE TEST] ✅ All checks passed!');
    return true;
  } catch (error) {
    console.error('[SMOKE TEST] ❌ Test failed:', error.message);
    return false;
  }
}

module.exports = { runSmokeTest };
