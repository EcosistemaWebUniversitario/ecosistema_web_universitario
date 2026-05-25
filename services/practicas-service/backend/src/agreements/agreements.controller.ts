import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Query } from '@nestjs/common';

import { AgreementsService } from './agreements.service';
import { CreateAgreementDto } from './dto/create-agreement.dto';
import { SupabaseAuthGuard } from '../guards/supabase-auth.guard';   // guard de Supabase real
import { RolesGuard } from '../auth/guards/roles.guard';             // guard de roles real
import { Roles } from '../auth/decorators/roles.decorator';
import { ListAgreementsDto } from './dto/list-agreements.dto';

@UseGuards(SupabaseAuthGuard, RolesGuard)
@Controller('agreements')
export class AgreementsController {
  constructor(private readonly service: AgreementsService) {}

  @Roles('empresa')
  @Post()
  create(@Req() req: any, @Body() dto: CreateAgreementDto) {
    return this.service.create(req.user.id, dto);
  }

  @Roles('empresa')
  @Get('me')
  findMy(@Req() req: any) {
    return this.service.findMy(req.user.id);
  }

  @Roles('admin_practicas', 'admin_prelocalizacion', 'super_admin')
  @Get()
  findAll(@Query() query: ListAgreementsDto) {
    return this.service.findAll(query);
  }

  @Roles('admin_practicas', 'super_admin')
  @Patch(':id/approve-practices')
  approvePractices(@Param('id') id: string) {
    return this.service.approveByPractices(Number(id));
  }

  @Roles('admin_prelocalizacion', 'super_admin')
  @Patch(':id/approve-prelocalization')
  approvePrelocalization(@Param('id') id: string) {
    return this.service.approveByPrelocation(Number(id));
  }

  @Roles('admin_practicas', 'admin_prelocalizacion', 'super_admin')
  @Patch(':id/reject')
  reject(@Param('id') id: string) {
    return this.service.reject(Number(id));
  }
}