const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Room = sequelize.define('Room', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  roomId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  hotelId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Hotels',
      key: 'id'
    }
  },
  roomTypeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'RoomTypes',
      key: 'id'
    }
  },
  roomNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  floor: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('available', 'occupied', 'maintenance', 'reserved'),
    defaultValue: 'available'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  hooks: {
    beforeCreate: async (room) => {
      if (!room.roomId) {
        const randomNum = Math.floor(Math.random() * 9000) + 1000;
        room.roomId = `ROOM-${room.hotelId}-${room.roomNumber}-${randomNum}`;
      }
    }
  }
});

module.exports = Room; 