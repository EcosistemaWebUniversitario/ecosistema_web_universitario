import { Controller, Get, UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from '../guards/supabase-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { DashboardService } from './dashboard.service';

@UseGuards(SupabaseAuthGuard, RolesGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Roles('super_admin')
  @Get('super-admin/summary')
  superAdminSummary() {
    return this.dashboardService.superAdminSummary();
  }
}