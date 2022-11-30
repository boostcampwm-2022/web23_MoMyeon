import { Module } from '@nestjs/common';
import { InterviewService } from './interview.service';
import { InterviewController } from './interview.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interview } from 'src/entities/interview.entity';
import { Category } from 'src/entities/category.entity';
import { InterviewCategory } from 'src/entities/interviewCategory.entity';
import { UserInterview } from 'src/entities/userInterview.entity';
import { Resume } from 'src/entities/resume.entity';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Interview]),
    TypeOrmModule.forFeature([Category]),
    TypeOrmModule.forFeature([InterviewCategory]),
    TypeOrmModule.forFeature([UserInterview]),
    TypeOrmModule.forFeature([Resume]),
  ],
  controllers: [InterviewController],
  providers: [InterviewService],
})
export class InterviewModule {}
