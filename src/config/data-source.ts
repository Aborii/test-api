import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

const url = `postgresql://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`;

export const AppDataSource = new DataSource({
  type: 'postgres',
  url,
  entities: ['**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
});
