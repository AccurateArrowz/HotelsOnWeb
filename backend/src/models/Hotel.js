const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Hotel = sequelize.define('Hotel', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  hotelId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  street: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amenities: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  },
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    allowNull: true,
    validate: {
      min: 0,
      max:5
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  hooks: {
    beforeCreate: async (hotel) => {
      // Generate custom hotel ID if not provided
      if (!hotel.hotelId) {
        const acronym = hotel.name.split(' ').map(word => word[0]).join('').toUpperCase();
        const randomNum = Math.floor(Math.random() * 900000) + 100000; // Ensure it's a 6-digit number
        hotel.hotelId = `${acronym}-${randomNum}`;
      }
    }
  }
});

module.exports = Hotel; 