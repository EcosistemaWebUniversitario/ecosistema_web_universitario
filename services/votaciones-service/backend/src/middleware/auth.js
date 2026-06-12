// src/middleware/auth.js
const { supabase, supabaseAdmin } = require('../db/supabase');

async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return sendError(req, res, 401, 'Token requerido');
  }

  const token = authHeader.split(' ')[1];

  try {
    // 1. Validar el token con el cliente anónimo de Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return sendError(req, res, 401, 'Token inválido o expirado');
    }

    // 2. Obtener perfil del usuario
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role_id, full_name, account_type')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return sendError(req, res, 401, 'Perfil de usuario no encontrado');
    }

    // 3. Obtener nombre del rol
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from('roles')
      .select('name')
      .eq('id', profile.role_id)
      .single();

    if (roleError || !roleData) {
      return sendError(req, res, 401, 'Rol de usuario no encontrado');
    }

    // 4. Adjuntar información al request
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

function loginRequired(req, res, next) {
  authenticate(req, res, next);
}

function adminRequired(req, res, next) {
  authenticate(req, res, () => {
    if (req.user?.role !== 'admin_votaciones') {
      return sendError(req, res, 403, 'No autorizado: se requiere rol de administrador de votaciones');
    }
    next();
  });
}

function sendError(req, res, status, message) {
  if (req.path.startsWith('/api/')) {
    return res.status(status).json({ error: message });
  }
  return res.redirect('/auth');
}

module.exports = { loginRequired, adminRequired };