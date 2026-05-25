import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';  // ← Usa 'import type'
import { SupabaseAuthGuard } from './guards/supabase-auth.guard';

@Controller()
export class AppController {
  @Get('health-auth')
  @UseGuards(SupabaseAuthGuard)
  healthAuth(@Req() req: Request) {
    return {
      ok: true,
      message: 'Token validado correctamente',
      user: (req as any).user,
    };
  }
}