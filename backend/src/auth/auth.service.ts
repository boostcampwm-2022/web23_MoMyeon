import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { GithubLoginDto } from './dto/github-login.dto';
import { UserPayload } from '../interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async githubLogin(githubLoginDto: GithubLoginDto) {
    try {
      const { code } = githubLoginDto;

      const githubAccessData = await this.getGithubAccessData(code);
      const githubAccessToken = githubAccessData.access_token;
      const githubUserData = await this.getGithubUserData(githubAccessToken);
      const {
        id: uid,
        login: nickname,
        avatar_url: profile,
      }: { id: string; login: string; avatar_url: string } = githubUserData;

      const payload: UserPayload = {
        oauth_provider: 'github',
        oauth_uid: uid,
      };

      const exUser = await this.userRepository.findOneBy(payload);

      if (!exUser) {
        const newUser = this.userRepository.create(payload);
        await this.userRepository.save(newUser);
      }

      const accessToken = this.signAccessToken(payload);
      const refreshToken = this.signRefreshToken();

      // TODO: refreshToken을 User 테이블에 저장

      return { accessToken, refreshToken, nickname, profile };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('서버 내부 에러');
    }
  }

  async getGithubAccessData(code: string) {
    try {
      const githubResponse = await firstValueFrom(
        this.httpService.post(
          `https://github.com/login/oauth/access_token`,
          {
            client_id: this.configService.get('GITHUB_CLIENT_ID'),
            client_secret: this.configService.get('GITHUB_CLIENT_SECRET'),
            code,
          },
          {
            headers: {
              accept: 'application/json',
            },
          },
        ),
      );
      return githubResponse.data;
    } catch (err) {
      console.error(err);
      throw new UnauthorizedException('github oauth api 요청 실패');
    }
  }

  async getGithubUserData(token: string) {
    try {
      const githubUserResponse = await firstValueFrom(
        this.httpService.get(`https://api.github.com/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      );

      return githubUserResponse.data;
    } catch (err) {
      console.error(err);
      throw new UnauthorizedException('github user api 요청 실패');
    }
  }

  signAccessToken(paylod: UserPayload) {
    return this.jwtService.sign(paylod, {
      algorithm: 'HS256',
      expiresIn: '1h',
    });
  }

  signRefreshToken() {
    return this.jwtService.sign(
      {},
      {
        algorithm: 'HS256',
        expiresIn: '14d',
      },
    );
  }
}
