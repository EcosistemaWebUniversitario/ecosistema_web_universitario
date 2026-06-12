// src/routes/votacion.js
const express = require('express');
const router  = express.Router();
const { supabaseVotaciones: supabase } = require('../db/supabase');
const { loginRequired } = require('../middleware/auth');

// GET /votacion/estado — verificar si la votación está activa (público, no necesita login)
router.get('/votacion/estado', async (req, res) => {
  try {
    const { data: config } = await supabase.from('configuracion').select('*').eq('id', 1).single();
    if (!config) return res.json({ activa: false, finalizada: false });

    const ahora = new Date().toISOString();
    const activa    = ahora >= config.inicio_votacion && ahora <= config.fin_votacion;
    const finalizada = ahora > config.fin_votacion;

    const diff = new Date(config.fin_votacion) - new Date();
    let tiempo_restante = null;
    if (diff > 0) {
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      tiempo_restante = `${h}h ${m}m restantes`;
    } else {
      tiempo_restante = 'La votación ha finalizado';
    }

    res.json({ activa, finalizada, tiempo_restante, config });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /votacion/votar-organizacion
router.post('/votacion/votar-organizacion', loginRequired, async (req, res) => {
  const { candidato_ids } = req.body;
  const usuario_id = req.user.id;   // ← JWT

  if (!Array.isArray(candidato_ids) || candidato_ids.length === 0)
    return res.status(400).json({ error: 'Debes seleccionar al menos un candidato' });

  try {
    // Verificar si ya votó
    const { data: yaVoto } = await supabase.from('voto_organizacion')
      .select('id').eq('usuario_id', usuario_id).limit(1);
    if (yaVoto && yaVoto.length > 0) return res.status(400).json({ error: 'Ya has votado en organización' });

    // Verificar votación activa
    const { data: config } = await supabase.from('configuracion').select('*').eq('id', 1).single();
    const ahora = new Date().toISOString();
    if (!config || ahora < config.inicio_votacion || ahora > config.fin_votacion)
      return res.status(400).json({ error: 'La votación no está activa' });

    // Insertar votos
    const votos = candidato_ids.map(id => ({ usuario_id, candidato_id: id }));
    const { error } = await supabase.from('voto_organizacion').insert(votos);
    if (error) throw error;

    // Ya no usamos sesión, simplemente devolvemos éxito
    res.json({ success: true, message: 'Voto por organización registrado' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /votacion/votar-lider
router.post('/votacion/votar-lider', loginRequired, async (req, res) => {
  const { candidato_id } = req.body;
  const usuario_id = req.user.id;   // ← JWT

  if (!candidato_id) return res.status(400).json({ error: 'Debes seleccionar un candidato' });

  try {
    const { data: yaVoto } = await supabase.from('voto_lider')
      .select('id').eq('usuario_id', usuario_id).single();
    if (yaVoto) return res.status(400).json({ error: 'Ya has votado para líder' });

    const { data: config } = await supabase.from('configuracion').select('*').eq('id', 1).single();
    const ahora = new Date().toISOString();
    if (!config || ahora < config.inicio_votacion || ahora > config.fin_votacion)
      return res.status(400).json({ error: 'La votación no está activa' });

    const { error } = await supabase.from('voto_lider').insert({ usuario_id, candidato_id });
    if (error) throw error;

    res.json({ success: true, message: 'Voto para líder registrado' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /votacion/mi-estado — ver si el usuario ya votó
router.get('/votacion/mi-estado', loginRequired, async (req, res) => {
  const usuario_id = req.user.id;
  try {
    const { data: votoOrg } = await supabase.from('voto_organizacion')
      .select('id').eq('usuario_id', usuario_id).limit(1);
    const { data: votoLider } = await supabase.from('voto_lider')
      .select('id').eq('usuario_id', usuario_id).single();

    res.json({
      haVotadoOrg: votoOrg && votoOrg.length > 0,
      haVotadoLider: Boolean(votoLider)
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;