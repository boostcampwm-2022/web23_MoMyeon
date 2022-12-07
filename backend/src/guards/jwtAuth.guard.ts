import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserInfo } from '../interfaces/user.interface';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = request.cookies?.['accessToken'];
      if (!token) throw new UnauthorizedException('토큰 정보 없음');

      const userInfo = this.verifyToken(token);
      request.user = userInfo;

      return true;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  verifyToken(token: string): UserInfo {
    try {
      const verified = this.jwtService.verify(token);
      return verified;
    } catch (err) {
      console.error(err);
      switch (err.message) {
        case 'INVALID_TOKEN':
        case 'TOKEN_IS_ARRAY':
        case 'NO_USER':
          throw new UnauthorizedException('유효하지 않은 토큰');

        case 'EXPIRED_TOKEN':
          // TODO: refresh token으로 재발급
          throw new UnauthorizedException('토큰 기간 만료');

        default:
          throw new InternalServerErrorException('서버 내부 오류');
      }
    }
  }
}
