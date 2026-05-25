import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { VacanciesService } from './vacancies.service';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { SupabaseAuthGuard } from '../guards/supabase-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ListVacanciesDto } from './dto/list-vacancies.dto';

@UseGuards(SupabaseAuthGuard, RolesGuard)
@Controller('vacancies')
export class VacanciesController {
  constructor(private readonly vacanciesService: VacanciesService) {}

  @Roles('empresa')
  @Post(':agreementId')
  create(
    @Req() req: any,
    @Param('agreementId') agreementId: string,
    @Body() dto: CreateVacancyDto,
  ) {
    return this.vacanciesService.create(req.user.id, Number(agreementId), dto);
  }

  @Roles('admin_practicas', 'super_admin', 'empresa')
  @Get()
  findAll(@Query() query: ListVacanciesDto) {
    return this.vacanciesService.findAll(query);
  }

  @Roles('admin_practicas', 'super_admin', 'empresa')
  @Get('agreement/:agreementId')
  findByAgreement(@Param('agreementId') agreementId: string) {
    return this.vacanciesService.findByAgreement(Number(agreementId));
  }

  @Roles('admin_practicas', 'super_admin', 'empresa')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vacanciesService.findOne(Number(id));
  }

  @Roles('admin_practicas', 'super_admin')
  @Patch(':id/toggle')
  toggleStatus(@Param('id') id: string) {
    return this.vacanciesService.toggleStatus(Number(id));
  }
}