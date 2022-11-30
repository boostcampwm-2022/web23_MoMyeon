import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { GithubLoginDto } from './dto/github-login.dto';

@Controller({ version: '1', path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('github')
  async githubLogin(
    @Body() githubLoginDto: GithubLoginDto,
    @Res() res: Response,
  ) {
    try {
      const userData = await this.authService.githubLogin(githubLoginDto);
      const { accessToken, refreshToken } = userData;

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60,
      });
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 14,
      });

      return { accessToken, refreshToken };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
