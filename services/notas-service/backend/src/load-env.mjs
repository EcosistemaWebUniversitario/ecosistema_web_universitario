// src/load-env.mjs
import dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const envFile = process.env.NODE_ENV === 'development'
  ? resolve(__dirname, '../.env.local')
  : resolve(__dirname, '../.env');

// Forzamos la carga del archivo correcto, incluso si ya existen variables
dotenv.config({ path: envFile, override: true });

console.log(`[load-env] Cargado: ${envFile}`);
console.log(`[load-env] SUPABASE_URL: ${process.env.SUPABASE_URL}`);