// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { supabaseAuth, supabaseAdmin } from '../db/supabase';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token requerido' });
    }

    const token = authHeader.split(' ')[1];

    // 1. Validar token con Supabase Auth (anon key)
    const { data: { user }, error } = await supabaseAuth.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: 'Token inválido o expirado' });
    }

    // 2. Obtener perfil desde public.profiles con service role (evita RLS)
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role_id, full_name, account_type')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return res.status(401).json({ error: 'Perfil de usuario no encontrado' });
    }

    // 3. Obtener nombre del rol desde public.roles
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from('roles')
      .select('name')
      .eq('id', profile.role_id)
      .single();

    if (roleError || !roleData) {
      return res.status(401).json({ error: 'Rol de usuario no encontrado' });
    }

    // 4. Adjuntar información unificada al request
    req.user = {
      id: user.id,
      email: user.email,
      role: roleData.name,
      profile: profile,
    };

    next();
  } catch (err) {
    console.error('Error en middleware de autenticación:', err);
    return res.status(500).json({ error: 'Error interno de autenticación' });
  }
};