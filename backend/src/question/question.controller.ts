import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
  BadGatewayException,
} from '@nestjs/common';
import {
  InterviewQuestionService,
  QuestionService,
  UserQuestionService,
} from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { CreateUserQuestionDto } from './dto/create-user-question.dto';
import { JwtGuard } from 'src/guards/jwtAuth.guard';
import { UserData } from 'src/user/user.decorator';
import { UserInfo } from 'src/interfaces/user.interface';
import { CreateInterviewQuestionDto } from './dto/create-interview-question.dto';

@Controller({ version: '1', path: 'question' })
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionService.create(createQuestionDto);
  }

  @Get()
  findAll() {
    return this.questionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionService.findTemporaryRoomQuestion(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionService.update(+id, updateQuestionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionService.remove(+id);
  }
}

@Controller({ version: '1', path: 'user/question' })
export class UserQuestionController {
  constructor(private readonly userQuestionService: UserQuestionService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(
    @Body() createUserQuestionDto: CreateUserQuestionDto,
    @UserData() userData: UserInfo,
  ) {
    createUserQuestionDto['user'] = userData.id;
    return this.userQuestionService.create(createUserQuestionDto);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll(@UserData() userData: UserInfo) {
    return this.userQuestionService.findAll(userData.id);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @UserData() userData: UserInfo) {
    return this.userQuestionService.remove(+id, userData.id);
  }
}
@Controller({ version: '1', path: 'interview/question' })
export class InterviewQuestionController {
  constructor(private readonly intervewService: InterviewQuestionService) {}

  @UseGuards(JwtGuard)
  @Post()
  async create(
    @Body() createQuestionDto: CreateInterviewQuestionDto,
    @UserData() userData: UserInfo,
  ) {
    if (!createQuestionDto.interview_id)
      throw new BadRequestException('interviewId를 확인해주세요');
    //createQuestionDto.interview_id 조회
    const userInterviewInfo = await this.intervewService.getInterviewUser(
      createQuestionDto.interview_id,
    );
    const userChecked = { userTo: false, userFrom: false };
    let userToName: string;
    userInterviewInfo.forEach((element) => {
      //createQuestionDto.interviewee_id check
      if (element.userId === createQuestionDto.interviewee_id) {
        userChecked.userTo = true;
        userToName = element.userName;
      }
      //userData.id check
      if (element.userId === userData.id) userChecked.userFrom = true;
    });
    if (!(userChecked.userTo && userChecked.userFrom))
      throw new BadRequestException('해당 인터뷰의 참가자 아닙니다.');
    //createQuestionDto.content
    if (!createQuestionDto.content)
      throw new BadRequestException('질문에 공란을 둘 수 없습니다.');

    console.log(createQuestionDto);
    const createInterviewQuestionData = {
      content: createQuestionDto.content,
      interview: createQuestionDto.interview_id,
      interviewId: createQuestionDto.interview_id,
      user: userData.id,
      userId: userData.id,
      user_to: createQuestionDto.interviewee_id,
      user_toName: userToName,
    };
    return this.intervewService.create(createInterviewQuestionData);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  find(@Param('id') id: string, @UserData() userData: UserInfo) {
    return this.intervewService.find(+id, userData.id);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @UserData() userData: UserInfo) {
    return this.intervewService.remove(+id, userData.id);
  }
}
