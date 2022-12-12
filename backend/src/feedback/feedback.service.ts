import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Redis from 'ioredis';
import { Feedback } from 'src/entities/feedback.entity';
import { InterviewQuestion } from 'src/entities/interviewQuestion.entity';
import { SimpleQuestion } from 'src/entities/simpleQuestion.entity';
import { UserQuestion } from 'src/entities/userQuestion.entity';
import { QuestionType } from 'src/enum/questionType.enum';
import { FeedbackInfo } from 'src/interfaces/feedback.interface';
import { UserInfo } from 'src/interfaces/user.interface';
import { Repository } from 'typeorm';
import { SaveFeedbackDto } from './dto/save-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    @InjectRepository(UserQuestion)
    private readonly userQuestionRepository: Repository<UserQuestion>,
    @InjectRepository(InterviewQuestion)
    private readonly interviewQuestionRepository: Repository<InterviewQuestion>,
    @InjectRepository(SimpleQuestion)
    private readonly simpleQuestionRepository: Repository<SimpleQuestion>,
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
  ) {}

  selectQuestionRepository(type: QuestionType) {
    switch (type) {
      case QuestionType.INTERVIEW:
        return this.interviewQuestionRepository;
      case QuestionType.SIMPLE:
        return this.simpleQuestionRepository;
      case QuestionType.USER:
        return this.userQuestionRepository;
      default:
        throw new InternalServerErrorException('잘못된 DB 접근');
    }
  }

  async saveFeedback(
    interviewId: number,
    saveFeedbackDto: SaveFeedbackDto,
    userData: UserInfo,
  ): Promise<number> {
    try {
      const { id: fromId, nickname: fromName } = userData;
      const {
        userId: toId,
        nickname: toName,
        type,
        questionId,
        feedback,
      } = saveFeedbackDto;

      const [question] = await this.selectQuestionRepository(type).findBy({
        id: questionId,
      });

      const result: number = await this.redis.hset(
        `question:${interviewId}`,
        `${fromId}:${toId}:${type}:${questionId}`,
        JSON.stringify({
          fromName,
          toName,
          feedback,
          questionContent: question.content,
        }),
      );

      return result;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('피드백 임시 저장 실패');
    }
  }

  async saveAllFeedback(interviewId: number) {
    try {
      const result = await this.redis.hgetall(`question:${interviewId}`);

      const feedbacks = Object.entries(result).map(([key, value]) => {
        const [fromId, toId, type, questionId] = key.split(':').map((n) => +n);
        const { fromName, toName, feedback, questionContent } =
          JSON.parse(value);

        return this.feedbackRepository.create({
          interviewId,
          question_type: type,
          question_id: questionId,
          content: feedback,
          user_from: fromId,
          user_to: toId,
          user_fromName: fromName,
          user_toName: toName,
          questionContent,
        });
      });
      await this.feedbackRepository.save(feedbacks);

      await this.redis.del(`question:${interviewId}`);

      return feedbacks.length;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('피드백 저장 실패');
    }
  }

  async getAllFeedbacks(interviewId: number) {
    const feedbacks = await this.feedbackRepository.findBy({
      interviewId,
    });

    const result = feedbacks.reduce((acc: any, cur: any) => {
      const {
        question_type,
        question_id,
        user_to,
        user_fromName,
        user_toName,
        content,
        questionContent,
      } = cur;

      const found = acc.find((userTo) => userTo.userId === user_to);

      const feedbackInfo: FeedbackInfo = {
        nickname: user_fromName,
        type: question_type,
        id: question_id,
        contents: questionContent,
        feedback: content,
        isScrapped: false, // TODO: 스크랩 여부
      };

      if (!found) {
        acc.push({
          userId: user_to,
          userName: user_toName,
          question: [feedbackInfo],
        });
        return acc;
      }

      found.question.push(feedbackInfo);
      return acc;
    }, []);

    return { feedbacks: result };
  }
}
