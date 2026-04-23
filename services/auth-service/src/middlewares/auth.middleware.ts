import { Request, Response, NextFunction } from 'express';
import { supabaseAuth } from '../config/supabase';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        ok: false,
        message: 'Authorization token is missing'
      });
    }

    const token = authHeader.split(' ')[1];

    const { data, error } = await supabaseAuth.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({
        ok: false,
        message: 'Invalid or expired token'
      });
    }

    req.user = data.user;
    next();
  } catch (error: any) {
    return res.status(500).json({
      ok: false,
      message: error.message || 'Internal server error'
    });
  }
};