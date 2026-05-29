// src/server.js
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const express = require('express');
const session = require('express-session');
const cors    = require('cors');
const path    = require('path');
const fs      = require('fs');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SECRET_KEY || 'votaciones-secret-2025',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: parseInt(process.env.SESSION_MAX_AGE || '7200000'),
    httpOnly: true,
    secure: false,
    sameSite: 'lax'
  }
}));

const FRONTEND = path.resolve(__dirname, '../frontend');
app.use(express.static(FRONTEND));

// Rutas
app.use(require('./routes/auth'));
app.use(require('./routes/candidatos'));
app.use(require('./routes/votacion'));
app.use(require('./routes/resultados'));

// Fallback
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Endpoint no encontrado' });
  res.sendFile(path.join(FRONTEND, 'index.html'));
});

const PORT = parseInt(process.env.PORT || '4005');
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log('='.repeat(48));
  console.log('   SISTEMA DE VOTACIONES — Node.js + Supabase');
  console.log('='.repeat(48));
  console.log(`🌐 http://localhost:${PORT}`);
  console.log(`🗄️  ${process.env.SUPABASE_URL}`);
  console.log('='.repeat(48));
});

module.exports = app;
