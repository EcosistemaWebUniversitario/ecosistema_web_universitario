// src/routes/candidatos.js
const express = require('express');
const router  = express.Router();
const { supabaseAdmin, supabaseVotaciones } = require('../db/supabase');
const { loginRequired, adminRequired } = require('../middleware/auth');

// GET /api/estudiantes/buscar
// Busca en public.profiles filtrando por rol estudiante
router.get('/api/estudiantes/buscar', adminRequired, async (req, res) => {
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

// GET /api/candidatos
router.get('/api/candidatos', loginRequired, async (req, res) => {
  try {
    const tipo = req.query.tipo;
    let q = supabaseVotaciones.from('candidato').select('*').order('nombre');
    if (tipo === 'organizacion') q = q.in('tipo', ['organizacion', 'ambos']);
    else if (tipo === 'lider') q = q.in('tipo', ['lider', 'ambos']);
    const { data, error } = await q;
    if (error) throw error;
    console.log(`[candidatos] tipo=${tipo || 'todos'} → ${(data||[]).length} resultados`);
    res.json(data || []);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/candidatos — solo admin
router.post('/api/candidatos', adminRequired, async (req, res) => {
  const { profile_id, tipo, descripcion = '', foto = '' } = req.body;

  if (!tipo) return res.status(400).json({ error: 'El tipo de candidatura es requerido' });
  if (!profile_id) return res.status(400).json({ error: 'Debes seleccionar un estudiante' });

  try {
    // Verificar que el perfil existe y es estudiante
    const { data: perfil, error: perfErr } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name, roles(name)')
      .eq('id', profile_id)
      .single();

    if (perfErr || !perfil) return res.status(400).json({ error: 'Estudiante no encontrado' });
    if (perfil.roles?.name !== 'estudiante') return res.status(400).json({ error: 'El usuario seleccionado no es estudiante' });

    // Verificar que no sea candidato ya
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

// DELETE /api/candidatos/:id — solo admin
router.delete('/api/candidatos/:id', adminRequired, async (req, res) => {
  const id = req.params.id;
  try {
    // Borrar votos asociados primero (FK constraint)
    await supabaseVotaciones.from('voto_organizacion').delete().eq('candidato_id', id);
    await supabaseVotaciones.from('voto_lider').delete().eq('candidato_id', id);

    const { error } = await supabaseVotaciones.from('candidato').delete().eq('id', id);
    if (error) throw error;
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
