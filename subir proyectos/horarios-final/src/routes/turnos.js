// src/routes/turnos.js
const express = require('express');
const router  = express.Router();
const { supabase } = require('../db/supabase');
const { loginRequired, adminRequired } = require('../middleware/auth');

// GET /
router.get('/', loginRequired, async (req, res) => {
  try {
    const { data, error } = await supabase.from('turno').select('*').order('seccion').order('orden');
    if (error) throw error;
    res.json(data);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PUT /actualizar-multiples
router.put('/actualizar-multiples', loginRequired, adminRequired, async (req, res) => {
  const { turnos } = req.body;
  if (!Array.isArray(turnos)) return res.status(400).json({ error: 'Se esperaba un array de turnos' });

  try {
    for (const t of turnos) {
      const { error } = await supabase.from('turno').update({
        nombre: t.nombre, hora_inicio: t.hora_inicio, hora_fin: t.hora_fin,
        duracion_minutos: t.duracion_minutos ?? 90,
        seccion: t.seccion, orden: t.orden,
        activo: t.activo !== undefined ? Boolean(t.activo) : true
      }).eq('id', t.id);
      if (error) throw error;
    }
    const { data } = await supabase.from('turno').select('*').order('seccion').order('orden');
    res.json({ success: true, message: `${turnos.length} turnos actualizados`, turnos: data });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;