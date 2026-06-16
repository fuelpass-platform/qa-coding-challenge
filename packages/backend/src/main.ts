import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  // Fixed port — the frontend dev proxy targets http://localhost:3001.
  const port = 3001;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`FuelPass backend listening on http://localhost:${port}/api`);
}

bootstrap();
