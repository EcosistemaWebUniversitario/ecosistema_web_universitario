// src/routes/notasRoutes.js
import express from 'express';
import { supabase, supabaseAcademico } from '../db/supabase.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// ── ASIGNATURAS ───────────────────────────────────────────────────────────────
router.post('/asignaturas', verifyToken, requireAdmin, async (req, res) => {
  const { nombre } = req.body;
  try {
    const { data, error } = await supabase.from('asignatura').insert({ nombre_asignatura: nombre }).select().single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (e) { res.status(500).send('Error al agregar la asignatura'); }
});

router.get('/asignaturas', verifyToken, async (req, res) => {
  try {
    const { data } = await supabase.from('asignatura').select('*').order('nombre_asignatura');
    res.json(data || []);
  } catch (e) { res.status(500).send('Error al obtener las asignaturas'); }
});

router.get('/asignaturas/:id', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase.from('asignatura').select('*').eq('id_asignatura', req.params.id).single();
    if (error) return res.status(404).json({ message: 'asignatura no encontrada' });
    res.json([data]);
  } catch (e) { res.status(500).send('Error al obtener la asignatura'); }
});

router.get('/asignaturas/nombre/:nombre', verifyToken, async (req, res) => {
  try {
    const { data } = await supabase.from('asignatura').select('*').ilike('nombre_asignatura', req.params.nombre);
    res.json(data || []);
  } catch (e) { res.status(500).send('Error al obtener la asignatura'); }
});

router.get('/asignaturas/carrera/:id', verifyToken, async (req, res) => {
  try {
    const { data } = await supabase.from('carrera_asignatura')
      .select('*, asignatura(*)')
      .eq('id_carrera', req.params.id);
    res.json((data || []).map(r => ({
      id_carrera: r.id_carrera,
      id_asignatura: r.id_asignatura,
      nombre_asignatura: r.asignatura?.nombre_asignatura
    })));
  } catch (e) { res.status(500).send('Error al obtener la asignatura'); }
});

router.get('/asignaturas/:carrera/:id', verifyToken, async (req, res) => {
  try {
    const { data } = await supabase.from('carrera_asignatura').select('*, asignatura(*)')
      .eq('id_carrera', req.params.carrera).eq('id_asignatura', req.params.id);
    res.json(data || []);
  } catch (e) { res.status(500).send('Error al obtener la asignatura'); }
});

router.get('/asignaturas/brigada/brigada/:id', verifyToken, async (req, res) => {
  try {
    const { data: brigada } = await supabase.from('brigada').select('id_carrera').eq('id_brigada', req.params.id).single();
    if (!brigada) return res.json([]);
    const { data } = await supabase.from('carrera_asignatura').select('*, asignatura(*)').eq('id_carrera', brigada.id_carrera);
    res.json((data || []).map(r => ({ id_asignatura: r.id_asignatura, nombre_asignatura: r.asignatura?.nombre_asignatura })));
  } catch (e) { res.status(500).send('Error al obtener la asignatura'); }
});

router.post('/asignaturas/carrera', verifyToken, requireAdmin, async (req, res) => {
  const { id_carrera, id_asignatura } = req.body;
  try {
    const { data, error } = await supabase.from('carrera_asignatura').insert({ id_carrera, id_asignatura }).select().single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (e) { res.status(500).send('Error al agregar la asignatura'); }
});

router.delete('/asignaturas/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    await supabase.from('asignatura').delete().eq('id_asignatura', req.params.id);
    res.status(204).send();
  } catch (e) { res.status(500).send('Error al eliminar la asignatura'); }
});

router.delete('/asignaturas/:id/:idAsig', verifyToken, requireAdmin, async (req, res) => {
  try {
    await supabase.from('carrera_asignatura').delete().eq('id_carrera', req.params.id).eq('id_asignatura', req.params.idAsig);
    res.status(204).send();
  } catch (e) { res.status(500).send('Error al eliminar la asignatura'); }
});

router.put('/asignaturas/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    await supabase.from('asignatura').update({ nombre_asignatura: req.body.nombre }).eq('id_asignatura', req.params.id);
    res.status(204).send();
  } catch (e) { res.status(500).send('Error al actualizar la asignatura'); }
});

