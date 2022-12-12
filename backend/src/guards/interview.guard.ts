import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Interview } from 'src/entities/interview.entity';
import { InterviewStatus } from 'src/enum/userInterviewStatus.enum';
import { Repository } from 'typeorm';

@Injectable()
export class InterviewGuard implements CanActivate {
  constructor(
    @InjectRepository(Interview)
    private readonly interviewRepository: Repository<Interview>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const interviewId: number = +request.params.interviewId;
    const [interview] = await this.interviewRepository.findBy({
      id: interviewId,
    });

    if (!interview) throw new NotFoundException('면접 정보가 없습니다.');

    const interviewStatus: InterviewStatus = interview.status;
    if (interviewStatus === InterviewStatus.ENDED) {
      throw new ForbiddenException('이미 마감된 모의면접입니다.');
    }
    if (interviewStatus === InterviewStatus.FEEDBACK) {
      throw new ForbiddenException('이미 종료된 모의면접입니다.');
    }
    return true;
  }
}
