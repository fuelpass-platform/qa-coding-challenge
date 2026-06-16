import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Express } from 'express';
import { AppModule } from './app.module';

let cached: Express | null = null;

/**
 * Boots the Nest app onto an Express instance and caches it, so a warm
 * serverless invocation reuses it. Used by the Vercel function entrypoint.
 *
 * NOTE: the in-memory store does not survive cold starts on serverless —
 * this deployment is a live demo. Local `npm run dev` is canonical.
 */
export async function createServerlessApp(): Promise<Express> {
  if (cached) return cached;
  const expressApp = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.init();
  cached = expressApp;
  return cached;
}
