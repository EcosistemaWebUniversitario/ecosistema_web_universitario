// src/routes/academicRoutes.js
import express from 'express';
import { supabaseAcademico, supabase, supabaseAdmin } from '../db/supabase.js';
import { loginRequired, requireRole } from '../middleware/auth.js';

const router = express.Router();

// ── FACULTADES ──────────────────────────────────────────────────────
router.get('/facultades', loginRequired, async (req, res) => {
  try {
    const { data, error } = await supabaseAcademico.from('faculties').select('*').order('name');
    if (error) throw error;
    res.json(data.map(f => ({ id_facultad: f.id, nombre_facultad: f.name })));
  } catch (e) { res.status(500).send('Error al obtener las facultades'); }
});

router.get('/facultades/:id', loginRequired, async (req, res) => {
  try {
    const { data, error } = await supabaseAcademico.from('faculties').select('*').eq('id', req.params.id).single();
    if (error) return res.status(404).json({ message: 'facultad no encontrada' });
    res.json([{ id_facultad: data.id, nombre_facultad: data.name }]);
  } catch (e) { res.status(500).send('Error al obtener la facultad'); }
});

router.get('/facultades/nombre/:nombre', loginRequired, async (req, res) => {
  try {
    const { data } = await supabaseAcademico.from('faculties').select('*').ilike('name', req.params.nombre);
    res.json((data || []).map(f => ({ id_facultad: f.id, nombre_facultad: f.name })));
  } catch (e) { res.status(500).send('Error al obtener la facultad'); }
});

router.post('/facultades', loginRequired, requireRole('admin_notas', 'super_admin'), async (req, res) => {
  const { nombre } = req.body;
  try {
    const { data: ex } = await supabaseAcademico.from('faculties').select('id').eq('name', nombre).single();
    if (ex) return res.status(400).json({ message: 'la facultad ya existe' });
    const { data, error } = await supabaseAcademico.from('faculties').insert({ name: nombre }).select().single();
    if (error) throw error;
    res.status(201).json({ id_facultad: data.id, nombre_facultad: data.name });
  } catch (e) { res.status(500).send('Error al agregar la facultad'); }
});

router.put('/facultades/:id', loginRequired, requireRole('admin_notas', 'super_admin'), async (req, res) => {
  try {
    const { error } = await supabaseAcademico.from('faculties').update({ name: req.body.nombre }).eq('id', req.params.id);
    if (error) throw error;
    res.status(204).send();
  } catch (e) { res.status(500).send('Error al actualizar la facultad'); }
});

router.delete('/facultades/:id', loginRequired, requireRole('admin_notas', 'super_admin'), async (req, res) => {
  try {
    await supabaseAcademico.from('faculties').delete().eq('id', req.params.id);
    res.status(204).send();
  } catch (e) { res.status(500).send('Error al eliminar la facultad'); }
});

// ── CARRERAS ────────────────────────────────────────────────────────
router.get('/carreras', loginRequired, async (req, res) => {
  try {
    const { data } = await supabaseAcademico.from('careers').select('*, faculties(name)').order('name');
    res.json((data || []).map(c => ({ id_carrera: c.id, id_facultad: c.faculty_id, nombre_carrera: c.name, años: c.years || c.duration_years || 5 })));
  } catch (e) { res.status(500).send('Error al obtener las carreras'); }
});

router.get('/carreras/:id', loginRequired, async (req, res) => {
  try {
    const { data, error } = await supabaseAcademico.from('careers').select('*').eq('id', req.params.id).single();
    if (error) return res.status(404).json({ message: 'carrera no encontrada' });
    res.json([{ id_carrera: data.id, id_facultad: data.faculty_id, nombre_carrera: data.name }]);
  } catch (e) { res.status(500).send('Error al obtener la carrera'); }
});

router.get('/carreras/facultad/:id', loginRequired, async (req, res) => {
  try {
    const { data } = await supabaseAcademico.from('careers').select('*').eq('faculty_id', req.params.id);
    res.json((data || []).map(c => ({ id_carrera: c.id, id_facultad: c.faculty_id, nombre_carrera: c.name })));
  } catch (e) { res.status(500).send('Error en el servidor'); }
});

router.get('/carreras/nombre/:nombre', loginRequired, async (req, res) => {
  try {
    const { data } = await supabaseAcademico.from('careers').select('*').ilike('name', req.params.nombre);
    res.json((data || []).map(c => ({ id_carrera: c.id, nombre_carrera: c.name })));
  } catch (e) { res.status(500).send('Error al obtener la carrera'); }
});

