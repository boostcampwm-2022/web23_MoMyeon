import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterviewModule } from './interview/interview.module';

import { CategoryModule } from './category/category.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

import { AppLoggerMiddleware } from './middlewares/appLoger.middleware';
import { QuestionModule } from './question/question.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { FeedbackModule } from './feedback/feedback.module';

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
        // synchronize: env === 'development',
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        config: {
          host: config.get('REDIS_HOST'),
          port: config.get('REDIS_PORT'),
          password: config.get('REDIS_PW'),
        },
      }),
      inject: [ConfigService],
    }),

    InterviewModule,
    CategoryModule,
    UserModule,
    AuthModule,
    QuestionModule,
    FeedbackModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
