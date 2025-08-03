const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RoomType = sequelize.define('RoomType', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  hotelId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Hotels',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  basePrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
   // New columns for occupancy capacity
   adults: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 2,
    validate: {
      min: 1,
      max: 10 // Adjust max value based on your hotel's largest room capacity
    },
    comment: 'Maximum number of adults the room can accommodate'
  },
  children: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 8 // Adjust max value based on your hotel's policy
    },
    comment: 'Maximum number of children the room can accommodate'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = RoomType; 