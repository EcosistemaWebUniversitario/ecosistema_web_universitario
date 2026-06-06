// src/routes/authRoutes.js
import express from 'express';
import { supabase, supabaseAdmin } from '../db/supabase.js';

const router = express.Router();

// POST /auth/login — estudiante o admin
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password });
    if (error || !data?.user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Leer perfil y rol
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*, roles(name)')
      .eq('id', data.user.id)
      .single();

    const rol = profile?.roles?.name || '';
    if (!['estudiante', 'admin_notas'].includes(rol)) {
      return res.status(403).json({ message: 'No tienes acceso a este sistema' });
    }

    return res.status(200).json({
      token: data.session.access_token,
      rol,
      user: { id: data.user.id, email: data.user.email, nombre: profile?.full_name }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' });
  }
});

// POST /auth/loginAdm — solo admin
router.post('/loginAdm', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password });
    if (error || !data?.user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*, roles(name)')
      .eq('id', data.user.id)
      .single();

    if (profile?.roles?.name !== 'admin_notas') {
      return res.status(403).json({ message: 'No tienes permisos de administrador' });
    }

    return res.status(200).json({
      token: data.session.access_token,
      rol: 'admin_notas',
      user: { id: data.user.id, email: data.user.email, nombre: profile?.full_name }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' });
  }
});

// GET /auth/verificar — verificar token activo
router.get('/verificar', async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ message: 'No existe el token' });

    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data?.user) return res.status(401).json({ message: 'Token inválido' });

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*, roles(name)')
      .eq('id', data.user.id)
      .single();

    return res.status(200).json([{
      id_usuario: data.user.id,
      correo: data.user.email,
      nombre: profile?.full_name,
      rol: profile?.roles?.name
    }]);
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' });
  }
});

export default router;

// GET /auth/estudiante/usuario/:id — busca estudiante por profile_id
router.get('/estudiante/usuario/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Buscar en academico.students por profile_id
    const { data, error } = await supabaseAdmin
      .schema('academico')
      .from('students')
      .select('id, names, surnames, profile_id')
      .eq('profile_id', id)
      .single();

    if (error || !data) {
      // Si no tiene fila en academico.students, devolver el profile_id como id_estudiante
      return res.json([{ id_estudiante: id, nombre_estudiante: '', carnet: '' }]);
    }

    res.json([{ id_estudiante: data.id, nombre_estudiante: `${data.names} ${data.surnames}`, carnet: data.profile_id }]);
  } catch (e) {
    res.status(500).json({ message: 'Error al buscar estudiante' });
  }
});
