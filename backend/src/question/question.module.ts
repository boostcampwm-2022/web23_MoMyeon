import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SimpleQuestion } from 'src/entities/simpleQuestion.entity';
import { Feedback } from 'src/entities/feedback.entity';
import { Interview } from 'src/entities/interview.entity';
import { UserInterview } from 'src/entities/userInterview.entity';
import { InterviewCategory } from 'src/entities/interviewCategory.entity';
import { Category } from 'src/entities/category.entity';
import { QuestionService, UserQuestionService } from './question.service';
import {
  QuestionController,
  UserQuestionController,
} from './question.controller';
import { User } from 'src/entities/user.entity';
import { UserQuestion } from 'src/entities/userQuestion.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([SimpleQuestion]),
    TypeOrmModule.forFeature([Feedback]),
    TypeOrmModule.forFeature([Interview]),
    TypeOrmModule.forFeature([UserInterview]),
    TypeOrmModule.forFeature([InterviewCategory]),
    TypeOrmModule.forFeature([Category]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([UserQuestion]),
  ],
  controllers: [QuestionController, UserQuestionController],
  providers: [QuestionService, UserQuestionService],
})
export class QuestionModule {}
