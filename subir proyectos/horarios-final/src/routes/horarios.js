// src/routes/horarios.js
const express = require('express');
const router  = express.Router();
const ExcelJS = require('exceljs');
const { supabase } = require('../db/supabase');
const { loginRequired } = require('../middleware/auth');

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

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

// Helper: traer slots enriquecidos de un horario
async function getSlots(horarioId) {
  const { data, error } = await supabase
    .from('horario_semanal')
    .select(`*, turno(nombre,hora_inicio,hora_fin,seccion),
             asignatura(codigo,nombre,color),
             profesor(nombres,apellidos)`)
    .eq('horario_general_id', horarioId)
    .order('semana_numero').order('dia_semana').order('turno_id');
  if (error) throw error;
  return data.map(s => ({
    id: s.id,
    semana_numero: s.semana_numero,
    dia_semana: s.dia_semana,
    turno_id: s.turno_id,
    turno_nombre: s.turno?.nombre,
    hora_inicio: s.turno?.hora_inicio,
    hora_fin: s.turno?.hora_fin,
    seccion: s.turno?.seccion,
    asignatura_id: s.asignatura_id,
    profesor_id: s.profesor_id,
    color: s.color,
    es_examen: Boolean(s.es_examen),
    fecha_especifica: s.fecha_especifica,
    asignatura_codigo: s.asignatura?.codigo,
    asignatura_nombre: s.asignatura?.nombre,
    asignatura_color: s.asignatura?.color,
    profesor_nombre: s.profesor ? `${s.profesor.nombres} ${s.profesor.apellidos}` : null,
  }));
}

