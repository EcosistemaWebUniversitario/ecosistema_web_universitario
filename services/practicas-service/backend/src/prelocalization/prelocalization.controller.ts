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
import { PrelocalizationService } from './prelocalization.service';
import { CreateCallDto } from './dto/create-call.dto';
import { SupabaseAuthGuard } from '../guards/supabase-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ListCallsDto } from './dto/list-calls.dto';

@UseGuards(SupabaseAuthGuard, RolesGuard)
@Controller('prelocalization/calls')
export class PrelocalizationController {
  constructor(private readonly service: PrelocalizationService) {}

  @Roles('admin_prelocalizacion', 'super_admin')
  @Post()
  create(@Req() req: any, @Body() dto: CreateCallDto) {
    return this.service.create(req.user.id, dto);
  }

  @Roles('admin_prelocalizacion', 'super_admin')
  @Get()
  findAll(@Query() query: ListCallsDto) {
    return this.service.findAll(query);
  }

  @Roles('admin_prelocalizacion', 'super_admin')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Roles('admin_prelocalizacion', 'super_admin')
  @Patch(':id/close')
  close(@Param('id') id: string) {
    return this.service.close(Number(id));
  }

  @Roles('admin_prelocalizacion', 'super_admin')
  @Get(':id/results')
  results(@Param('id') id: string) {
    return this.service.results(Number(id));
  }
}