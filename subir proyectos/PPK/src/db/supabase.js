// src/db/supabase.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const URL  = process.env.SUPABASE_URL;
const ANON = process.env.SUPABASE_ANON_KEY;
const SVC  = process.env.SUPABASE_SERVICE_KEY;

if (!URL || !ANON || !SVC) {
  throw new Error('Faltan variables de Supabase en .env');
}

// Cliente base service role — sin schema fijo
const supabaseBase = createClient(URL, SVC, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// db() para schema notas
export const supabase = {
  from: (table) => supabaseBase.schema('notas').from(table),
  auth: supabaseBase.auth
};

// db() para schema academico
export const supabaseAcademico = {
  from: (table) => supabaseBase.schema('academico').from(table)
};

// Cliente admin — para auth y profiles
export const supabaseAdmin = createClient(URL, SVC, {
  auth: { autoRefreshToken: false, persistSession: false }
});
