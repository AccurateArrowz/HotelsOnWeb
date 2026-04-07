'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove the role column
    await queryInterface.removeColumn('Users', 'role');
    
    // Ensure roleId column exists (it should from the User model)
    await queryInterface.addColumn('Users', 'roleId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Roles',
        key: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    // Add back the role column for rollback
    await queryInterface.addColumn('Users', 'role', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    // Remove roleId column
    await queryInterface.removeColumn('Users', 'roleId');
  }
};
