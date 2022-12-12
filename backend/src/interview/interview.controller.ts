import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { InterviewService } from './interview.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { SelectInterviewDto } from './dto/select-interview.dto';
import { JwtGuard } from 'src/guards/jwtAuth.guard';
import { UserInfo } from 'src/interfaces/user.interface';
import { UserData } from 'src/user/user.decorator';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { InterviewGuard } from 'src/guards/interview.guard';

@Controller({ version: '1', path: 'interview' })
export class InterviewController {
  constructor(
    private readonly interviewService: InterviewService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @UseGuards(JwtGuard)
  @Post()
  async create(
    @Body() createInterviewDto: CreateInterviewDto,
    @UserData() userData: UserInfo,
  ) {
    createInterviewDto['user'] = userData.id;
    createInterviewDto['userId'] = userData.id;
    const interviewId = await this.interviewService.create(createInterviewDto);
    await this.interviewService.applyInterview(+interviewId.id, userData);
    return { id: interviewId.id, message: 'success' };
  }

  @Get()
  findAll(@Query() selectInterviewDto: SelectInterviewDto) {
    return this.interviewService.findQuery(selectInterviewDto);
  }

  @Get(':id')
  async loginFindOne(@Param('id') id: string, @Req() req: any) {
    try {
      if (!req.cookies) return this.interviewService.findOne(+id);

      const jwtPayload = this.jwtService.verify(req.cookies.accessToken);
      const { oauth_provider, oauth_uid } = jwtPayload;

      const [user] = await this.userRepository.findBy({
        oauth_provider,
        oauth_uid,
      });
      if (!user) return this.interviewService.findOne(+id);

      return this.interviewService.loginFindOne(+id, user.id, user.nickname);
    } catch (err) {
      console.error(err);
      return this.interviewService.findOne(+id);
    }
  }

  @Get('members/:interviewId')
  getMembers(@Param('interviewId') interviewId: string) {
    return this.interviewService.getMembers(interviewId);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @UserData() userData: UserInfo,
    @Body() updateInterviewDto: UpdateInterviewDto,
  ) {
    return this.interviewService.update(+id, userData.id, updateInterviewDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @UserData() userData: UserInfo) {
    return this.interviewService.remove(+id, userData.id);
  }

  @Post('apply/:interviewId')
  @UseGuards(JwtGuard, InterviewGuard)
  async applyInterview(
    @Param('interviewId') interviewId: string,
    @UserData() userData: UserInfo,
  ) {
    await this.interviewService.applyInterview(+interviewId, userData);
    return { message: 'success' };
  }

  @UseGuards(JwtGuard)
  @Get('status/:id')
  userInterviewStatus(
    @Param('id') interviewId: string,
    @UserData() userData: UserInfo,
  ) {
    return this.interviewService.userInterviewStatus(
      +interviewId,
      userData.id,
      userData.nickname,
    );
  }
}
