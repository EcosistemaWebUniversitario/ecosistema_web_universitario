import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';

type AuthRequest = Request & {
  user?: {
    id: string;
    email?: string;
  };
};

export const requireRole = (...allowedRoles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          ok: false,
          message: 'Unauthorized'
        });
      }

      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('role_id')
        .eq('id', req.user.id)
        .single();

      if (profileError || !profile) {
        return res.status(404).json({
          ok: false,
          message: 'Profile not found'
        });
      }

      const { data: role, error: roleError } = await supabaseAdmin
        .from('roles')
        .select('name')
        .eq('id', profile.role_id)
        .single();

      if (roleError || !role) {
        return res.status(404).json({
          ok: false,
          message: 'Role not found'
        });
      }

      if (!allowedRoles.includes(role.name)) {
        return res.status(403).json({
          ok: false,
          message: 'Forbidden: insufficient permissions'
        });
      }

      next();
    } catch (error: any) {
      return res.status(500).json({
        ok: false,
        message: error.message || 'Internal server error'
      });
    }
  };
};