router.post('/carreras', loginRequired, requireRole('admin_notas', 'super_admin'), async (req, res) => {
  const { id_facultad, nombre_carrera } = req.body;
  try {
    const { data, error } = await supabaseAcademico.from('careers').insert({ faculty_id: id_facultad, name: nombre_carrera }).select().single();
    if (error) throw error;
    res.status(201).json({ id_carrera: data.id, nombre_carrera: data.name });
  } catch (e) { res.status(500).send('Error al agregar la carrera'); }
});

router.put('/carreras/:id', loginRequired, requireRole('admin_notas', 'super_admin'), async (req, res) => {
  const { id_facultad, nombre_carrera } = req.body;
  try {
    await supabaseAcademico.from('careers').update({ faculty_id: id_facultad, name: nombre_carrera }).eq('id', req.params.id);
    res.status(204).send();
  } catch (e) { res.status(500).send('Error al actualizar la carrera'); }
});

router.delete('/carreras/:id', loginRequired, requireRole('admin_notas', 'super_admin'), async (req, res) => {
  try {
    await supabaseAcademico.from('careers').delete().eq('id', req.params.id);
    res.status(204).send();
  } catch (e) { res.status(500).send('Error al eliminar la carrera'); }
});

// ── ESTUDIANTES ──────────────────────────────────────────────────────
router.get('/estudiantes', loginRequired, async (req, res) => {
  try {
    const { data } = await supabaseAcademico.from('students').select('*, careers(name)').order('surnames');
    res.json((data || []).map(e => ({
      id_estudiante: e.id,
      profile_id: e.profile_id,
      nombre_estudiante: `${e.names} ${e.surnames}`,
      carnet: e.ci,
      correo: null,
      id_carrera: e.career_id,
      id_brigada: e.id_brigada || null
    })));
  } catch (e) { res.status(500).send('Error al obtener los estudiantes'); }
});

router.get('/estudiantes/correo/:correo', loginRequired, async (req, res) => {
  try {
    const { data: users } = await supabaseAdmin.auth.admin.listUsers();
    const found = (users?.users || []).find(u => u.email === req.params.correo);
    res.json(found ? [{ id: found.id }] : []);
  } catch (e) { res.status(500).send('Error al verificar correo'); }
});

router.get('/estudiantes/brigada/:id', loginRequired, async (req, res) => {
  try {
    const { data } = await supabaseAcademico.from('students').select('*').eq('id_brigada', req.params.id);
    res.json((data || []).map(e => ({
      id_estudiante: e.id,
      profile_id: e.profile_id,
      nombre_estudiante: `${e.names} ${e.surnames}`,
      carnet: e.ci,
      id_brigada: e.id_brigada
    })));
  } catch (e) { res.status(500).send('Error en el servidor'); }
});

router.get('/estudiantes/:id', loginRequired, async (req, res) => {
  try {
    const { id } = req.params;
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    let data, error;
    if (isUUID) {
      ({ data, error } = await supabaseAcademico.from('students').select('*').eq('profile_id', id).maybeSingle());
    } else {
      ({ data, error } = await supabaseAcademico.from('students').select('*').eq('id', id).maybeSingle());
    }

    if (!data) {
      const { data: profile } = await supabaseAdmin.from('profiles').select('full_name').eq('id', id).single();
      const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(id);
      return res.json([{
        id_estudiante: id, profile_id: id,
        nombre_estudiante: profile?.full_name || 'Estudiante',
        carnet: '', id_brigada: null,
        correo: authUser?.user?.email || ''
      }]);
    }

    const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(data.profile_id);
    res.json([{
      id_estudiante: data.id,
      profile_id: data.profile_id,
      nombre_estudiante: `${data.names} ${data.surnames}`,
      carnet: data.ci,
      id_brigada: data.id_brigada || null,
      correo: authUser?.user?.email || ''
    }]);
  } catch (e) { res.status(500).send('Error al obtener el estudiante'); }
});

router.post('/estudiantes', loginRequired, requireRole('admin_notas', 'super_admin'), async (req, res) => {
  const { correo, contraseña, nombre_estudiante, carnet, id_brigada } = req.body;
  try {
    let career_id = null;
    if (id_brigada) {
      const { data: brigada } = await supabase.from('brigada').select('id_carrera').eq('id_brigada', id_brigada).single();
      career_id = brigada?.id_carrera || null;
    }

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: correo,
      password: contraseña,
      email_confirm: true,
      user_metadata: { full_name: nombre_estudiante }
    });
    if (authError) throw authError;

    await supabaseAdmin
      .from('profiles')
      .update({ full_name: nombre_estudiante, role_id: 4, account_type: 'estudiante' })
      .eq('id', authData.user.id);

    if (carnet) {
      const { error: studError } = await supabaseAcademico.from('students').insert({
        profile_id: authData.user.id,
        names: nombre_estudiante.split(' ')[0] || nombre_estudiante,
        surnames: nombre_estudiante.split(' ').slice(1).join(' ') || '',
        ci: carnet,
        academic_year: new Date().getFullYear(),
        career_id: career_id || 1,
        municipality_id: 1,
        study_mode: 'REGULAR_DIURNO',
        id_brigada: id_brigada || null
      });
      if (studError) console.error('[crear estudiante academico]', studError.message);
    }

    res.status(201).json({ id_estudiante: authData.user.id, nombre_estudiante, correo });
  } catch (e) {
    if (e.message?.includes('already registered')) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }
    res.status(500).json({ message: e.message });
  }
});