// ── GET /api/horarios ─────────────────────────────────────────────────────────
router.get('/api/horarios', loginRequired, async (req, res) => {
  try {
    const { data, error } = await supabase.from('horario_general').select('*').order('año_carrera').order('semestre').order('creado_en', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── GET /api/horarios/:id ─────────────────────────────────────────────────────
router.get('/api/horarios/:id', loginRequired, async (req, res) => {
  try {
    const { data: h, error: he } = await supabase.from('horario_general').select('*').eq('id', req.params.id).single();
    if (he || !h) return res.status(404).json({ error: 'Horario no encontrado' });

    const { data: turnos } = await supabase.from('turno').select('*').order('seccion').order('orden');
    const { data: asigDisp } = await supabase.from('asignatura')
      .select('*, profesor(nombres,apellidos)')
      .eq('año_academico', h.año_carrera).eq('periodo', h.semestre).order('codigo');

    const asignaciones = await getSlots(h.id);

    res.json({
      ...h,
      turnos,
      asignaciones,
      asignaturas_disponibles: (asigDisp || []).map(a => ({
        ...a,
        profesor_nombres: a.profesor?.nombres,
        profesor_apellidos: a.profesor?.apellidos,
        profesor: undefined
      }))
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── POST /api/horarios ────────────────────────────────────────────────────────
router.post('/api/horarios', loginRequired, async (req, res) => {
  if (req.session.userRole !== 'admin_horarios') return res.status(403).json({ error: 'No autorizado' });
  const d = req.body;
  if (!['titulo','año_academico','semestre','año_carrera','fecha_inicio','fecha_fin'].every(f => d[f] !== undefined))
    return res.status(400).json({ error: 'Faltan campos requeridos' });

  try {
    const dias_diff = Math.floor((new Date(d.fecha_fin) - new Date(d.fecha_inicio)) / 86400000);
    const semanas_totales  = d.semanas_totales  || Math.max(22, Math.floor(dias_diff / 7) + 1);
    const semanas_examenes = d.semanas_examenes || 3;
    const semanas_clases   = d.semanas_clases   || (semanas_totales - semanas_examenes);

    const { data: nuevo, error: he } = await supabase.from('horario_general').insert({
      titulo: d.titulo, año_academico: d.año_academico, semestre: d.semestre,
      año_carrera: d.año_carrera, carrera: d.carrera || 'INGENIERÍA INFORMÁTICA',
      modalidad: d.modalidad || 'Diurno', semanas_totales, semanas_clases,
      semanas_examenes, fecha_inicio: d.fecha_inicio, fecha_fin: d.fecha_fin,
      creado_por: req.session.userId
    }).select().single();
    if (he) throw he;

    const { data: turnos } = await supabase.from('turno').select('id').eq('activo', true).order('seccion').order('orden');

    // Crear slots en lotes de 500 (límite de Supabase)
    const slots = [];
    for (let semana = 1; semana <= semanas_totales; semana++) {
      const es_examen = semana > (semanas_totales - semanas_examenes);
      for (let dia = 0; dia < 5; dia++) {
        const fecha = addDays(d.fecha_inicio, (semana - 1) * 7 + dia);
        for (const t of turnos) {
          slots.push({ horario_general_id: nuevo.id, semana_numero: semana, dia_semana: dia,
            turno_id: t.id, es_examen, fecha_especifica: fecha });
        }
      }
    }

    // Insertar en lotes de 500
    for (let i = 0; i < slots.length; i += 500) {
      const { error } = await supabase.from('horario_semanal').insert(slots.slice(i, i + 500));
      if (error) throw error;
    }

    res.status(201).json({ success: true, id: nuevo.id, message: `Horario creado con ${slots.length} slots`, horario: nuevo });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── POST /api/horarios/:id/asignar ────────────────────────────────────────────
router.post('/api/horarios/:id/asignar', loginRequired, async (req, res) => {
  if (req.session.userRole !== 'admin_horarios') return res.status(403).json({ error: 'No autorizado' });
  const { semana_numero, dia_semana, turno_id, asignatura_id } = req.body;
  if (semana_numero === undefined || dia_semana === undefined || turno_id === undefined || asignatura_id === undefined)
    return res.status(400).json({ error: 'Faltan campos requeridos' });

  try {
    const { data: slot } = await supabase.from('horario_semanal').select('*')
      .eq('horario_general_id', req.params.id).eq('semana_numero', semana_numero)
      .eq('dia_semana', dia_semana).eq('turno_id', turno_id).single();
    if (!slot) return res.status(404).json({ error: 'Slot no encontrado' });

    // Limpiar slot
    if (asignatura_id === null) {
      await supabase.from('horario_semanal').update({ asignatura_id: null, profesor_id: null, color: null }).eq('id', slot.id);
      return res.json({ success: true, slot: { ...slot, asignatura_id: null, profesor_id: null, color: null } });
    }

    const { data: asig } = await supabase.from('asignatura').select('*, profesor(nombres,apellidos)').eq('id', asignatura_id).single();
    if (!asig) return res.status(404).json({ error: 'Asignatura no encontrada' });

    // Validar conflicto de profesor
    if (asig.profesor_id) {
      const { data: conflicto } = await supabase.from('horario_semanal').select('id, asignatura(nombre)')
        .eq('horario_general_id', req.params.id).eq('semana_numero', semana_numero)
        .eq('dia_semana', dia_semana).eq('turno_id', turno_id)
        .eq('profesor_id', asig.profesor_id).neq('id', slot.id).single();
      if (conflicto) return res.status(400).json({ error: 'Conflicto de profesor',
        message: `El profesor ya tiene clase en este turno` });
    }

    // Validar límite horas
    if (asig.horas_presenciales > 0) {
      const { count } = await supabase.from('horario_semanal').select('id', { count: 'exact', head: true })
        .eq('horario_general_id', req.params.id).eq('semana_numero', semana_numero).eq('asignatura_id', asignatura_id);
      const maxTurnos = Math.max(1, Math.min(5, Math.floor(asig.horas_presenciales / 1.5)));
      if (count >= maxTurnos) return res.status(400).json({ error: 'Límite de horas',
        message: `Máximo ${maxTurnos} turnos esta semana para esta asignatura` });
    }

    // Validar año/semestre
    const { data: horario } = await supabase.from('horario_general').select('año_carrera,semestre').eq('id', req.params.id).single();
    if (asig.año_academico !== horario.año_carrera || asig.periodo !== horario.semestre)
      return res.status(400).json({ error: 'Asignatura no corresponde al horario' });

    const { data: updated } = await supabase.from('horario_semanal')
      .update({ asignatura_id: asig.id, profesor_id: asig.profesor_id || null, color: asig.color })
      .eq('id', slot.id).select().single();

    res.json({ success: true, slot: { ...updated,
      asignatura_nombre: asig.nombre, asignatura_codigo: asig.codigo,
      profesor_nombre: asig.profesor ? `${asig.profesor.nombres} ${asig.profesor.apellidos}` : null } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── POST /api/horarios/:id/limpiar-slot ───────────────────────────────────────
router.post('/api/horarios/:id/limpiar-slot', loginRequired, async (req, res) => {
  if (req.session.userRole !== 'admin_horarios') return res.status(403).json({ error: 'No autorizado' });
  const { semana_numero, dia_semana, turno_id } = req.body;
  try {
    const { error } = await supabase.from('horario_semanal')
      .update({ asignatura_id: null, profesor_id: null, color: null })
      .eq('horario_general_id', req.params.id).eq('semana_numero', semana_numero)
      .eq('dia_semana', dia_semana).eq('turno_id', turno_id);
    if (error) throw error;
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── POST /api/horarios/:id/limpiar-todo ───────────────────────────────────────
router.post('/api/horarios/:id/limpiar-todo', loginRequired, async (req, res) => {
  if (req.session.userRole !== 'admin_horarios') return res.status(403).json({ error: 'No autorizado' });
  try {
    const { error } = await supabase.from('horario_semanal')
      .update({ asignatura_id: null, profesor_id: null, color: null })
      .eq('horario_general_id', req.params.id);
    if (error) throw error;
    res.json({ success: true, message: 'Horario limpiado completamente' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── POST /api/horarios/:id/generar-automatico ─────────────────────────────────
router.post('/api/horarios/:id/generar-automatico', loginRequired, async (req, res) => {
  if (req.session.userRole !== 'admin_horarios') return res.status(403).json({ error: 'No autorizado' });
  try {
    const { data: horario } = await supabase.from('horario_general').select('*').eq('id', req.params.id).single();
    if (!horario) return res.status(404).json({ error: 'Horario no encontrado' });

    const { data: asignaturas } = await supabase.from('asignatura').select('*')
      .eq('año_academico', horario.año_carrera).eq('periodo', horario.semestre);
    if (!asignaturas?.length) return res.status(400).json({ error: 'No hay asignaturas para este año y semestre' });

    const { data: turnosMañana } = await supabase.from('turno').select('*').eq('seccion', 'mañana').eq('activo', true).order('orden');
    if (!turnosMañana?.length) return res.status(400).json({ error: 'No hay turnos de mañana' });

    const semanas_clases = horario.semanas_totales - horario.semanas_examenes;

    // Limpiar slots mañana Lun-Jue de semanas de clase
    await supabase.from('horario_semanal')
      .update({ asignatura_id: null, profesor_id: null, color: null })
      .eq('horario_general_id', horario.id)
      .in('dia_semana', [0, 1, 2, 3])
      .lte('semana_numero', semanas_clases)
      .in('turno_id', turnosMañana.map(t => t.id));

    // Traer todos los slots disponibles
    const { data: slotsDisponibles } = await supabase.from('horario_semanal').select('id,semana_numero,dia_semana,turno_id,asignatura_id,es_examen')
      .eq('horario_general_id', horario.id)
      .in('dia_semana', [0, 1, 2, 3])
      .lte('semana_numero', semanas_clases)
      .in('turno_id', turnosMañana.map(t => t.id))
      .is('asignatura_id', null)
      .eq('es_examen', false);

    const asigInfo = asignaturas.map(a => ({
      id: a.id, codigo: a.codigo, horas: a.horas_presenciales,
      prof_id: a.profesor_id, color: a.color,
      necesarios: Math.min(30, Math.min(2, Math.max(1, Math.ceil(a.horas_presenciales / 1.5))) * semanas_clases),
      asignados: 0
    })).sort((a, b) => b.horas - a.horas);

    const profOcupado = new Map();
    const semanaAsig  = new Map(); // "asig_id-semana" -> count
    const updates = [];

    // Mezclar slots aleatoriamente
    const slots = [...slotsDisponibles].sort(() => Math.random() - 0.5);

    for (const asig of asigInfo) {
      let faltantes = asig.necesarios;
      for (const slot of slots) {
        if (faltantes <= 0) break;
        if (slot._usado) continue;

        // Verificar conflicto de profesor
        if (asig.prof_id) {
          const k = `${asig.prof_id}-${slot.semana_numero}-${slot.dia_semana}-${slot.turno_id}`;
          if (profOcupado.has(k)) continue;
        }
        // Max 2 por semana
        const sk = `${asig.id}-${slot.semana_numero}`;
        if ((semanaAsig.get(sk) || 0) >= 2) continue;

        slot._usado = true;
        updates.push({ id: slot.id, asignatura_id: asig.id, profesor_id: asig.prof_id || null, color: asig.color });
        asig.asignados++;
        faltantes--;
        semanaAsig.set(sk, (semanaAsig.get(sk) || 0) + 1);
        if (asig.prof_id) profOcupado.set(`${asig.prof_id}-${slot.semana_numero}-${slot.dia_semana}-${slot.turno_id}`, true);
      }
    }

    // Aplicar updates en lotes
    for (let i = 0; i < updates.length; i += 100) {
      const lote = updates.slice(i, i + 100);
      for (const u of lote) {
        await supabase.from('horario_semanal').update({ asignatura_id: u.asignatura_id, profesor_id: u.profesor_id, color: u.color }).eq('id', u.id);
      }
    }

    const pct = slotsDisponibles.length > 0 ? (updates.length / slotsDisponibles.length * 100).toFixed(1) : 0;
    res.json({ success: true, message: `✅ ${updates.length} turnos asignados (${pct}% de ocupación)`,
      estadisticas_detalladas: { turnos_asignados: updates.length, porcentaje_ocupacion: parseFloat(pct) },
      resumen_asignaturas: asigInfo.map(a => ({ codigo: a.codigo, turnos_necesarios: a.necesarios, turnos_asignados: a.asignados })) });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── GET /api/horarios/:id/estadisticas ────────────────────────────────────────
router.get('/api/horarios/:id/estadisticas', loginRequired, async (req, res) => {
  try {
    const { count: total } = await supabase.from('horario_semanal').select('id', { count: 'exact', head: true }).eq('horario_general_id', req.params.id);
    const { count: ocupados } = await supabase.from('horario_semanal').select('id', { count: 'exact', head: true }).eq('horario_general_id', req.params.id).not('asignatura_id', 'is', null);
    res.json({ total_slots: total, slots_ocupados: ocupados,
      porcentaje_ocupado: total > 0 ? Math.round(ocupados / total * 10000) / 100 : 0 });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── GET /api/horarios/:id/exportar-excel ──────────────────────────────────────
router.get('/api/horarios/:id/exportar-excel', loginRequired, async (req, res) => {
  if (req.session.userRole !== 'admin_horarios') return res.status(403).json({ error: 'No autorizado' });
  try {
    const { data: h } = await supabase.from('horario_general').select('*').eq('id', req.params.id).single();
    if (!h) return res.status(404).json({ error: 'Horario no encontrado' });

    const slots = await getSlots(h.id);
    const ocupados = slots.filter(s => s.asignatura_id);
    if (!ocupados.length) return res.status(400).json({ error: 'No hay datos para exportar' });

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Horario');
    ws.columns = [
      { header: 'Semana', key: 'semana', width: 10 },
      { header: 'Día', key: 'dia', width: 12 },
      { header: 'Turno', key: 'turno', width: 15 },
      { header: 'Hora', key: 'hora', width: 20 },
      { header: 'Código', key: 'codigo', width: 12 },
      { header: 'Asignatura', key: 'asignatura', width: 35 },
      { header: 'Profesor', key: 'profesor', width: 30 },
      { header: 'Tipo', key: 'tipo', width: 10 }
    ];
    ocupados.forEach(s => ws.addRow({
      semana: s.semana_numero, dia: DIAS[s.dia_semana],
      turno: s.turno_nombre, hora: `${s.hora_inicio} - ${s.hora_fin}`,
      codigo: s.asignatura_codigo, asignatura: s.asignatura_nombre,
      profesor: s.profesor_nombre || '', tipo: s.es_examen ? 'EXAMEN' : 'CLASE'
    }));

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="horario_${h.año_academico}_sem${h.semestre}.xlsx"`);
    await wb.xlsx.write(res);
    res.end();
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── GET /api/horarios/:id/vista-semestral-detallada ───────────────────────────
router.get('/api/horarios/:id/vista-semestral-detallada', loginRequired, async (req, res) => {
  try {
    const { data: h } = await supabase.from('horario_general').select('*').eq('id', req.params.id).single();
    if (!h) return res.status(404).json({ error: 'Horario no encontrado' });
    const { data: turnos } = await supabase.from('turno').select('*').order('seccion').order('orden');
    const asignaciones = await getSlots(h.id);

    const semanas_data = [];
    for (let sn = 1; sn <= h.semanas_totales; sn++) {
      const es_examen = sn > (h.semanas_totales - h.semanas_examenes);
      let fecha_lunes = addDays(h.fecha_inicio, (sn - 1) * 7);
      const slot_lunes = asignaciones.find(a => a.semana_numero === sn && a.dia_semana === 0);
      if (slot_lunes?.fecha_especifica) fecha_lunes = slot_lunes.fecha_especifica;
      const fecha_viernes = addDays(fecha_lunes, 4);

      const semana_info = { numero: sn, es_examen,
        fecha_lunes: fmt(fecha_lunes), fecha_viernes: fmt(fecha_viernes),
        rango_fechas: `${fmt(fecha_lunes)} - ${fmt(fecha_viernes)}`, turnos: [] };

      for (const t of turnos) {
        const ti = { id: t.id, nombre: t.nombre, hora_inicio: t.hora_inicio, hora_fin: t.hora_fin, seccion: t.seccion, dias: {} };
        for (let dn = 0; dn < 5; dn++) {
          const dia_nombre = DIAS[dn];
          const a = asignaciones.find(x => x.semana_numero === sn && x.dia_semana === dn && x.turno_id === t.id);
          ti.dias[dia_nombre] = a?.asignatura_id
            ? { asignatura_id: a.asignatura_id, codigo: a.asignatura_codigo, nombre: a.asignatura_nombre,
                profesor: a.profesor_nombre, color: a.color, ocupado: true, es_examen: a.es_examen }
            : { ocupado: false, es_viernes: dia_nombre === 'Viernes', es_examen };
        }
        semana_info.turnos.push(ti);
      }
      semanas_data.push(semana_info);
    }
    res.json({ success: true, horario: h, semanas: semanas_data,
      total_semanas: h.semanas_totales, semanas_clases: h.semanas_clases,
      semanas_examenes: h.semanas_examenes, turnos });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── POST /api/horarios/:id/actualizar-fecha-semana ────────────────────────────
router.post('/api/horarios/:id/actualizar-fecha-semana', loginRequired, async (req, res) => {
  if (req.session.userRole !== 'admin_horarios') return res.status(403).json({ error: 'No autorizado' });
  const { semana_numero, fecha_inicio } = req.body;
  if (!semana_numero || !fecha_inicio) return res.status(400).json({ error: 'Faltan campos' });
  try {
    const { data: slots } = await supabase.from('horario_semanal').select('id,dia_semana')
      .eq('horario_general_id', req.params.id).eq('semana_numero', semana_numero);
    for (const s of slots) {
      await supabase.from('horario_semanal').update({ fecha_especifica: addDays(fecha_inicio, s.dia_semana) }).eq('id', s.id);
    }
    res.json({ success: true, message: `Fechas de semana ${semana_numero} actualizadas` });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── DELETE /api/horarios/:id ──────────────────────────────────────────────────
router.delete('/api/horarios/:id', loginRequired, async (req, res) => {
  if (req.session.userRole !== 'admin_horarios') return res.status(403).json({ error: 'No autorizado' });
  try {
    // ON DELETE CASCADE elimina horario_semanal automáticamente
    const { error } = await supabase.from('horario_general').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true, message: 'Horario eliminado' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
