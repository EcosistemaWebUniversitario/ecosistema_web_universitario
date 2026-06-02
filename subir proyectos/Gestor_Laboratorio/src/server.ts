import dotenv from 'dotenv';
dotenv.config();

import app from './app';

const PORT = process.env.PORT || 4005;

app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('   GESTOR DE LABORATORIOS — Node.js + Supabase');
  console.log('='.repeat(50));
  console.log(`🧪 Corriendo en http://localhost:${PORT}`);
  console.log(`📁 Frontend: http://localhost:${PORT}/login.html`);
  console.log('='.repeat(50));
});