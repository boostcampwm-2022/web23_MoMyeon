import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { VersioningType } from '@nestjs/common';

import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: ['http://localhost:3000', 'https://www.momyeon.site'],
  });
  const config = app.get(ConfigService);

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
  });

  console.log(`node env: ${process.env.NODE_ENV}`);
  console.log(`listening port: ${config.get('PORT')}`);
  await app.listen(config.get('PORT'));
}
bootstrap();
