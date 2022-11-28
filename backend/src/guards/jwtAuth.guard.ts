import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = request.cookies?.['accessToken'];
      if (!token) throw new UnauthorizedException('토큰 정보 없음');

      const jwtPayload = this.jwtService.verify(token);
      const { oauth_provider, oauth_uid } = jwtPayload;

      const [user] = await this.userRepository.findBy({
        oauth_provider,
        oauth_uid,
      });
      if (!user) {
        throw new UnauthorizedException('회원 정보 없음');
      }
      const { nickname, profile } = user;
      request.user = {
        oauth_provider,
        oauth_uid: oauth_uid.toString(),
        nickname,
        profile,
      };

      return true;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException();
    }
  }

  verifyToken(token: string) {
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
