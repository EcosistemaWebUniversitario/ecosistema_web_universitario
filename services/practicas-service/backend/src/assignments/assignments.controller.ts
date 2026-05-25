import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { SupabaseAuthGuard } from '../guards/supabase-auth.guard';
import { AssignmentsService } from './assignments.service';

@UseGuards(SupabaseAuthGuard, RolesGuard)
@Controller('prelocalization/calls/:callId/assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Roles('admin_prelocalizacion', 'super_admin')
  @Get()
  manage(@Param('callId', ParseIntPipe) callId: number) {
    return this.assignmentsService.manage(callId);
  }

  @Roles('admin_prelocalizacion', 'super_admin')
  @Post(':vacancyId')
  assign(
    @Param('callId', ParseIntPipe) callId: number,
    @Param('vacancyId', ParseIntPipe) vacancyId: number,
  ) {
    return this.assignmentsService.assign(callId, vacancyId);
  }
}