router.post('/estudiantes/:id/brigada', loginRequired, requireRole('admin_notas', 'super_admin'), async (req, res) => {
  const { id_brigada } = req.body;
  try {
    const { error } = await supabaseAcademico.from('students')
      .update({ id_brigada: id_brigada || null })
      .eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.put('/estudiantes/:id', loginRequired, requireRole('admin_notas', 'super_admin'), async (req, res) => {
  const { nombre_estudiante, contraseña, id_brigada } = req.body;
  try {
    await supabaseAdmin.from('profiles')
      .update({ full_name: nombre_estudiante })
      .eq('id', req.params.id);

    if (contraseña) {
      await supabaseAdmin.auth.admin.updateUserById(req.params.id, { password: contraseña });
    }

    if (id_brigada !== undefined) {
      await supabaseAcademico.from('students')
        .update({ id_brigada: id_brigada || null })
        .eq('profile_id', req.params.id);
    }

    res.status(204).send();
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.delete('/estudiantes/:id', loginRequired, requireRole('admin_notas', 'super_admin'), async (req, res) => {
  try {
    await supabaseAdmin.auth.admin.deleteUser(req.params.id);
    res.status(204).send();
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── BRIGADAS ────────────────────────────────────────────────────────
router.get('/brigadas', loginRequired, async (req, res) => {
  try {
    const { data } = await supabase.from('brigada').select('*').order('nombre_brigada');
    res.json(data || []);
  } catch (e) { res.status(500).send('Error al obtener las brigadas'); }
});

router.get('/brigadas/:id', loginRequired, async (req, res) => {
  try {
    const { data, error } = await supabase.from('brigada').select('*').eq('id_brigada', req.params.id).single();
    if (error) return res.status(404).json({ message: 'brigada no encontrada' });
    const años = data.año_final_brigada && data.año_brigada
      ? data.año_final_brigada - data.año_brigada + 1
      : 5;
    res.json([{ ...data, años }]);
  } catch (e) { res.status(500).send('Error al obtener la brigada'); }
});

router.get('/brigadas/carrera/:id', loginRequired, async (req, res) => {
  try {
    const { data } = await supabase.from('brigada').select('*').eq('id_carrera', req.params.id);
    res.json(data || []);
  } catch (e) { res.status(500).send('Error en el servidor'); }
});

router.get('/brigadas/nombre/:nombre', loginRequired, async (req, res) => {
  try {
    const { data } = await supabase.from('brigada').select('*').ilike('nombre_brigada', req.params.nombre);
    res.json(data || []);
  } catch (e) { res.status(500).send('Error al obtener la brigada'); }
});

router.post('/brigadas', loginRequired, requireRole('admin_notas', 'super_admin'), async (req, res) => {
  const { id_carrera, nombre_brigada, año_brigada, añoFinal_brigada } = req.body;
  try {
    const { data, error } = await supabase.from('brigada')
      .insert({ id_carrera, nombre_brigada, año_brigada, año_final_brigada: añoFinal_brigada })
      .select().single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (e) { res.status(500).send('Error al agregar la brigada'); }
});

router.put('/brigadas/:id', loginRequired, requireRole('admin_notas', 'super_admin'), async (req, res) => {
  const { id_carrera, nombre_brigada, año_brigada, añoFinal_brigada } = req.body;
  try {
    await supabase.from('brigada').update({ id_carrera, nombre_brigada, año_brigada, año_final_brigada: añoFinal_brigada }).eq('id_brigada', req.params.id);
    res.status(204).send();
  } catch (e) { res.status(500).send('Error al actualizar la brigada'); }
});

router.delete('/brigadas/:id', loginRequired, requireRole('admin_notas', 'super_admin'), async (req, res) => {
  try {
    await supabase.from('brigada').delete().eq('id_brigada', req.params.id);
    res.status(204).send();
  } catch (e) { res.status(500).send('Error al eliminar la brigada'); }
});

export default router;