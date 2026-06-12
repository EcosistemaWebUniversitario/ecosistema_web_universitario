// src/server.js
const path = require('path');
const fs = require('fs');

// Carga condicional de variables de entorno según NODE_ENV
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

// Servir archivos estáticos del frontend (HTML, CSS, JS)
const FRONTEND = path.resolve(__dirname, '../frontend');
app.use(express.static(FRONTEND));

// Servir sonidos si existen
const SOUNDS = path.resolve(__dirname, '../sounds');
if (fs.existsSync(SOUNDS)) {
  app.use('/sounds', express.static(SOUNDS));
}

// Rutas de autenticación (redirigen al auth-service central)
app.use(require('./routes/auth'));

// Rutas de la API de horarios (protegidas con JWT y bajo el prefijo /api/horarios)
// Rutas de la API de horarios (cada módulo con su prefijo específico)
app.use('/api/horarios/profesores', require('./routes/profesores'));
app.use('/api/horarios/asignaturas', require('./routes/asignaturas'));
app.use('/api/horarios/turnos', require('./routes/turnos'));
app.use('/api/horarios/horarios', require('./routes/horarios'));
app.use('/api/horarios', require('./routes/usuario'));       // tiene rutas variadas: /horarios-disponibles, /estadisticas, /calendario-semanal, etc.
app.use('/api/horarios', require('./routes/admin'));         // /usuarios, etc.

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

const PORT = parseInt(process.env.PORT || '5000');
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log('='.repeat(52));
  console.log('   SISTEMA DE HORARIOS — Node.js + Supabase Auth (JWT)');
  console.log('='.repeat(52));
  console.log(`🌐 http://localhost:${PORT}`);
  console.log(`🗄️  ${process.env.SUPABASE_URL}`);
  console.log(`🔑 Entorno: ${process.env.NODE_ENV || 'producción'}`);
  console.log('='.repeat(52));
});

module.exports = app;