import { IsEnum, IsOptional } from 'class-validator';
import { agreement_status, agreement_type } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class ListAgreementsDto extends PaginationDto {
  @IsOptional()
  @IsEnum(agreement_status)
  status?: agreement_status;

  @IsOptional()
  @IsEnum(agreement_type)
  type?: agreement_type;
}