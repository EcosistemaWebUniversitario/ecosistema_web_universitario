// src/routes/usuario.js
const express = require('express');
const router  = express.Router();
const path    = require('path');
const { supabase } = require('../db/supabase');
const { loginRequired } = require('../middleware/auth');

const FRONTEND    = path.resolve(__dirname, '../../frontend');
const DIAS_NOMBRES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

function addDays(isoDate, days) {
  const d = new Date(isoDate + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
function fmt(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.slice(0, 10).split('-');
  return `${d}/${m}/${y}`;
}

// Helper: obtener horario activo con filtros opcionales
async function obtenerHorario(añoParam, semestreParam) {
  let q = supabase.from('horario_general').select('*').eq('activo', true);
  if (añoParam && semestreParam) q = q.eq('año_carrera', añoParam).eq('semestre', semestreParam);
  else if (añoParam) q = q.eq('año_carrera', añoParam);
  const { data } = await q.order('año_carrera', { ascending: false }).order('semestre', { ascending: false }).order('creado_en', { ascending: false }).limit(1);
  return data?.[0] || null;
}

// GET /user/horario-semestral-completo
router.get('/user/horario-semestral-completo', loginRequired, (req, res) => {
  if (req.session.userRole === 'admin') return res.redirect('/dashboard');
  res.sendFile(path.join(FRONTEND, 'user/horario_semestral_completo.html'));
});

// GET /api/horarios-disponibles-usuario
router.get('/api/horarios-disponibles-usuario', loginRequired, async (req, res) => {
  try {
    const { data: horarios } = await supabase.from('horario_general').select('*').eq('activo', true)
      .order('año_carrera').order('semestre').order('creado_en', { ascending: false });

    const lista = await Promise.all((horarios || []).map(async h => {
      const { count } = await supabase.from('horario_semanal').select('id', { count: 'exact', head: true })
        .eq('horario_general_id', h.id).not('asignatura_id', 'is', null);
      const slots = h.semanas_totales * 5 * 6;
      const pct   = slots > 0 ? Math.round(count / slots * 1000) / 10 : 0;
      return {
        id: h.id, año_carrera: h.año_carrera, semestre: h.semestre,
        año_academico: h.año_academico, carrera: h.carrera, titulo: h.titulo,
        fecha_inicio: fmt(h.fecha_inicio), fecha_fin: fmt(h.fecha_fin),
        semanas_totales: h.semanas_totales, creado_en: h.creado_en,
        asignaciones_count: count, porcentaje_ocupado: pct,
        descripcion: `Año ${h.año_carrera} - Semestre ${h.semestre} (${h.año_academico})`,
        descripcion_completa: `Año ${h.año_carrera} - Semestre ${h.semestre} (${h.año_academico}) • ${count} asignaciones (${pct}% ocupado)`
      };
    }));
    res.json({ success: true, horarios_disponibles: lista, total: lista.length });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// GET /api/mi-horario/vista-semestral-completa
router.get('/api/mi-horario/vista-semestral-completa', loginRequired, async (req, res) => {
  try {
    const h = await obtenerHorario(req.query.ano ? parseInt(req.query.ano) : null, req.query.semestre ? parseInt(req.query.semestre) : null);
    if (!h) return res.json({ success: false, message: 'No hay horarios activos' });

    const { data: turnos } = await supabase.from('turno').select('*').order('seccion').order('orden');
    const { data: slots } = await supabase.from('horario_semanal')
      .select('*, asignatura(codigo,nombre,color), profesor(nombres,apellidos), turno(nombre,hora_inicio,hora_fin,seccion)')
      .eq('horario_general_id', h.id).order('semana_numero').order('dia_semana').order('turno_id');

    const semanas_data = [];
    for (let sn = 1; sn <= h.semanas_totales; sn++) {
      const es_examen = sn > (h.semanas_totales - h.semanas_examenes);
      let fecha_lunes = addDays(h.fecha_inicio, (sn - 1) * 7);
      const sl = slots?.find(a => a.semana_numero === sn && a.dia_semana === 0);
      if (sl?.fecha_especifica) fecha_lunes = sl.fecha_especifica;
      const fecha_viernes = addDays(fecha_lunes, 4);
      const semana_info = { numero: sn, es_examen, fecha_lunes: fmt(fecha_lunes),
        fecha_viernes: fmt(fecha_viernes), rango_fechas: `${fmt(fecha_lunes)} - ${fmt(fecha_viernes)}`, turnos: [] };

      for (const t of (turnos || [])) {
        const ti = { id: t.id, nombre: t.nombre, hora_inicio: t.hora_inicio, hora_fin: t.hora_fin, seccion: t.seccion, dias: {} };
        for (let dn = 0; dn < 5; dn++) {
          const dia_nombre = DIAS_NOMBRES[dn];
          const a = slots?.find(x => x.semana_numero === sn && x.dia_semana === dn && x.turno_id === t.id);
          ti.dias[dia_nombre] = a?.asignatura_id
            ? { asignatura_id: a.asignatura_id, codigo: a.asignatura?.codigo, nombre: a.asignatura?.nombre,
                profesor: a.profesor ? `${a.profesor.nombres} ${a.profesor.apellidos}` : null,
                color: a.color, ocupado: true, es_examen: Boolean(a.es_examen) }
            : { ocupado: false, es_viernes: dia_nombre === 'Viernes', es_examen };
        }
        semana_info.turnos.push(ti);
      }
      semanas_data.push(semana_info);
    }
    res.json({ success: true, horario: h, semanas: semanas_data,
      total_semanas: h.semanas_totales, semanas_clases: h.semanas_clases,
      semanas_examenes: h.semanas_examenes, turnos, modo: 'solo_lectura' });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// GET /api/estadisticas
router.get('/api/estadisticas', loginRequired, async (req, res) => {
  try {
    const [a, p, t, hg] = await Promise.all([
      supabase.from('asignatura').select('id', { count: 'exact', head: true }),
      supabase.from('profesor').select('id', { count: 'exact', head: true }),
      supabase.from('turno').select('id', { count: 'exact', head: true }),
      supabase.from('horario_general').select('id', { count: 'exact', head: true }),
    ]);
    res.json({ asignaturas: a.count, profesores: p.count, turnos: t.count, horarios: hg.count });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/calendario-semanal
router.get('/api/calendario-semanal', loginRequired, async (req, res) => {
  try {
    const h = await obtenerHorario(req.query.ano ? parseInt(req.query.ano) : null, req.query.semestre ? parseInt(req.query.semestre) : null);
    if (!h) return res.json({ success: false, message: 'No hay horarios activos' });

    const hoy = new Date().toISOString().split('T')[0];
    let semana = h.fecha_inicio > hoy ? 1 : hoy > h.fecha_fin ? h.semanas_totales
      : Math.floor((new Date(hoy) - new Date(h.fecha_inicio)) / 604800000) + 1;
    if (req.query.semana) semana = parseInt(req.query.semana);
    semana = Math.max(1, Math.min(semana, h.semanas_totales));

    const { data: slots } = await supabase.from('horario_semanal')
      .select('*, asignatura(codigo,nombre), profesor(nombres,apellidos), turno(hora_inicio,hora_fin)')
      .eq('horario_general_id', h.id).eq('semana_numero', semana).not('asignatura_id', 'is', null);

    const calendario = DIAS_NOMBRES.map((dn, di) => {
      const fd = addDays(h.fecha_inicio, (semana - 1) * 7 + di);
      const clases = (slots || []).filter(s => s.dia_semana === di).map(s => ({
        hora: `${s.turno?.hora_inicio} - ${s.turno?.hora_fin}`,
        asignatura: s.asignatura?.codigo || '', nombre: s.asignatura?.nombre || '',
        profesor: s.profesor ? `${s.profesor.nombres} ${s.profesor.apellidos}` : '',
        aula: 'Por asignar', color: s.color, es_examen: Boolean(s.es_examen)
      }));
      return { dia: dn, fecha: fmt(fd), es_hoy: fd === hoy, clases, total_clases: clases.length };
    });

    res.json({ success: true, semana_actual: semana, calendario,
      total_clases_semana: (slots || []).length, hoy: fmt(hoy), horario_info: h });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

module.exports = router;
