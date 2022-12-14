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
import { UserInfo } from '../interfaces/user.interface';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRedis() private readonly redis: Redis,
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

      const userData = { oauth_provider: 'github', oauth_uid: uid };
      const exUser = await this.userRepository.findOneBy(userData);
      let userId: number;

      if (!exUser) {
        const newUser = this.userRepository.create({
          ...userData,
          nickname,
          profile,
        });
        await this.userRepository.save(newUser);
        userId = newUser.id;
      } else userId = exUser.id;

      const userInfo: UserInfo = {
        ...userData,
        nickname,
        profile,
        id: userId,
      };

      const accessToken = this.signAccessToken(userInfo);
      const refreshToken = this.signRefreshToken();

      await this.redis.set(`refresh:${userId}`, refreshToken);

      return { accessToken, refreshToken };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('????????? ????????? ??????');
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
      throw new UnauthorizedException('github oauth api ?????? ??????');
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
      throw new UnauthorizedException('github user api ?????? ??????');
    }
  }

  signAccessToken(paylod: UserInfo) {
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
