// src/routes/candidatos.js
const express = require('express');
const router  = express.Router();
const { supabaseAdmin, supabaseVotaciones } = require('../db/supabase');
const { loginRequired, adminRequired } = require('../middleware/auth');

// GET /estudiantes/buscar → busca en public.profiles estudiantes
router.get('/estudiantes/buscar', adminRequired, async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim().length < 2) return res.json([]);

  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name, roles(name)')
      .ilike('full_name', `%${q}%`)
      .limit(10);

    if (error) throw error;

    const resultado = (data || [])
      .filter(p => p.roles?.name === 'estudiante')
      .map(p => ({
        profile_id: p.id,
        nombre: p.full_name,
      }));

    res.json(resultado);
  } catch (e) {
    console.error('[buscar estudiantes]', e.message);
    res.status(500).json({ error: e.message });
  }
});

// GET /candidatos
router.get('/candidatos', loginRequired, async (req, res) => {
  try {
    const tipo = req.query.tipo;
    let q = supabaseVotaciones.from('candidato').select('*').order('nombre');
    if (tipo === 'organizacion') q = q.in('tipo', ['organizacion', 'ambos']);
    else if (tipo === 'lider') q = q.in('tipo', ['lider', 'ambos']);
    const { data, error } = await q;
    if (error) throw error;
    res.json(data || []);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /candidatos — solo admin
router.post('/candidatos', adminRequired, async (req, res) => {
  const { profile_id, tipo, descripcion = '', foto = '' } = req.body;

  if (!tipo) return res.status(400).json({ error: 'El tipo de candidatura es requerido' });
  if (!profile_id) return res.status(400).json({ error: 'Debes seleccionar un estudiante' });

  try {
    const { data: perfil, error: perfErr } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name, roles(name)')
      .eq('id', profile_id)
      .single();

    if (perfErr || !perfil) return res.status(400).json({ error: 'Estudiante no encontrado' });
    if (perfil.roles?.name !== 'estudiante') return res.status(400).json({ error: 'El usuario seleccionado no es estudiante' });

    const { data: yaExiste } = await supabaseVotaciones
      .from('candidato')
      .select('id')
      .eq('profile_id', profile_id)
      .single();

    if (yaExiste) return res.status(400).json({ error: 'Este estudiante ya es candidato' });

    const { data, error } = await supabaseVotaciones
      .from('candidato')
      .insert({ nombre: perfil.full_name, tipo, descripcion, foto, profile_id })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, candidato: data });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DELETE /candidatos/:id — solo admin
router.delete('/candidatos/:id', adminRequired, async (req, res) => {
  const id = req.params.id;
  try {
    await supabaseVotaciones.from('voto_organizacion').delete().eq('candidato_id', id);
    await supabaseVotaciones.from('voto_lider').delete().eq('candidato_id', id);
    const { error } = await supabaseVotaciones.from('candidato').delete().eq('id', id);
    if (error) throw error;
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;