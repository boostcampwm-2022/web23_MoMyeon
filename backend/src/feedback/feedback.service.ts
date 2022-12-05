import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import Redis from 'ioredis';
import { UserInfo } from 'src/interfaces/user.interface';
import { SaveFeedbackDto } from './dto/save-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

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
        JSON.stringify({
          interviewer: fromName,
          interviewee: toName,
          content: feedback,
        }),
      );

      return result;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('피드백 저장 오류');
    }
  }

  // async getAllFeedbacks(interviewId: string) {
  //   this.redis.keys();
  // }
}
