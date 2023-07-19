import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
  const config = {
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: 'simi',
    // timezone: "Z",
    extra: {
      charset: 'utf8mb4_unicode_ci'
    },
    autoLoadEntities: true
    // logging: true
  };
  if (process.env.DATABASE_HOST === '127.0.0.1') {
    return { ...config, synchronize: true };
  } else {
    return config;
  }
});
