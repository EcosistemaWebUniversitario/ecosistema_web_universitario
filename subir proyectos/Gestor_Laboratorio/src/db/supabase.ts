// src/db/supabase.ts
import dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
const supabaseAnon = process.env.SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// Cliente base sin schema fijo
const supabaseBase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// db() aplica .schema('labs') en cada llamada — compatible con v2.107
export const db = () => supabaseBase.schema('lab_services') as any;

// Cliente anon para verificar tokens JWT
export const supabaseAuth = createClient(supabaseUrl, supabaseAnon);
