// src/middleware/auth.js
import { supabaseAdmin } from '../db/supabase.js';

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(403).json({ message: 'No existe el token' });

    const token = authHeader.split(' ')[1];
    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({ message: 'Token inválido o expirado' });
    }

    // Leer perfil y rol
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*, roles(name)')
      .eq('id', data.user.id)
      .single();

    req.userId   = data.user.id;
    req.userRole = profile?.roles?.name || null;
    req.profile  = profile;
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.userRole !== 'admin_notas') {
    return res.status(403).json({ message: 'No autorizado' });
  }
  next();
};
