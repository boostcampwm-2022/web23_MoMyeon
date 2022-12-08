import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Interview } from 'src/entities/interview.entity';
import { Item } from 'src/entities/item.entity';
import { Resume } from 'src/entities/resume.entity';
import { User } from 'src/entities/user.entity';
import { UserInterview } from 'src/entities/userInterview.entity';
import {
  UserController,
  UserinterviewController,
  UserResumeController,
} from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Resume]),
    TypeOrmModule.forFeature([Item]),
    TypeOrmModule.forFeature([Interview]),
    TypeOrmModule.forFeature([UserInterview]),
    AuthModule,
  ],
  controllers: [UserController, UserResumeController, UserinterviewController],
  providers: [UserService],
})
export class UserModule {}
