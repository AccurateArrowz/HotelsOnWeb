const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BookingRoom = sequelize.define('BookingRoom', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  bookingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Bookings',
      key: 'id'
    }
  },
  roomId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Rooms',
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
  pricePerNight: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  numberOfNights: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
});

module.exports = BookingRoom; 