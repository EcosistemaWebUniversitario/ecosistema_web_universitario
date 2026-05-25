import { IsEnum, IsOptional, IsInt } from 'class-validator';
import { vacancy_status } from '@prisma/client';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class ListVacanciesDto extends PaginationDto {
  @IsOptional()
  @IsEnum(vacancy_status)
  status?: vacancy_status;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  agreementId?: number;
}