// src/routes/auth.js
const express = require('express');
const router  = express.Router();
const path    = require('path');
const { supabase, supabaseAdmin } = require('../db/supabase');
const { loginRequired } = require('../middleware/auth');

const FRONTEND = path.resolve(__dirname, '../../frontend');

router.get('/', (req, res) => {
  if (req.session?.userId) return res.redirect('/dashboard');
  res.sendFile(path.join(FRONTEND, 'index.html'));
});

router.get('/login', (req, res) => {
  if (req.session?.userId) return res.redirect('/dashboard');
  res.sendFile(path.join(FRONTEND, 'login.html'));
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.json({ success: false, message: 'Faltan credenciales' });

  try {
    let authData, authError;
    const isEmail = username.includes('@');

    if (isEmail) {
      ({ data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: username, password
      }));
    } else {
      const { data: profileSearch } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .ilike('full_name', username)
        .single();

      if (profileSearch) {
        const { data: userData } = await supabaseAdmin.auth.admin.getUserById(profileSearch.id);
        if (userData?.user) {
          ({ data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: userData.user.email, password
          }));
        }
      }
    }

    if (authError || !authData?.user) {
      return res.json({ success: false, message: 'Credenciales incorrectas' });
    }

    const user = authData.user;

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*, roles(name)')
      .eq('id', user.id)
      .single();

    if (!profile) return res.json({ success: false, message: 'Perfil no encontrado' });

    const roleName = profile.roles?.name || '';

    if (roleName !== 'admin_horarios' && roleName !== 'estudiante') {
      return res.json({ success: false, message: 'No tienes acceso al sistema de horarios' });
    }

    req.session.userId    = user.id;
    req.session.username  = profile.full_name;
    req.session.userRole  = roleName;
    req.session.userEmail = user.email;

    return res.json({
      success: true, message: 'Login exitoso',
      role: roleName, username: profile.full_name
    });

  } catch (e) {
    console.error('[login]', e.message);
    return res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

router.get('/dashboard', loginRequired, (req, res) => {
  if (req.session.userRole === 'admin_horarios') {
    return res.sendFile(path.join(FRONTEND, 'admin/dashboard.html'));
  }
  return res.sendFile(path.join(FRONTEND, 'user/dashboard.html'));
});

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

router.get('/registro', (req, res) => {
  if (req.session?.userId) return res.redirect('/dashboard');
  res.sendFile(path.join(FRONTEND, 'registro.html'));
});

router.post('/registro', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: 'Faltan campos requeridos' });
  if (password.length < 6) return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });

  try {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email, password, email_confirm: true,
      user_metadata: { full_name: username }
    });

    if (error) {
      if (error.message.includes('already')) return res.status(400).json({ error: 'El email ya está registrado' });
      throw error;
    }

    return res.json({ success: true, message: 'Cuenta creada correctamente' });
  } catch (e) {
    console.error('[registro]', e.message);
    return res.status(500).json({ error: e.message });
  }
});

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