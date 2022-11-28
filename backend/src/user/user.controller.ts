import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/guards/jwtAuth.guard';
import { UserPayload } from 'src/interfaces/user.interface';
import { UserData } from './user.decorator';
import { UserService } from './user.service';

@Controller({ version: '1', path: 'user' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('info')
  @UseGuards(JwtGuard)
  async getUserInfo(@UserData() userData: UserPayload) {
    try {
      console.log(userData);
      return userData;
    } catch (err) {
      console.error(err);
      return { message: 'failed' };
    }
  }
}
