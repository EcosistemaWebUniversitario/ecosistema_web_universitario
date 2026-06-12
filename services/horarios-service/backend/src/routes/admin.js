// src/routes/admin.js
const express = require('express');
const router  = express.Router();
const { supabaseAdmin, supabasePublic } = require('../db/supabase');
const { adminRequired } = require('../middleware/auth');

// Redirigir páginas antiguas de admin al nuevo frontend servido por Nginx
router.get('/admin/*', adminRequired, (req, res) => {
  res.redirect('/horarios');
});

// GET /usuarios — obtiene perfiles de public.profiles
router.get('/usuarios', adminRequired, async (req, res) => {
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

// PUT /usuarios/:id — cambiar rol
router.put('/usuarios/:id', adminRequired, async (req, res) => {
  const { role_id, account_type } = req.body;
  try {
    const updates = {};
    if (role_id !== undefined) updates.role_id = role_id;
    if (account_type !== undefined) updates.account_type = account_type;
    const { data, error } = await supabasePublic
      .from('profiles')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();
    if (error) throw error;
    res.json({ success: true, usuario: data });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DELETE /usuarios/:id
router.delete('/usuarios/:id', adminRequired, async (req, res) => {
  if (req.params.id === req.user.id) {
    return res.status(400).json({ error: 'No puedes eliminar tu propio usuario' });
  }
  try {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;