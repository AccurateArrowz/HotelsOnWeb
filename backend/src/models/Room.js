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
  },
  // Add table-level validation to ensure total occupancy makes sense
  validate: {
    totalOccupancyCheck() {
      const totalCapacity = this.adults + this.children;
      if (totalCapacity > 12) { // Adjust based on your business rules
        throw new Error('Total room capacity (adults + children) cannot exceed 12 people');
      }
    }
  }
});

module.exports = Room;