import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Interview } from 'src/entities/interview.entity';
import { UserInfo } from 'src/interfaces/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class HostGuard implements CanActivate {
  constructor(
    @InjectRepository(Interview)
    private readonly interviewRepository: Repository<Interview>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request: Request = context.switchToHttp().getRequest();
      const interviewId = +request.params.interviewId;
      const userInfo = request['user'] as UserInfo;
      const { id: userId } = userInfo;

      const [found] = await this.interviewRepository.findBy({
        id: interviewId,
      });
      if (found.user.id !== userId) {
        throw new UnauthorizedException('호스트가 아닙니다');
      }

      return true;
    } catch (err) {
      console.error(err);
      if (err.status !== HttpStatus.UNAUTHORIZED) {
        throw new InternalServerErrorException('DB 오류');
      }
      throw err;
    }
  }
}
