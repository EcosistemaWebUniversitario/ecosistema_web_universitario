// src/middleware/auth.js
// Autenticación basada en token JWT de Supabase

const { supabase, supabaseAdmin } = require('../db/supabase');

/**
 * Extrae y valida el token JWT de Supabase desde el header Authorization.
 * Adjunta el usuario autenticado y su rol a req.user.
 */
async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return sendError(req, res, 401, 'Token requerido');
  }

  const token = authHeader.split(' ')[1];

  try {
    // 1. Validar el token con Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return sendError(req, res, 401, 'Token inválido o expirado');
    }

    // 2. Obtener el perfil del usuario desde public.profiles
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role_id, full_name, account_type')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return sendError(req, res, 401, 'Perfil de usuario no encontrado');
    }

    // 3. Obtener el nombre del rol desde public.roles
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from('roles')
      .select('name')
      .eq('id', profile.role_id)
      .single();

    if (roleError || !roleData) {
      return sendError(req, res, 401, 'Rol de usuario no encontrado');
    }

    // 4. Adjuntar información del usuario al request
    req.user = {
      id: user.id,
      email: user.email,
      role: roleData.name,
      profile: profile,
    };

    next();
  } catch (err) {
    console.error('Error en middleware de autenticación:', err);
    return sendError(req, res, 500, 'Error interno de autenticación');
  }
}

/**
 * Middleware que requiere autenticación (cualquier rol).
 */
function loginRequired(req, res, next) {
  authenticate(req, res, next);
}

/**
 * Middleware que requiere rol de administrador de horarios.
 */
function adminRequired(req, res, next) {
  authenticate(req, res, () => {
    if (req.user?.role !== 'admin_horarios') {
      return sendError(req, res, 403, 'No autorizado: se requiere rol de administrador de horarios');
    }
    next();
  });
}

/**
 * Envía una respuesta de error en formato JSON (para API) o redirige (para vistas).
 */
function sendError(req, res, status, message) {
  if (req.path.startsWith('/api/')) {
    return res.status(status).json({ error: message });
  }
  // Para rutas no-API, redirigir al login central
  return res.redirect('/auth');
}

module.exports = { loginRequired, adminRequired };