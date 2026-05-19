// src/routes/admin.js
const express = require('express');
const router  = express.Router();
const path    = require('path');
const { supabase, supabaseAdmin, supabasePublic } = require('../db/supabase');
const { loginRequired, adminRequired } = require('../middleware/auth');

const FRONTEND = path.resolve(__dirname, '../../frontend');
const send = page => (req, res) => res.sendFile(path.join(FRONTEND, page));

// Páginas HTML de admin
router.get('/admin/asignaturas',         adminRequired, send('admin/asignaturas.html'));
router.get('/admin/profesores',          adminRequired, send('admin/profesores.html'));
router.get('/admin/horarios',            adminRequired, send('admin/horarios.html'));
router.get('/admin/horarios/lista',      adminRequired, send('admin/horarios.html'));
router.get('/admin/horarios/crear',      adminRequired, send('admin/crear_horario.html'));
router.get('/admin/turnos',              adminRequired, send('admin/turnos.html'));
router.get('/admin/usuarios',            adminRequired, send('admin/usuarios.html'));
router.get('/admin/volver-dashboard',    adminRequired, (req, res) => res.redirect('/dashboard'));

router.get('/admin/horarios/editar/:id', adminRequired, async (req, res) => {
  const { data } = await supabase.from('horario_general').select('id').eq('id', req.params.id).single();
  if (!data) return res.redirect('/admin/horarios');
  res.sendFile(path.join(FRONTEND, 'admin/editar_horario.html'));
});

// GET /api/admin/usuarios — lee de profiles + auth.users
router.get('/api/admin/usuarios', adminRequired, async (req, res) => {
  try {
    const { data, error } = await supabasePublic
      .from('profiles')
      .select('id, full_name, account_type, created_at, roles(name)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data.map(u => ({
      id: u.id,
      username: u.full_name,
      role: u.roles?.name || '',
      account_type: u.account_type,
      fecha_registro: u.created_at
    })));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PUT /api/admin/usuarios/:id — cambiar rol
router.put('/api/admin/usuarios/:id', adminRequired, async (req, res) => {
  const { role_id, account_type } = req.body;
  try {
    const updates = {};
    if (role_id !== undefined) updates.role_id = role_id;
    if (account_type !== undefined) updates.account_type = account_type;
    const { data, error } = await supabasePublic.from('profiles').update(updates).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json({ success: true, usuario: data });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DELETE /api/admin/usuarios/:id
router.delete('/api/admin/usuarios/:id', adminRequired, async (req, res) => {
  if (req.params.id === req.session.userId)
    return res.status(400).json({ error: 'No puedes eliminar tu propio usuario' });
  try {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
