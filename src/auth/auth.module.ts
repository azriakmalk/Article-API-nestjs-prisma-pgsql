import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokenService } from './token.service';
import { JwtStrategy } from './strategys/jwt-auth.strategy';
import { JwtRefreshStrategy } from './strategys/jwt-refresh.strategy';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    UserService,
    PrismaService,
    JwtStrategy,
    JwtRefreshStrategy,
  ],
})
export class AuthModule {}
