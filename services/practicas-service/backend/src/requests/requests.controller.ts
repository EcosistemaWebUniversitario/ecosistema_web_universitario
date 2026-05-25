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

import { SupabaseAuthGuard } from '../guards/supabase-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { Query } from '@nestjs/common';
import { ListRequestsDto } from './dto/list-requests.dto';

@UseGuards(SupabaseAuthGuard, RolesGuard)
@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Roles('estudiante')
  @Post('apply')
  apply(@Req() req: any, @Body() dto: CreateRequestDto) {
    return this.requestsService.apply(req.user.id, dto.vacancyId);
  }

  @Roles('estudiante')
  @Get('me')
  findMy(@Req() req: any) {
    return this.requestsService.findMy(req.user.id);
  }

  @Roles('admin_practicas', 'super_admin')
  @Get()
findAll(@Query() query: ListRequestsDto) {
  return this.requestsService.findAll(query);
}

  @Roles('admin_practicas', 'super_admin')
  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.requestsService.approve(Number(id));
  }

  @Roles('admin_practicas', 'super_admin')
  @Patch(':id/reject')
  reject(@Param('id') id: string) {
    return this.requestsService.reject(Number(id));
  }
}