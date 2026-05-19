// src/routes/auth.js
// Login y registro usan auth.users de Supabase (sistema compartido del ecosistema)
// El rol se lee de public.profiles → public.roles

const express = require('express');
const router  = express.Router();
const path    = require('path');
const { supabase, supabaseAdmin, supabasePublic } = require('../db/supabase');
const { loginRequired } = require('../middleware/auth');

const FRONTEND        = path.resolve(__dirname, '../../frontend');
const ROLE_ID_ADMIN   = parseInt(process.env.ROLE_ID_ADMIN   || '11');
const ROLE_ID_ESTUD   = parseInt(process.env.ROLE_ID_ESTUDIANTE || '4');

// ── GET / ────────────────────────────────────────────────────────────────────
router.get('/', (req, res) => {
  if (req.session?.userId) return res.redirect('/dashboard');
  res.sendFile(path.join(FRONTEND, 'index.html'));
});

// ── GET /login ───────────────────────────────────────────────────────────────
router.get('/login', (req, res) => {
  if (req.session?.userId) return res.redirect('/dashboard');
  res.sendFile(path.join(FRONTEND, 'login.html'));
});

// ── POST /login ──────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.json({ success: false, message: 'Faltan credenciales' });

  try {
    // Buscar usuario por username en profiles (full_name) o por email
    // username puede ser email o nombre de usuario
    const isEmail = username.includes('@');

    let authData, authError;

    if (isEmail) {
      // Login directo con email
      ({ data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: username, password
      }));
    } else {
      // Buscar el email asociado al username en profiles
      // Como profiles no tiene username, usamos el email guardado en auth.users
      // Intentamos login como email primero; si falla, buscamos en profiles por full_name
      ({ data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: username, password
      }));

      if (authError) {
        // Buscar por full_name en profiles para obtener el user_id y luego el email
        const { data: profile } = await supabase
          supabasePublic.from('profiles')
          .select('id')
          .ilike('full_name', username)
          .single();

        if (profile) {
          const { data: userData } = await supabaseAdmin.auth.admin.getUserById(profile.id);
          if (userData?.user) {
            ({ data: authData, error: authError } = await supabase.auth.signInWithPassword({
              email: userData.user.email, password
            }));
          }
        }
      }
    }

    if (authError || !authData?.user) {
      return res.json({ success: false, message: 'Credenciales incorrectas' });
    }

    const user = authData.user;
    
    console.log('USER ID:', authData.user.id);
    const { data: profileDebug, error: profileDebugError } = await supabasePublic
      .from('profiles')
      .select('*, roles(name)')
      .eq('id', authData.user.id)
      .single();  
    console.log('PROFILE:', JSON.stringify(profileDebug));
    console.log('PROFILE ERROR:', JSON.stringify(profileDebugError));

    // Leer perfil y rol
    const { data: profile } = await supabasePublic
      .from('profiles')
      .select('*, roles(name)')
      .eq('id', user.id)
      .single();

    if (!profile) return res.json({ success: false, message: 'Perfil no encontrado' });

    const roleName = profile.roles?.name || '';

    // Verificar que el rol sea del sistema de horarios
    if (roleName !== 'admin_horarios' && roleName !== 'estudiante') {
      return res.json({ success: false, message: 'No tienes acceso al sistema de horarios' });
    }

    // Guardar sesión
    req.session.userId      = user.id;
    req.session.username    = profile.full_name;
    req.session.userRole    = roleName;
    req.session.userEmail   = user.email;

    return res.json({
      success:  true,
      message:  'Login exitoso',
      role:     roleName,
      username: profile.full_name
    });

  } catch (e) {
    console.error('[login]', e.message);
    return res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

// ── GET /dashboard ────────────────────────────────────────────────────────────
router.get('/dashboard', loginRequired, (req, res) => {
  if (req.session.userRole === 'admin_horarios') {
    return res.sendFile(path.join(FRONTEND, 'admin/dashboard.html'));
  }
  return res.sendFile(path.join(FRONTEND, 'user/dashboard.html'));
});

// ── LOGOUT ────────────────────────────────────────────────────────────────────
function doLogout(req, res, isAdmin = false) {
  req.session.destroy(() => {
    if (isAdmin) return res.json({ success: true, redirect: '/' });
    return res.redirect('/');
  });
}
router.get('/admin/logout', loginRequired, (req, res) => doLogout(req, res, true));
router.get('/user/logout',  loginRequired, (req, res) => doLogout(req, res, false));
router.get('/logout',       loginRequired, (req, res) =>
  doLogout(req, res, req.session.userRole === 'admin_horarios'));

// ── GET /registro ─────────────────────────────────────────────────────────────
router.get('/registro', (req, res) => {
  if (req.session?.userId) return res.redirect('/dashboard');
  res.sendFile(path.join(FRONTEND, 'registro.html'));
});

// ── POST /registro ────────────────────────────────────────────────────────────
// Solo crea el usuario en auth.users.
// El trigger on_auth_user_created se encarga de insertar en profiles automáticamente.
router.post('/registro', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: 'Faltan campos requeridos' });
  if (password.length < 6) return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });

  try {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: username }
    });

    if (error) {
      if (error.message.includes('already')) return res.status(400).json({ error: 'El email ya está registrado' });
      throw error;
    }

    // El trigger handle_new_user() crea el perfil automáticamente.
    // Por defecto asignará el rol estudiante (id 4).
    // Para asignar admin_horarios (id 11) usar el SQL del paso 3.
    return res.json({ success: true, message: 'Cuenta creada correctamente' });
  } catch (e) {
    console.error('[registro]', e.message);
    return res.status(500).json({ error: e.message });
  }
});

// ── POST /api/cambiar-password ────────────────────────────────────────────────
router.post('/api/cambiar-password', loginRequired, async (req, res) => {
  const { password_nuevo, password_confirmar } = req.body;
  if (!password_nuevo || !password_confirmar) return res.status(400).json({ error: 'Faltan campos' });
  if (password_nuevo !== password_confirmar) return res.status(400).json({ error: 'Las contraseñas no coinciden' });
  if (password_nuevo.length < 6) return res.status(400).json({ error: 'Mínimo 6 caracteres' });

  try {
    const { error } = await supabaseAdmin.auth.admin.updateUserById(req.session.userId, {
      password: password_nuevo
    });
    if (error) throw error;
    return res.json({ success: true, message: 'Contraseña actualizada correctamente' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

module.exports = router;
