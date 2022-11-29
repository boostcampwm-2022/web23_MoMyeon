import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { QuestionService, UserQuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { CreateUserQuestionDto } from './dto/create-user-question.dto';
import { UpdateUserQuestionDto } from './dto/update-user-question.dto';

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

  @Post()
  create(@Body() createUserQuestionDto: CreateUserQuestionDto) {
    return this.userQuestionService.create(createUserQuestionDto);
  }

  @Get()
  findAll() {
    return this.userQuestionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userQuestionService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserQuestionDto: UpdateUserQuestionDto,
  ) {
    return this.userQuestionService.update(+id, updateUserQuestionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userQuestionService.remove(+id);
  }
}
