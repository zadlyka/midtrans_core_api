import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

const appConfig = () => {
  return {
    database: {
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'basic_nest_auth',
      entities: ['dist/**/*.entity{.js, .ts}'],
      migrations: ['dist/database/migrations/*{.js, .ts}'],
      seeds: ['dist/database/seeders/*{.ts,.js}'],
      factories: ['dist/**/*.factory{.ts,.js}'],
      synchronize: false,
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      ttl: parseInt(process.env.JWT_TTL, 10) || 600,
      refreshTtl: parseInt(process.env.JWT_REFRESH_TTL, 10) || 2592000,
    },
  };
};

export default appConfig;
