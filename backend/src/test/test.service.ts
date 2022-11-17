import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TestService {
  constructor(private configService: ConfigService) {}

  getTest() {
    return this.configService.get('TEST') + 'hi';
  }
}
