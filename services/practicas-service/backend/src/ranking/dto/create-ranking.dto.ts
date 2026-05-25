import { IsInt, Min } from 'class-validator';

export class CreateRankingDto {
  @IsInt()
  studentId: number;

  @IsInt()
  @Min(1)
  position: number;
}