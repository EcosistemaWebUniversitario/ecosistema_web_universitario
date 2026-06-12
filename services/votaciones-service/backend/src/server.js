// src/server.js
const path = require('path');
const fs = require('fs');
require('dotenv').config({
  path: process.env.NODE_ENV === 'development'
    ? path.resolve(__dirname, '../.env.local')
    : path.resolve(__dirname, '../.env')
});

const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares básicos
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos del frontend
const FRONTEND = path.resolve(__dirname, '../frontend');
app.use(express.static(FRONTEND));

// Rutas de autenticación (redirigen al auth-service central)
app.use(require('./routes/auth'));

// Rutas de la API de votaciones (protegidas con JWT y bajo el prefijo /api/votaciones)
app.use('/api/votaciones', require('./routes/candidatos'));
app.use('/api/votaciones', require('./routes/votacion'));
app.use('/api/votaciones', require('./routes/resultados'));

// Fallback para SPA o página principal
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Endpoint no encontrado' });
  }
  res.sendFile(path.join(FRONTEND, 'index.html'));
});

// Manejo de errores
app.use((err, req, res, _next) => {
  console.error('[ERROR]', err.message);
  if (req.path.startsWith('/api/')) {
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
  res.status(500).send('Error interno del servidor');
});

const PORT = parseInt(process.env.PORT || '4004');
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log('='.repeat(52));
  console.log('   SISTEMA DE VOTACIONES — Node.js + Supabase Auth (JWT)');
  console.log('='.repeat(52));
  console.log(`🌐 http://localhost:${PORT}`);
  console.log(`🗄️  ${process.env.SUPABASE_URL}`);
  console.log(`🔑 Entorno: ${process.env.NODE_ENV || 'producción'}`);
  console.log('='.repeat(52));
});

module.exports = app;