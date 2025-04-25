import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtRefreshGuard } from './guards';
import { LoginDto } from './dto';
import { BaseResponse } from 'src/common';

@Controller('auth')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
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
