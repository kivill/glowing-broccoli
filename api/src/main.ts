import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';

async function bootstrap() {
  const basePath = '/api/v1';
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix(basePath);
  await app.listen(3000);
}
bootstrap();
