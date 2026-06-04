// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { supabaseAuth } from '../db/supabase';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        ok: false,
        message: 'Missing or invalid authorization header'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verificar token con Supabase Auth
    const { data, error } = await supabaseAuth.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({
        ok: false,
        message: 'Invalid or expired token'
      });
    }

    // Leer rol desde public.profiles
    const { data: profile } = await supabaseAuth
      .from('profiles')
      .select('*, roles(name)')
      .eq('id', data.user.id)
      .single();

    (req as any).user = data.user;
    (req as any).userRole = profile?.roles?.name || null;
    (req as any).profile = profile;

    next();
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: 'Auth middleware error'
    });
  }
};
