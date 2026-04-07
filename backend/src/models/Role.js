const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  key: { //machine readable
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  label: { //human readable eg: key: 'hotel-manager' -> label: 'Hotel Manager'
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Role;
