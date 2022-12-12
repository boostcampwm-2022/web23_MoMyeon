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
import { UserInterview } from 'src/entities/userInterview.entity';
import { UserInterviewStatus } from 'src/enum/userInterviewStatus.enum';
import { UserInfo } from 'src/interfaces/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class MemberGuard implements CanActivate {
  constructor(
    @InjectRepository(UserInterview)
    private readonly userInterviewRepository: Repository<UserInterview>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request: Request = context.switchToHttp().getRequest();
      const interviewId = +request.params.interviewId;
      const userInfo = request['user'] as UserInfo;
      const members = await this.userInterviewRepository.findBy({
        interviewId: interviewId,
        status: UserInterviewStatus.ACCEPTED,
      });
      const found = members.find((member) => member.userId === userInfo.id);
      if (!found) throw new UnauthorizedException('면접 멤버가 아닙니다.');

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
