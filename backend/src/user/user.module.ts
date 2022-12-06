import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Item } from 'src/entities/item.entity';
import { Resume } from 'src/entities/resume.entity';
import { User } from 'src/entities/user.entity';
import { UserController, UserResumeController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Resume]),
    TypeOrmModule.forFeature([Item]),
    AuthModule,
  ],
  controllers: [UserController, UserResumeController],
  providers: [UserService],
})
export class UserModule {}
