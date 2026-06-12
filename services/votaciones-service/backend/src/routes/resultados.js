// src/routes/resultados.js
const express = require('express');
const router  = express.Router();
const { supabaseVotaciones: supabase, supabaseAdmin } = require('../db/supabase');
const { loginRequired, adminRequired } = require('../middleware/auth');

// GET /resultados — resultados de la votación
router.get('/resultados', loginRequired, async (req, res) => {
  try {
    const { data: config } = await supabase.from('configuracion').select('*').eq('id', 1).single();
    const ahora = new Date().toISOString();
    const esAdmin = req.user.role === 'admin_votaciones';   // ← JWT

    if (!esAdmin && config && ahora <= config.fin_votacion)
      return res.status(403).json({ error: 'La votación aún no ha finalizado' });

    // Resultados organización
    const { data: candidatosOrg } = await supabase
      .from('candidato').select('id, nombre, descripcion')
      .in('tipo', ['organizacion', 'ambos']).order('nombre');

    const resultadosOrg = await Promise.all((candidatosOrg || []).map(async c => {
      const { count } = await supabase.from('voto_organizacion')
        .select('id', { count: 'exact', head: true }).eq('candidato_id', c.id);
      return { ...c, votos: count || 0 };
    }));
    resultadosOrg.sort((a, b) => b.votos - a.votos);

    // Resultados líder
    const { data: candidatosLider } = await supabase
      .from('candidato').select('id, nombre, descripcion')
      .in('tipo', ['lider', 'ambos']).order('nombre');

    const resultadosLider = await Promise.all((candidatosLider || []).map(async c => {
      const { count } = await supabase.from('voto_lider')
        .select('id', { count: 'exact', head: true }).eq('candidato_id', c.id);
      return { ...c, votos: count || 0 };
    }));
    resultadosLider.sort((a, b) => b.votos - a.votos);

    // Estadísticas
    const { count: totalVotos } = await supabase
      .from('voto_lider').select('id', { count: 'exact', head: true });

    res.json({
      organizacion: resultadosOrg,
      lider: resultadosLider,
      estadisticas: { total_votantes: totalVotos || 0 }
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /admin/configuracion
router.get('/admin/configuracion', adminRequired, async (req, res) => {
  try {
    const { data } = await supabase.from('configuracion').select('*').eq('id', 1).single();
    res.json(data || {});
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PUT /admin/configuracion
router.put('/admin/configuracion', adminRequired, async (req, res) => {
  const { inicio_votacion, fin_votacion } = req.body;
  try {
    const { data: existing } = await supabase.from('configuracion').select('id').eq('id', 1).single();
    let result;
    if (existing) {
      result = await supabase.from('configuracion')
        .update({ inicio_votacion, fin_votacion }).eq('id', 1).select().single();
    } else {
      result = await supabase.from('configuracion')
        .insert({ id: 1, inicio_votacion, fin_votacion }).select().single();
    }
    if (result.error) throw result.error;
    res.json({ success: true, configuracion: result.data });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /admin/estadisticas
router.get('/admin/estadisticas', adminRequired, async (req, res) => {
  try {
    const { count: totalCandidatos } = await supabase
      .from('candidato').select('id', { count: 'exact', head: true });
    const { count: votosOrg } = await supabase
      .from('voto_organizacion').select('id', { count: 'exact', head: true });
    const { count: votosLider } = await supabase
      .from('voto_lider').select('id', { count: 'exact', head: true });

    const { data: config } = await supabase.from('configuracion').select('*').eq('id', 1).single();
    const ahora = new Date().toISOString();
    const activa = config && ahora >= config.inicio_votacion && ahora <= config.fin_votacion;

    res.json({
      total_candidatos: totalCandidatos || 0,
      votos_organizacion: votosOrg || 0,
      votos_lider: votosLider || 0,
      votacion_activa: Boolean(activa),
      config
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;