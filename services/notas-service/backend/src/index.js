// src/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Carga condicional de variables de entorno según NODE_ENV
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({
  path: process.env.NODE_ENV === 'development'
    ? resolve(__dirname, '../.env.local')
    : resolve(__dirname, '../.env')
});

import academicRoutes from './routes/academicRoutes.js';
import notasRoutes from './routes/notasRoutes.js';

const app = express();
const PORT = process.env.PORT || 4006;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:4006', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Rutas de la API de notas bajo el prefijo estándar del ecosistema
app.use('/api/notas', academicRoutes);
app.use('/api/notas', notasRoutes);

// Health check
app.get('/api/notas/health', (req, res) => {
  res.json({
    ok: true,
    service: 'notas-service',
    status: 'running',
    rutas: [
      '/api/notas/facultades',
      '/api/notas/carreras',
      '/api/notas/brigadas',
      '/api/notas/estudiantes',
      '/api/notas/asignaturas',
      '/api/notas/notas'
    ]
  });
});

// Fallback para rutas no encontradas
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Endpoint no encontrado' });
  }
  res.status(404).send('Not Found');
});

app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('   SISTEMA DE NOTAS — Node.js + Supabase');
  console.log('='.repeat(50));
  console.log(`🌐 Servidor en http://localhost:${PORT}`);
  console.log(`🗄️  Supabase: ${process.env.SUPABASE_URL}`);
  console.log(`🔑 Entorno: ${process.env.NODE_ENV || 'producción'}`);
  console.log('='.repeat(50));
});