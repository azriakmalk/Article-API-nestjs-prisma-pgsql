import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class SearchAndSortDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  public search: string;

  @IsOptional()
  @ApiPropertyOptional()
  sort_column?: string;

  @ValidateIf((_, value) => !!value) // Validate only if sort_desc is provided
  @IsNotEmpty({
    message: 'sort_desc is required when sort_column is provided',
    groups: ['sort'],
  })
  @IsIn(['asc', 'desc'], { message: 'sort_desc must be "asc" or "desc"' })
  @ApiPropertyOptional()
  sort_desc?: string;

  @IsOptional()
  @ApiPropertyOptional()
  search_column?: string;

  @IsOptional()
  @ApiPropertyOptional()
  search_text?: string;
}
