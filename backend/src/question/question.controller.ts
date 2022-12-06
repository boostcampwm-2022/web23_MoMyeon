import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { QuestionService, UserQuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { CreateUserQuestionDto } from './dto/create-user-question.dto';
import { JwtGuard } from 'src/guards/jwtAuth.guard';
import { UserData } from 'src/user/user.decorator';
import { UserInfo } from 'src/interfaces/user.interface';

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
