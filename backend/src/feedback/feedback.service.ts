import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Redis from 'ioredis';
import { Feedback } from 'src/entities/feedback.entity';
import { UserInfo } from 'src/interfaces/user.interface';
import { Repository } from 'typeorm';
import { SaveFeedbackDto } from './dto/save-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
  ) {}

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

      const result: number = await this.redis.hset(
        `question:${interviewId}`,
        `${fromId}:${toId}:${type}:${questionId}`,
        feedback,
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

        return this.feedbackRepository.create({
          interviewId,
          question_type: type,
          question_id: questionId,
          content: value,
          user_from: fromId,
          user_to: toId,
        });
      });
      await this.feedbackRepository.save(feedbacks);
      return feedbacks.length;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('피드백 저장 실패');
    }
  }

  // async getAllFeedbacks(interviewId: string) {}
}
