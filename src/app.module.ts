import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { getTypeOrmConfig } from './config/typeorm.config';
import { AppCacheModule } from './common/global-modules/app-cache/app-cache.module';
import { CustomerModule } from './features/customer/customer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        getTypeOrmConfig(configService),
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 5 * 60 * 1000, // 5 minutes in milliseconds
    }),
    CustomerModule,

    AppCacheModule,
  ],
})
export class AppModule {}
