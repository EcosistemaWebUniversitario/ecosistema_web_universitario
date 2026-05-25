import { IsInt, IsNotEmpty, IsString, Min, MaxLength, IsOptional, IsIn } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  ci: string;

  // sex eliminado

  @IsInt()
  @Min(1)
  academicYear: number;

  @IsInt()
  careerId: number;

  @IsInt()
  municipalityId: number;

  @IsOptional()
  @IsString()
  @IsIn(['REGULAR_DIURNO', 'REGULAR_VESPERTINO', 'DISTANCIA'])
  studyMode?: string;
}