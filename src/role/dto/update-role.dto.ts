import { IsNumber } from 'class-validator';
import { CreateRoleDto } from '.';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleDto extends CreateRoleDto {
  @IsNumber()
  @ApiProperty()
  id: number;
}
