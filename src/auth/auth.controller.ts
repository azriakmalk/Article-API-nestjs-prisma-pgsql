import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';
import { BaseResponse } from 'src/common/dto/base-response.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(
    @Req() req: Request,
    @Body(new ValidationPipe()) loginDto: LoginDto,
  ) {
    const result = await this.authService.login(req, loginDto);

    return new BaseResponse(result, 'Login successful', HttpStatus.OK);
  }

  @Post('/refresh')
  @UseGuards(JwtRefreshGuard)
  async refresh(@Req() req: Request) {
    const result = await this.authService.refresh(req);

    return new BaseResponse(result, 'Refresh token successful', HttpStatus.OK);
  }

  @Post('/logout')
  @UseGuards(JwtRefreshGuard)
  async logout(@Req() req: Request) {
    const result = await this.authService.logout(req);
    return new BaseResponse(result, 'Logout successful', HttpStatus.OK);
  }
}
