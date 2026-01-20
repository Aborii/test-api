import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getTypeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  synchronize: false,
  schema: 'public',
  database: configService.get<string>('DATABASE_NAME'),
  password: configService.get<string>('DATABASE_PASSWORD'),
  username: configService.get<string>('DATABASE_USER'),
  port: configService.get<number>('DATABASE_PORT'),
  host: configService.get<string>('DATABASE_HOST'),
  logging: process.env.LOGGING === 'true',
  entities: ['**/*.entity.js'],
  migrations: ['**/migrations/*.js'],
  migrationsTransactionMode: 'each',
});
