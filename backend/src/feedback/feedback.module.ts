import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Feedback } from 'src/entities/feedback.entity';
import { Interview } from 'src/entities/interview.entity';
import { InterviewQuestion } from 'src/entities/interviewQuestion.entity';
import { SimpleQuestion } from 'src/entities/simpleQuestion.entity';
import { User } from 'src/entities/user.entity';
import { UserQuestion } from 'src/entities/userQuestion.entity';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Interview,
      Feedback,
      UserQuestion,
      InterviewQuestion,
      SimpleQuestion,
    ]),
    AuthModule,
  ],
  controllers: [FeedbackController],
  providers: [FeedbackService],
})
export class FeedbackModule {}
