import { IsEnum, IsOptional, IsInt } from 'class-validator';
import { call_status } from '@prisma/client';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class ListCallsDto extends PaginationDto {
  @IsOptional()
  @IsEnum(call_status)
  status?: call_status;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  careerId?: number;
}