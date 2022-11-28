import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GithubLoginDto } from './dto/github-login.dto';

@Controller({ version: '1', path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('github')
  async githubLogin(@Body() githubLoginDto: GithubLoginDto) {
    try {
      const userData = await this.authService.githubLogin(githubLoginDto);
      return { userData };
    } catch (err) {
      console.error(err);
      return { message: 'failed' };
    }
  }
}
