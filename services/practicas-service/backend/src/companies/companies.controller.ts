import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyProfileDto } from './dto/update-company-profile.dto';
import { SupabaseAuthGuard } from '../guards/supabase-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

// Interfaz tipada para el request con usuario autenticado
interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
  };
}

@UseGuards(SupabaseAuthGuard, RolesGuard)   // autenticación + autorización
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Roles('empresa')
  @Post('profile')
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateCompanyDto) {
    return this.companiesService.create(req.user.id, dto);
  }

  @Roles('empresa')
  @Get('me')
  getMyProfile(@Req() req: AuthenticatedRequest) {
    return this.companiesService.findMyProfile(req.user.id);
  }

  @Roles('empresa')
  @Patch('me')
  updateMyCompany(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateCompanyProfileDto,
  ) {
    return this.companiesService.updateMyProfile(req.user.id, dto);
  }
}