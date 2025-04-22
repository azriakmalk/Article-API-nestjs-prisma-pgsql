import {
  Body,
  Controller,
  HttpStatus,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';
import { BaseResponse } from 'src/common/dto/base-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body(new ValidationPipe()) loginDto: LoginDto) {
    const result = await this.authService.login(
      loginDto.username,
      loginDto.password,
    );

    return new BaseResponse(result, 'Login successful', HttpStatus.OK);
  }
}
