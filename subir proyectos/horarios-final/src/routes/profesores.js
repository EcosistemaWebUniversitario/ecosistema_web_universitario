// src/routes/profesores.js
const express = require('express');
const router  = express.Router();
const { supabase } = require('../db/supabase');
const { loginRequired } = require('../middleware/auth');

// GET /api/profesores
router.get('/api/profesores', loginRequired, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profesor')
      .select('*, asignatura(id)')
      .order('apellidos').order('nombres');
    if (error) throw error;
    res.json(data.map(p => ({
      ...p, activo: Boolean(p.activo),
      nombre_completo: `${p.nombres} ${p.apellidos}`,
      total_asignaturas: p.asignatura?.length ?? 0,
      asignatura: undefined
    })));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/profesores/activos
router.get('/api/profesores/activos', loginRequired, async (req, res) => {
  try {
    const { data, error } = await supabase.from('profesor').select('*').eq('activo', true).order('apellidos').order('nombres');
    if (error) throw error;
    res.json(data.map(p => ({ ...p, nombre_completo: `${p.nombres} ${p.apellidos}` })));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/profesores/:id
router.get('/api/profesores/:id', loginRequired, async (req, res) => {
  try {
    const { data, error } = await supabase.from('profesor').select('*').eq('id', req.params.id).single();
    if (error || !data) return res.status(404).json({ error: 'Profesor no encontrado' });
    res.json({ ...data, nombre_completo: `${data.nombres} ${data.apellidos}` });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/profesores
router.post('/api/profesores', loginRequired, async (req, res) => {
  if (req.session.userRole !== 'admin_horarios') return res.status(403).json({ error: 'No autorizado' });
  const { codigo, nombres, apellidos, categoria_academica, categoria_cientifica, email, telefono } = req.body;
  if (!codigo || !nombres || !apellidos) return res.status(400).json({ error: 'Faltan campos requeridos' });

  try {
    const { data: ex } = await supabase.from('profesor').select('id').eq('codigo', codigo).single();
    if (ex) return res.status(400).json({ error: 'El código de profesor ya existe' });

    const { data, error } = await supabase.from('profesor')
      .insert({ codigo, nombres, apellidos, categoria_academica, categoria_cientifica, email, telefono })
      .select().single();
    if (error) throw error;
    res.status(201).json({ success: true, id: data.id, profesor: { ...data, nombre_completo: `${data.nombres} ${data.apellidos}` } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PUT /api/profesores/:id
router.put('/api/profesores/:id', loginRequired, async (req, res) => {
  if (req.session.userRole !== 'admin_horarios') return res.status(403).json({ error: 'No autorizado' });
  const { codigo, nombres, apellidos, categoria_academica, categoria_cientifica, email, telefono, activo } = req.body;

  try {
    const updates = {};
    if (codigo !== undefined) updates.codigo = codigo;
    if (nombres !== undefined) updates.nombres = nombres;
    if (apellidos !== undefined) updates.apellidos = apellidos;
    if (categoria_academica !== undefined) updates.categoria_academica = categoria_academica;
    if (categoria_cientifica !== undefined) updates.categoria_cientifica = categoria_cientifica;
    if (email !== undefined) updates.email = email;
    if (telefono !== undefined) updates.telefono = telefono;
    if (activo !== undefined) updates.activo = Boolean(activo);

    const { data, error } = await supabase.from('profesor').update(updates).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json({ success: true, profesor: { ...data, nombre_completo: `${data.nombres} ${data.apellidos}` } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DELETE /api/profesores/:id
router.delete('/api/profesores/:id', loginRequired, async (req, res) => {
  if (req.session.userRole !== 'admin_horarios') return res.status(403).json({ error: 'No autorizado' });
  try {
    const { error } = await supabase.from('profesor').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true, message: 'Profesor eliminado' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
