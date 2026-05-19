// src/server.js
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const express   = require('express');
const session   = require('express-session');
const FileStore = require('session-file-store')(session);
const cors      = require('cors');
const path      = require('path');
const fs        = require('fs');

if (!process.env.SECRET_KEY) {
  console.error('\n[ERROR] SECRET_KEY no está definida en el .env\n');
  process.exit(1);
}

const sessionsDir = path.resolve(__dirname, '../sessions');
['uploads/excel', 'uploads/pdf', sessionsDir].forEach(d => {
  fs.mkdirSync(path.resolve(__dirname, '..', d), { recursive: true });
});

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  store: new FileStore({
    path: sessionsDir,
    ttl: parseInt(process.env.SESSION_MAX_AGE || '7200000') / 1000,
    reapInterval: 3600,
  }),
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: parseInt(process.env.SESSION_MAX_AGE || '7200000'),
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
  },
}));

const FRONTEND = path.resolve(__dirname, '../frontend');
app.use(express.static(FRONTEND));

const SOUNDS = path.resolve(__dirname, '../sounds');
if (fs.existsSync(SOUNDS)) app.use('/sounds', express.static(SOUNDS));

// Rutas
app.use(require('./routes/auth'));
app.use(require('./routes/profesores'));
app.use(require('./routes/asignaturas'));
app.use(require('./routes/turnos'));
app.use(require('./routes/horarios'));
app.use(require('./routes/usuario'));
app.use(require('./routes/admin'));

// Fallback
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Endpoint no encontrado' });
  res.sendFile(path.join(FRONTEND, 'index.html'));
});

app.use((err, req, res, _next) => {
  console.error('[ERROR]', err.message);
  if (req.path.startsWith('/api/')) return res.status(500).json({ error: 'Error interno del servidor' });
  res.status(500).send('Error interno del servidor');
});

const PORT = parseInt(process.env.PORT || '5000');
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log('='.repeat(52));
  console.log('   SISTEMA DE HORARIOS — Node.js + Supabase Auth');
  console.log('='.repeat(52));
  console.log(`🌐 http://localhost:${PORT}`);
  console.log(`🗄️  ${process.env.SUPABASE_URL}`);
  console.log('='.repeat(52));
});

module.exports = app;
