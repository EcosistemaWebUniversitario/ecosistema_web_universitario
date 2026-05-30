// src/routes/auth.js
const express = require('express');
const router  = express.Router();
const path    = require('path');
const { supabase, supabaseAdmin } = require('../db/supabase');
const { loginRequired } = require('../middleware/auth');

const FRONTEND = path.resolve(__dirname, '../../frontend');

// POST /api/login — estudiante
router.post('/api/login', async (req, res) => {
  const { matricula, password } = req.body;
  if (!matricula || !password) return res.json({ success: false, message: 'Faltan credenciales' });

  try {
    let email = matricula;

    if (!matricula.includes('@')) {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .ilike('full_name', matricula)
        .single();

      if (!profile) return res.json({ success: false, message: 'Matrícula no encontrada' });

      const { data: userData } = await supabaseAdmin.auth.admin.getUserById(profile.id);
      if (!userData?.user) return res.json({ success: false, message: 'Usuario no encontrado' });
      email = userData.user.email;
    }

    // BUGFIX: usar supabaseAdmin para auth, no supabase (que tiene schema votaciones)
    const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({ email, password });
    if (authError || !authData?.user) return res.json({ success: false, message: 'Credenciales incorrectas' });

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*, roles(name)')
      .eq('id', authData.user.id)
      .single();

    if (!profile) return res.json({ success: false, message: 'Perfil no encontrado' });

    const roleName = profile.roles?.name || '';

    if (roleName !== 'estudiante' && roleName !== 'admin_votaciones') {
      return res.json({ success: false, message: 'No tienes acceso al sistema de votaciones' });
    }

    if (roleName === 'admin_votaciones') {
      req.session.userId    = authData.user.id;
      req.session.username  = profile.full_name;
      req.session.userRole  = roleName;
      req.session.userEmail = authData.user.email;
      return res.json({ success: true, role: roleName, redirect: '/admin-panel.html' });
    }

    const { data: votoOrg } = await supabase
      .from('voto_organizacion')
      .select('id')
      .eq('usuario_id', authData.user.id)
      .limit(1);

    const { data: votoLider } = await supabase
      .from('voto_lider')
      .select('id')
      .eq('usuario_id', authData.user.id)
      .single();

    const haVotadoOrg   = votoOrg && votoOrg.length > 0;
    const haVotadoLider = Boolean(votoLider);

    req.session.userId        = authData.user.id;
    req.session.username      = profile.full_name;
    req.session.userRole      = roleName;
    req.session.userEmail     = authData.user.email;
    req.session.haVotadoOrg   = haVotadoOrg;
    req.session.haVotadoLider = haVotadoLider;

    let redirect = '/votacion.html';
    if (haVotadoOrg && haVotadoLider) {
      const { data: config } = await supabase.from('configuracion').select('*').eq('id', 1).single();
      const ahora = new Date().toISOString();
      if (config && ahora > config.fin_votacion) {
        redirect = '/resultados.html';
      } else {
        redirect = '/espera.html';
      }
    }

    return res.json({ success: true, role: roleName, redirect, haVotadoOrg, haVotadoLider });
  } catch (e) {
    console.error('[login]', e.message);
    return res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

// POST /api/login-admin
router.post('/api/login-admin', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.json({ success: false, message: 'Faltan credenciales' });

  try {
    // BUGFIX: usar supabaseAdmin para auth
    const { data: authData, error } = await supabaseAdmin.auth.signInWithPassword({ email, password });
    if (error || !authData?.user) return res.json({ success: false, message: 'Credenciales incorrectas' });

    const { data: profile } = await supabaseAdmin
      .from('profiles').select('*, roles(name)').eq('id', authData.user.id).single();

    if (!profile || profile.roles?.name !== 'admin_votaciones')
      return res.json({ success: false, message: 'No tienes permisos de administrador' });

    req.session.userId    = authData.user.id;
    req.session.username  = profile.full_name;
    req.session.userRole  = 'admin_votaciones';
    req.session.userEmail = authData.user.email;

    return res.json({ success: true, redirect: '/admin-panel.html' });
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

// GET /api/sesion
router.get('/api/sesion', (req, res) => {
  if (!req.session?.userId) return res.json({ autenticado: false });
  res.json({
    autenticado: true,
    username: req.session.username,
    role: req.session.userRole,
    haVotadoOrg: req.session.haVotadoOrg || false,
    haVotadoLider: req.session.haVotadoLider || false
  });
});

// GET /api/logout
router.get('/api/logout', (req, res) => {
  req.session.destroy(() => res.json({ success: true }));
});

// POST /api/registro — registro de estudiantes
router.post('/api/registro', async (req, res) => {
  const { email, password, username } = req.body;
  if (!email || !password || !username) return res.status(400).json({ error: 'Faltan campos requeridos' });
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
    return res.status(500).json({ error: e.message });
  }
});

module.exports = router;
