import { NestFactory } from '@nestjs/core';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new ConsoleLogger({
    logLevels: ['error', 'warn', 'log'],
  });
  const app = await NestFactory.create(AppModule, {
    logger,
  });

  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS
  app.enableCors({
    origin: '*',
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);

  logger.log(
    `NestJS application is running on: http://localhost:${port}`,
    'NestApplication',
  );
}

bootstrap().catch((err) => {
  console.error('Error during application bootstrap:', err);
  process.exit(1);
});
