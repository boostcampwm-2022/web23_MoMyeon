import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TestModule } from './test/test.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from './category/category.module';

const env = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${__dirname}/config/.env.${env}`,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST'),
        port: config.get('DB_PORT'),
        username: config.get('DB_USER'),
        password: config.get('DB_PW'),
        database: config.get('DB_NAME') as string,
        entities: [`${__dirname}/**/*.entity.{js,ts}`],
        synchronize: env === 'development',
      }),
      inject: [ConfigService],
    }),

    TestModule,

    CategoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
