// src/server.ts
import path from 'path';
import dotenv from 'dotenv';

// Carga condicional de variables de entorno según NODE_ENV
dotenv.config({
  path: process.env.NODE_ENV === 'development'
    ? path.resolve(__dirname, '../.env.local')
    : path.resolve(__dirname, '../.env')
});

import app from './app';

const PORT = parseInt(process.env.PORT || '4005');
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log('='.repeat(52));
  console.log('   GESTOR DE LABORATORIOS — Node.js + Supabase Auth (JWT)');
  console.log('='.repeat(52));
  console.log(`🧪 http://localhost:${PORT}`);
  console.log(`🗄️  ${process.env.SUPABASE_URL}`);
  console.log(`🔑 Entorno: ${process.env.NODE_ENV || 'producción'}`);
  console.log('='.repeat(52));
});

export default app;