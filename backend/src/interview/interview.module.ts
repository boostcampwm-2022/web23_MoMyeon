import { Module } from '@nestjs/common';
import { InterviewService } from './interview.service';
import { InterviewController } from './interview.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interview } from 'src/entities/interview.entity';
import { Category } from 'src/entities/category.entity';
import { InterviewCategory } from 'src/entities/interviewCategory.entity';
import { UserInterview } from 'src/entities/userInterview.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Interview]),
    TypeOrmModule.forFeature([Category]),
    TypeOrmModule.forFeature([InterviewCategory]),
    TypeOrmModule.forFeature([UserInterview]),
  ],
  controllers: [InterviewController],
  providers: [InterviewService],
})
export class InterviewModule {}
