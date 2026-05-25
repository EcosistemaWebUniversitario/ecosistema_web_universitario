import dotenv from 'dotenv';
import path from 'path';

// Cargar .env.local solo si estamos en desarrollo, de lo contrario cargar .env
if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: '.env.local' });
} else {
  dotenv.config();  // carga .env por defecto
}

import app from './app';

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
  console.log(`Using Supabase URL: ${process.env.SUPABASE_URL}`);
});