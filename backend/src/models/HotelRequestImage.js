const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const HotelRequest = require('./HotelRequest');

const HotelRequestImage = sequelize.define('HotelRequestImage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  hotelRequestId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: HotelRequest,
      key: 'id'
    }
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isPrimary: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  orderIndex: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});



module.exports = HotelRequestImage;
