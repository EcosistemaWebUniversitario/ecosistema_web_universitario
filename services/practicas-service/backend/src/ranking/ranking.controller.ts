import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { RankingService } from './ranking.service';
import { CreateRankingDto } from './dto/create-ranking.dto';
import { SupabaseAuthGuard } from '../guards/supabase-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(SupabaseAuthGuard, RolesGuard)
@Controller('prelocalization/calls/:callId/ranking')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Roles('admin_prelocalizacion', 'super_admin')
  @Get()
  index(@Param('callId', ParseIntPipe) callId: number) {
    return this.rankingService.getData(callId);
  }

  @Roles('admin_prelocalizacion', 'super_admin')
  @Post()
  store(
    @Param('callId', ParseIntPipe) callId: number,
    @Body() dto: CreateRankingDto,
  ) {
    return this.rankingService.create(callId, dto);
  }

  @Roles('admin_prelocalizacion', 'super_admin')
  @Delete(':id')
  destroy(@Param('id', ParseIntPipe) id: number) {
    return this.rankingService.remove(id);
  }
}