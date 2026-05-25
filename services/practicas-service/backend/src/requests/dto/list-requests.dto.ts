import { IsEnum, IsOptional } from 'class-validator';
import { request_status } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class ListRequestsDto extends PaginationDto {
  @IsOptional()
  @IsEnum(request_status)
  status?: request_status;
}