import { Sequelize } from 'sequelize-typescript';
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

// Get the models directory path - works in both ESM and CJS
const modelsDir = path.join(process.cwd(), 'dist', 'models');

function validateIndividualConfig() {
  const required = ['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST'];
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

function createSequelizeInstance(): Sequelize {
  const sequelizeConfig = {
    dialect: 'postgres' as const,
    dialectModule: pg,
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
    },
  };

  let sequelize: Sequelize;

  if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(process.env.DATABASE_URL, sequelizeConfig);
  } else {
    validateIndividualConfig();
    sequelize = new Sequelize(
      process.env.DB_NAME!,
      process.env.DB_USER!,
      process.env.DB_PASSWORD!,
      {
        ...sequelizeConfig,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432', 10),
      }
    );
  }

  // Manually load models from the compiled dist/models directory
  try {
    const models = require('../models/index.js');
    // Models are already registered with Sequelize via decorators
  } catch (error) {
    console.warn('Could not load models from dist/models:', error);
  }

  return sequelize;
}

let sequelize: Sequelize | null = null;

export function getSequelize(): Sequelize {
  if (!sequelize) {
    sequelize = createSequelizeInstance();
  }
  return sequelize;
}

// Export a getter function for lazy initialization
export default { getSequelize };
