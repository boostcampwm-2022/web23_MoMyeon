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

@Module({
  imports: [
    TypeOrmModule.forFeature([SimpleQuestion]),
    TypeOrmModule.forFeature([Feedback]),
    TypeOrmModule.forFeature([Interview]),
    TypeOrmModule.forFeature([UserInterview]),
    TypeOrmModule.forFeature([InterviewCategory]),
    TypeOrmModule.forFeature([Category]),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [QuestionController, UserQuestionController],
  providers: [QuestionService, UserQuestionService],
})
export class QuestionModule {}
