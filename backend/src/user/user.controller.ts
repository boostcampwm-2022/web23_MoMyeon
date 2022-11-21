import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { JwtGuard } from 'src/guards/jwtAuth.guard';
import { UserData } from './user.decorator';
import { UserService } from './user.service';

@Controller({ version: '1', path: 'user' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtGuard)
  getUser(@UserData() user: User) {
    return user;
  }
}
