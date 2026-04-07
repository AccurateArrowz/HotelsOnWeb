const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HotelOwner = sequelize.define('HotelOwner', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  hotelId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Hotels',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['userId', 'hotelId']
    }
  ]
});

module.exports = HotelOwner;
