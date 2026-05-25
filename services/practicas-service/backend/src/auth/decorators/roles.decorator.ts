import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

// DEPRECATED: Role-based access control moved to Supabase
// Use @UseGuards(SupabaseAuthGuard) instead
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
