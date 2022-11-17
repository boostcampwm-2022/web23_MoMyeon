import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  console.log(`node env: ${process.env.NODE_ENV}`);
  console.log(`listening port: ${config.get('PORT')}`);
  await app.listen(config.get('PORT'));
}
bootstrap();
