import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { PrelocalizationService } from './prelocalization.service';
import { SupabaseAuthGuard } from '../guards/supabase-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(SupabaseAuthGuard, RolesGuard)
@Controller('prelocalization/results')
export class PrelocalizationResultsController {
  constructor(private readonly service: PrelocalizationService) {}

  @Roles('estudiante')
  @Get('me')
  myResults(@Req() req: any) {
    return this.service.myResults(req.user.id);
  }
}