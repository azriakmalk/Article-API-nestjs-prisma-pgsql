import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { user } from '@prisma/client';
import { randomUUID } from 'crypto';
import { throwError } from 'src/common/utils/throw-error.util';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  generateAccessToken(user: user): string {
    try {
      const access_token = this.jwtService.sign(
        {
          userId: user.id,
          username: user.username,
          email: user.email,
        },
        {
          expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m',
          secret: process.env.JWT_ACCESS_SECRET,
        },
      );
      return access_token;
    } catch (error) {
      throwError(error);
    }
  }

  generateRefreshToken(req: Request, user: user): string {
    try {
      const jti = randomUUID();
      const ip = req['ip'];
      const deviceInfo = req.headers['user-agent'];

      const refresh_token = this.jwtService.sign(
        {
          jti,
        },
        {
          expiresIn: process.env.JWT_REFRESH_EXPIRES || '1d',
          secret: process.env.JWT_REFRESH_SECRET,
        },
      );

      this.prisma.$transaction(async (tx) => {
        try {
          const decode = await this.jwtService.decode(refresh_token);
          const exp = decode['exp'];

          await tx.user_auth.updateMany({
            data: {
              is_active: false,
            },
            where: {
              user_id: user.id,
            },
          });

          await tx.user_auth.create({
            data: {
              jti,
              user_id: user.id,
              is_active: true,
              refresh_token: refresh_token,
              ip_address: ip,
              device_info: deviceInfo,
              expires_at: new Date(exp * 1000),
            },
          });
        } catch (error) {
          console.log(error);
        }
      });
      return refresh_token;
    } catch (error) {
      throwError(error);
    }
  }
}