// ── NOTAS ─────────────────────────────────────────────────────────────────────
router.post('/notas', verifyToken, async (req, res) => {
  let { id_estudiante, id_asignatura, valor, año } = req.body;
  // Resolver UUID a id numérico
  id_estudiante = await resolverIdEstudiante(id_estudiante);
  try {
    const { data, error } = await supabase.from('nota')
      .insert({ id_estudiante, id_asignatura, valor: parseFloat(valor), año }).select().single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (e) { res.status(500).send('Error al agregar la nota'); }
});

// Helper: resolver id numérico de estudiante desde UUID o número
async function resolverIdEstudiante(id) {
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  if (!isUUID) return id;
  const { data } = await supabaseAcademico.from('students').select('id').eq('profile_id', id).maybeSingle();
  return data?.id || id;
}

// ORDEN IMPORTANTE: rutas específicas ANTES que las genéricas (:id)
router.get('/notas/promedio/promedio/:id', verifyToken, async (req, res) => {
  try {
    const idEstudiante = await resolverIdEstudiante(req.params.id);
    const { data } = await supabase.from('nota').select('valor').eq('id_estudiante', idEstudiante);
    if (!data || data.length === 0) return res.json([{ round: null }]);
    const avg = data.reduce((s, n) => s + parseFloat(n.valor), 0) / data.length;
    res.json([{ round: Math.round(avg * 10) / 10 }]);
  } catch (e) { res.status(500).send('Error en el servidor'); }
});

router.get('/notas/estudiante/:id/:ano', verifyToken, async (req, res) => {
  try {
    const idEstudiante = await resolverIdEstudiante(req.params.id);
    const { data } = await supabase.from('nota')
      .select('*, asignatura(*)')
      .eq('id_estudiante', idEstudiante)
      .eq('año', req.params.ano);
    res.json((data || []).map(n => ({ ...n, nombre_asignatura: n.asignatura?.nombre_asignatura })));
  } catch (e) { res.status(500).send('Error en el servidor'); }
});

router.get('/notas/estudiante/:id', verifyToken, async (req, res) => {
  try {
    const idEstudiante = await resolverIdEstudiante(req.params.id);
    const { data } = await supabase.from('nota')
      .select('*, asignatura(*)')
      .eq('id_estudiante', idEstudiante)
      .order('año', { ascending: true });
    res.json((data || []).map(n => ({ ...n, nombre_asignatura: n.asignatura?.nombre_asignatura })));
  } catch (e) { res.status(500).send('Error en el servidor'); }
});

router.get('/notas/:asignatura/:nombre', verifyToken, async (req, res) => {
  try {
    const idEstudiante = await resolverIdEstudiante(req.params.nombre);
    const { data } = await supabase.from('nota')
      .select('*')
      .eq('id_asignatura', req.params.asignatura)
      .eq('id_estudiante', idEstudiante);
    res.json(data || []);
  } catch (e) { res.status(500).send('Error al obtener la nota'); }
});

router.get('/notas/:id', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase.from('nota')
      .select('*, asignatura(*)').eq('id_nota', req.params.id).single();
    if (error) return res.status(404).json({ message: 'nota no encontrada' });
    res.json([data]);
  } catch (e) { res.status(500).send('Error al obtener la nota'); }
});

router.put('/notas/:id', verifyToken, requireAdmin, async (req, res) => {
  let { id_estudiante, id_asignatura, valor, año } = req.body;
  id_estudiante = await resolverIdEstudiante(id_estudiante);
  try {
    const { error } = await supabase.from('nota')
      .update({ id_estudiante, id_asignatura, valor: parseFloat(valor), año }).eq('id_nota', req.params.id);
    if (error) throw error;
    res.status(204).send();
  } catch (e) { res.status(500).send('Error al actualizar la nota'); }
});

router.delete('/notas/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    await supabase.from('nota').delete().eq('id_nota', req.params.id);
    res.status(204).send();
  } catch (e) { res.status(500).send('Error al eliminar la nota'); }
});

export default router;
