import { CreateUserDto } from './create-user.dto';
import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends CreateUserDto {
  @IsNumber()
  @ApiProperty()
  id: number;
}
