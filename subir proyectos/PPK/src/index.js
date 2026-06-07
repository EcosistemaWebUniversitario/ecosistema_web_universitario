// src/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { createServer } from 'http';

dotenv.config();

import authRoutes from './routes/authRoutes.js';
import academicRoutes from './routes/academicRoutes.js';
import notasRoutes from './routes/notasRoutes.js';

const app = express();
const PORT = process.env.PORT || 4006;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:4006', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Rutas
app.use('/auth', authRoutes);
app.use('/auth', academicRoutes);
app.use('/auth', notasRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'API de Notas PPK funcionando',
    rutas: [
      '/auth/login', '/auth/loginAdm', '/auth/verificar',
      '/auth/facultades', '/auth/carreras', '/auth/brigadas',
      '/auth/estudiantes', '/auth/asignaturas', '/auth/notas'
    ]
  });
});

app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('   SISTEMA DE NOTAS PPK — Node.js + Supabase');
  console.log('='.repeat(50));
  console.log(`🌐 Servidor en http://localhost:${PORT}`);
  console.log(`🗄️  Supabase: ${process.env.SUPABASE_URL}`);
  console.log('='.repeat(50));
});
