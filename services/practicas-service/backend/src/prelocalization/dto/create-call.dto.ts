import { IsInt, Min } from 'class-validator';

export class CreateCallDto {
  @IsInt()
  careerId: number;

  @IsInt()
  @Min(1)
  academicYear: number;
}