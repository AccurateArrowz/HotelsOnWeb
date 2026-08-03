import { Sequelize } from 'sequelize-typescript';
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

function validateIndividualConfig() {
  const required = ['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST'];
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

function createSequelizeInstance(): Sequelize {
  if (process.env.DATABASE_URL) {
    return new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
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
      models: [path.join(path.dirname(fileURLToPath(import.meta.url)), '../models')],
      modelMatch: (filename) => {
        return filename.substring(0, filename.indexOf('.model.ts')) === filename.substring(filename.lastIndexOf('/') + 1, filename.indexOf('.'));
      }
    });
  }

  validateIndividualConfig();

  return new Sequelize(
    process.env.DB_NAME!,
    process.env.DB_USER!,
    process.env.DB_PASSWORD!,
    {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      dialect: 'postgres',
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
      models: [path.join(path.dirname(fileURLToPath(import.meta.url)), '../models')],
      modelMatch: (filename) => {
        return filename.substring(0, filename.indexOf('.model.ts')) === filename.substring(filename.lastIndexOf('/') + 1, filename.indexOf('.'));
      }
    }
  );
}

let sequelize: Sequelize | null = null;

export function getSequelize(): Sequelize {
  if (!sequelize) {
    sequelize = createSequelizeInstance();
  }
  return sequelize;
}

export default getSequelize();
