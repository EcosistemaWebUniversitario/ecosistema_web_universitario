// src/vacancies/public-vacancies.controller.ts
import { Controller, Get } from '@nestjs/common';
import { VacanciesService } from './vacancies.service';

@Controller('public/vacancies')
export class PublicVacanciesController {
  constructor(private readonly vacanciesService: VacanciesService) {}

  @Get()
  findOpen() {
    return this.vacanciesService.findOpen();
  }
}