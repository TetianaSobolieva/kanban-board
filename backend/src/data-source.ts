import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Board } from './entities/Board';
import { Card } from './entities/Card';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'task_boards',
  synchronize: process.env.NODE_ENV !== 'true',
  logging: false,
  entities: [Board, Card],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
});
