import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/guards/jwtAuth.guard';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UserInfo } from 'src/interfaces/user.interface';
import { UserData } from './user.decorator';
import { UserService } from './user.service';
import { Resume } from 'src/entities/resume.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Controller({ version: '1', path: 'user' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('info')
  @UseGuards(JwtGuard)
  getUserInfo(@UserData() userData: UserInfo) {
    const { id, nickname, profile } = userData;
    return { id, nickname, profile };
  }
}
@Controller({ version: '1', path: 'user/resume' })
export class UserResumeController {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(Resume)
    private readonly resumeRepository: Repository<Resume>,
  ) {}

  @UseGuards(JwtGuard)
  @Post()
  async create(
    @Body() createResumeDto: CreateResumeDto,
    @UserData() userData: UserInfo,
  ) {
    createResumeDto['user'] = userData.id;
    if (!createResumeDto.content)
      throw new BadRequestException('content를 입력해 주세요');
    let itemChecked = false;
    const item = await this.userService.getItem();
    item.forEach((element) => {
      if (element.itemId === +createResumeDto['item']) itemChecked = true;
    });
    if (!itemChecked)
      throw new BadRequestException('올바른 item id를 입력해 주세요');
    return this.userService.createResume(createResumeDto);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll(@UserData() userData: UserInfo) {
    return this.userService.getResume(userData.id);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @UserData() userData: UserInfo) {
    return this.userService.removeResume(+id, userData.id);
  }
}

@Controller({ version: '1', path: 'user/interview' })
export class UserinterviewController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get()
  findAll(@UserData() userData: UserInfo) {
    return this.userService.getInterview(userData.id);
  }
}
