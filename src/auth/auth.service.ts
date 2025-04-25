import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokenService } from './token.service';
import { LoginDto } from './dto';
import { throwError } from 'src/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async login(req: Request, loginDto: LoginDto) {
    try {
      const user = await this.userService.findByUsernameOrEmail(
        req,
        loginDto.username,
      );

      if (!user) {
        throw new BadRequestException('Invalid user / password');
      }

      const checkPassword = await bcrypt.compare(
        loginDto.password,
        user.password,
      );

      if (!checkPassword) {
        throw new UnauthorizedException('Invalid user / password');
      }

      const data = {
        access_token: this.tokenService.generateAccessToken(user),
        refresh_token: this.tokenService.generateRefreshToken(req, user),
      };

      return data;
    } catch (error) {
      throwError(error);
    }
  }

  async refresh(req: Request) {
    try {
      const jti = req['user']['jti'];
      const validateToken = await this.prisma.user_auth.findFirst({
        include: { user: true },
        where: {
          jti,
          is_active: true,
          deleted_at: null,
        },
      });

      if (!validateToken) throw new UnauthorizedException('Invalid token!');

      const data = {
        access_token: this.tokenService.generateAccessToken(validateToken.user),
        refresh_token: this.tokenService.generateRefreshToken(
          req,
          validateToken.user,
        ),
      };

      return data;
    } catch (error) {
      throwError(error);
    }
  }

  async logout(req: Request) {
    try {
      const jti = req['user']['jti'];
      const validateToken = await this.prisma.user_auth.findFirst({
        include: { user: true },
        where: {
          jti,
          is_active: true,
          deleted_at: null,
        },
      });

      if (!validateToken) throw new UnauthorizedException('Invalid token!');

      await this.prisma.user_auth.updateMany({
        data: {
          is_active: false,
        },
        where: {
          jti,
        },
      });
      return 'Successfully Logout!';
    } catch (error) {
      throwError(error);
    }
  }
}
