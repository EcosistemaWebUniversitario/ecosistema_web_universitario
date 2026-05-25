import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // sin restricción de roles
    }

    const request = context.switchToHttp().getRequest();
    const profileId = request.user?.id;

    if (!profileId) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    const profile = await this.prisma.profiles.findUnique({
      where: { id: profileId },
      include: { roles: true },
    });

    if (!profile?.roles) {
      throw new ForbiddenException('Perfil sin rol asignado');
    }

    const userRoleName = profile.roles.name;

    if (!requiredRoles.includes(userRoleName)) {
      throw new ForbiddenException('No tienes permiso para realizar esta acción');
    }

    return true;
  }
}