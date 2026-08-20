import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app';
import { AppDataSource } from './data-source';

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established');

    const app = createApp();
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

bootstrap();
