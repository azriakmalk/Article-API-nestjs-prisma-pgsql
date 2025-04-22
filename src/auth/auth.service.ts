import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { throwError } from 'src/common/utils/throw-error.util';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];

  async login(username: string, pass: string) {
    try {
      const user = this.users.find((user) => user.username === username);

      if (user?.password !== pass) {
        throw new UnauthorizedException();
      }

      const payload = { userId: user.userId, username: user.username };
      const data = {
        access_token: this.jwtService.sign(payload, {
          expiresIn: '15m',
          secret: process.env.JWT_ACCESS_SECRET,
        }),
        refresh_token: this.jwtService.sign(payload, {
          expiresIn: '7d',
          secret: process.env.JWT_REFRESH_SECRET,
        }),
      };

      return data;
    } catch (error) {
      throwError(error);
    }
  }

  async refres(refresh_token: string) {
    try {
      const data = {
        refresh_token: this.jwtService.sign(
          {},
          {
            expiresIn: '7d',
            secret: process.env.JWT_REFRESH_SECRET,
          },
        ),
      };
      return data;
    } catch (error) {
      throwError(error);
    }
  }
}
