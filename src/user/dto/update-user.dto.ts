import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { CreateUserDto } from '.';

export class UpdateUserDto extends CreateUserDto {
  @IsNumber()
  @ApiProperty()
  id: number;
}
