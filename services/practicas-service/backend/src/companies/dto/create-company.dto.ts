import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(11)
  phone?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  address?: string;

  @IsInt()
  municipalityId: number;
}