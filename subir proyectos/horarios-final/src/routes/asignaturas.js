// src/routes/asignaturas.js
const express = require('express');
const router  = express.Router();
const { supabase } = require('../db/supabase');
const { loginRequired } = require('../middleware/auth');

// GET /api/asignaturas
router.get('/api/asignaturas', loginRequired, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('asignatura')
      .select('*, profesor(nombres, apellidos)')
      .order('año_academico').order('periodo').order('nombre');
    if (error) throw error;
    res.json(data.map(a => ({
      ...a,
      profesor_nombre: a.profesor ? `${a.profesor.nombres} ${a.profesor.apellidos}` : null,
      profesor: undefined
    })));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/asignaturas/:id
router.get('/api/asignaturas/:id', loginRequired, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('asignatura')
      .select('*, profesor(nombres, apellidos)')
      .eq('id', req.params.id)
      .single();
    if (error || !data) return res.status(404).json({ error: 'Asignatura no encontrada' });
    res.json({
      ...data,
      profesor_nombre: data.profesor ? `${data.profesor.nombres} ${data.profesor.apellidos}` : null,
      profesor: undefined
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/asignaturas
router.post('/api/asignaturas', loginRequired, async (req, res) => {
  if (req.session.userRole !== 'admin_horarios') return res.status(403).json({ error: 'No autorizado' });
  const { codigo, nombre, descripcion, año_academico, periodo,
    horas_presenciales = 0, horas_no_presenciales = 0, horas_totales = 0,
    tipo_evaluacion = 'EF', color = '#3498db', profesor_id = null } = req.body;

  if (!codigo || !nombre || !año_academico || !periodo)
    return res.status(400).json({ error: 'Faltan campos requeridos' });

  try {
    const { data: ex } = await supabase.from('asignatura').select('id').eq('codigo', codigo).single();
    if (ex) return res.status(400).json({ error: 'El código de asignatura ya existe' });

    const { data, error } = await supabase.from('asignatura')
      .insert({ codigo, nombre, descripcion, año_academico, periodo,
        horas_presenciales, horas_no_presenciales, horas_totales,
        tipo_evaluacion, color, profesor_id: profesor_id || null })
      .select().single();
    if (error) throw error;
    res.status(201).json({ success: true, id: data.id, asignatura: data });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PUT /api/asignaturas/:id
router.put('/api/asignaturas/:id', loginRequired, async (req, res) => {
  if (req.session.userRole !== 'admin_horarios') return res.status(403).json({ error: 'No autorizado' });
  try {
    const updates = {};
    const fields = ['codigo','nombre','descripcion','año_academico','periodo',
      'horas_presenciales','horas_no_presenciales','horas_totales','tipo_evaluacion','color','profesor_id'];
    fields.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const { data, error } = await supabase.from('asignatura').update(updates).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json({ success: true, asignatura: data });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DELETE /api/asignaturas/:id
router.delete('/api/asignaturas/:id', loginRequired, async (req, res) => {
  if (req.session.userRole !== 'admin_horarios') return res.status(403).json({ error: 'No autorizado' });
  try {
    const { error } = await supabase.from('asignatura').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true, message: 'Asignatura eliminada' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
