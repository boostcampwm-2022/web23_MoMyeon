import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TestModule } from './test/test.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${__dirname}/config/.env.${process.env.NODE_ENV}`,
    }),
    TestModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
