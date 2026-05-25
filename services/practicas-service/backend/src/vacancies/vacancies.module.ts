import { Module } from '@nestjs/common';
import { VacanciesController } from './vacancies.controller';
import { VacanciesService } from './vacancies.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PublicVacanciesController } from './public-vacancies.controller';

@Module({
  imports: [PrismaModule],
  controllers: [VacanciesController,PublicVacanciesController],
  providers: [VacanciesService],
})
export class VacanciesModule {}