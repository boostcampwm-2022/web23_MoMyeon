import { InjectRedis } from '@liaoliaots/nestjs-redis';
import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import Redis from 'ioredis';
import { UserInfo } from '../interfaces/user.interface';

interface DecodedUserInfo extends UserInfo {
  iat: number;
  exp: number;
}
interface VerifiedResult {
  userInfo: UserInfo;
  refreshed: boolean;
}

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request: Request = context.switchToHttp().getRequest();
      const response: Response = context.switchToHttp().getResponse();
      const accessToken = request.cookies?.['accessToken'];
      const refreshToken = request.cookies?.['refreshToken'];
      if (!accessToken) throw new UnauthorizedException('토큰 정보 없음');

      const { userInfo, refreshed }: VerifiedResult = await this.verifyToken(
        accessToken,
        refreshToken,
      );

      if (refreshed) {
        const newAccessToken = this.signAccessToken(userInfo);
        response.cookie('accessToken', newAccessToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          maxAge: 24 * 60 * 60 * 1000,
        });
      }
      request['user'] = userInfo;

      return true;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async verifyToken(
    accessToken: string,
    refreshToken: string,
  ): Promise<VerifiedResult> {
    try {
      const userInfo = this.jwtService.verify(accessToken) as DecodedUserInfo;
      return { userInfo, refreshed: false };
    } catch (err) {
      switch (err.name) {
        case 'JsonWebTokenError':
          throw new UnauthorizedException('유효하지 않은 토큰');

        case 'TokenExpiredError':
          try {
            this.jwtService.verify(refreshToken);
            const { id, profile, nickname, oauth_provider, oauth_uid } =
              this.jwtService.decode(accessToken) as DecodedUserInfo;
            const userInfo: UserInfo = {
              id,
              profile,
              nickname,
              oauth_provider,
              oauth_uid,
            };
            const savedRefreshToken = await this.redis.get(`refresh:${id}`);

            if (savedRefreshToken === refreshToken) {
              return { userInfo, refreshed: true };
            }
            throw new UnauthorizedException('유저 정보 불일치');
          } catch (err) {
            console.error(err);
            if (err.status !== HttpStatus.UNAUTHORIZED) {
              throw new InternalServerErrorException('서버 내부 오류');
            }
            throw err;
          }

        default:
          throw new InternalServerErrorException('서버 내부 오류');
      }
    }
  }

  signAccessToken(paylod: UserInfo) {
    return this.jwtService.sign(paylod, {
      algorithm: 'HS256',
      expiresIn: '1h',
    });
  }
}
