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
  Query,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import { BaseResponse, PaginationDto, SearchAndSortDto } from 'src/common/dto';
import { JwtAuthGuard } from 'src/auth/guards';
import { CreateUserDto, UpdateUserDto } from './dto';

@Controller('user')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Req() req: Request, @Body() createUserDto: CreateUserDto) {
    const result = await this.userService.create(req, createUserDto);
    return new BaseResponse(result, 'Add user successful', HttpStatus.OK);
  }

  @Get()
  async findAll(
    @Req() req: Request,
    @Query() paginationData: PaginationDto,
    @Query() searchandsortData: SearchAndSortDto,
  ) {
    const result = await this.userService.findAll(
      req,
      paginationData,
      searchandsortData,
    );
    return new BaseResponse(result, 'Get all user successful', HttpStatus.OK);
  }

  @Get(':id')
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const result = await this.userService.findOne(req, +id);
    return new BaseResponse(result, 'Get user successfull', HttpStatus.OK);
  }

  @Put(':id')
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const result = await this.userService.update(req, +id, updateUserDto);
    return new BaseResponse(result, 'Update user successfull', HttpStatus.OK);
  }

  @Delete(':id')
  async remove(@Req() req: Request, @Param('id') id: string) {
    const result = await this.userService.remove(req, +id);
    return new BaseResponse(result, 'Delete  user successfull', HttpStatus.OK);
  }
}
