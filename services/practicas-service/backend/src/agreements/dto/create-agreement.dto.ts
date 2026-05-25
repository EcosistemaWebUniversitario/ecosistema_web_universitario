import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export enum AgreementTypeDto {
  PRACTICE = 'PRACTICE',
  PRELOCATION = 'PRELOCATION',
  BOTH = 'BOTH',
}

export class CreateAgreementDto {
  @IsEnum(AgreementTypeDto)
  type: AgreementTypeDto;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  specialty: string;

  @IsInt()
  @Min(1)
  studentsNeeded: number;

  @IsString()
  @IsOptional()
  bankProblemDocument?: string;
}