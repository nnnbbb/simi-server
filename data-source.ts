import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();

const configService = new ConfigService();

export default new DataSource({
  "type": "mysql",
  "host": process.env.DATABASE_HOST,
  "port": Number(process.env.DATABASE_PORT),
  "username": process.env.DATABASE_USERNAME,
  "password": process.env.DATABASE_PASSWORD,
  "database": "checkups",
  "logging": true,
  "extra": {
    "charset": "utf8mb4_unicode_ci"
  },
  "entities": [
    "dist/**/*.entity{.ts,.js}"
  ],
  "migrations": [
    "dist/src/migrations/*{.ts,.js}"
  ]
});