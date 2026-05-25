import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Request } from 'express';

type AuthRequest = Request & { user?: any };

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
  const request = context.switchToHttp().getRequest<AuthRequest>();
  console.log('🛡️ SupabaseAuthGuard ejecutándose para:', request.url);

  const authHeader = request.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    console.warn('⚠️ No Bearer token');
    throw new UnauthorizedException('Token requerido');
  }

  const token = authHeader.split(' ')[1];
  console.log('🔑 Token recibido (primeros 20 chars):', token.substring(0, 20) + '...');

  const { data, error } = await this.supabase.auth.getUser(token);
  if (error || !data.user) {
    console.error('❌ Error Supabase:', error);
    throw new UnauthorizedException('Token inválido o expirado');
  }

  request.user = { id: data.user.id, email: data.user.email };
  console.log('✅ Usuario autenticado:', request.user);
  return true;
}
}