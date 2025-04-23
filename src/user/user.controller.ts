import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BaseResponse } from 'src/common/dto/base-response.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const result = await this.userService.create(createUserDto);
    return new BaseResponse(result, 'Add user successful', HttpStatus.OK);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const result = await this.userService.findOne(+id);
    return new BaseResponse(result, 'Get user successfull', HttpStatus.OK);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const result = await this.userService.update(+id, updateUserDto);
    return new BaseResponse(result, 'Update user successfull', HttpStatus.OK);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.userService.remove(+id);
    return new BaseResponse(result, 'Delete  user successfull', HttpStatus.OK);
  }
}
