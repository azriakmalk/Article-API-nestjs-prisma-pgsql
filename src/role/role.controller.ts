import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Req,
  UseGuards,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from 'src/auth/guards';
import { BaseResponse, PaginationDto, SearchAndSortDto } from 'src/common';

@Controller('role')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  async create(@Req() req: Request, @Body() createRoleDto: CreateRoleDto) {
    const result = await this.roleService.create(req, createRoleDto);

    return new BaseResponse(result, 'Add role successful', HttpStatus.OK);
  }

  @Get()
  async findAll(
    @Req() req: Request,
    @Query() paginationData: PaginationDto,
    @Query() searchandsortData: SearchAndSortDto,
  ) {
    const result = await this.roleService.findAll(
      req,
      paginationData,
      searchandsortData,
    );

    return new BaseResponse(result, 'Get all role successful', HttpStatus.OK);
  }

  @Get(':id')
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const result = await this.roleService.findOne(req, +id);

    return new BaseResponse(result, 'Get role successfull', HttpStatus.OK);
  }

  @Patch(':id')
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    const result = await this.roleService.update(req, +id, updateRoleDto);

    return new BaseResponse(result, 'Update role successfull', HttpStatus.OK);
  }

  @Delete(':id')
  async remove(@Req() req: Request, @Param('id') id: string) {
    const result = await this.roleService.remove(req, +id);

    return new BaseResponse(result, 'Delete role successfull', HttpStatus.OK);
  }
}
