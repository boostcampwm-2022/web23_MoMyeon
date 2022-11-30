import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/guards/jwtAuth.guard';
import { UserInfo } from 'src/interfaces/user.interface';
import { UserData } from './user.decorator';
import { UserService } from './user.service';

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
