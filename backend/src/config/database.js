const { Sequelize } = require('sequelize');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

function validateIndividualConfig() {
  const required = ['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST'];
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

function createSequelizeInstance() {
  if (process.env.DATABASE_URL) {
    return new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: isProduction
          ? { require: true, rejectUnauthorized: false }
          : false
      },
      pool: {
        max: 2,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });
  }

  validateIndividualConfig();

  return new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: isProduction
          ? { require: true, rejectUnauthorized: false }
          : false
      },
      pool: {
        max: 2,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
}

const sequelize = createSequelizeInstance();

module.exports = sequelize; 