// src/db/supabase.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabaseAnon = process.env.SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseServiceKey || !supabaseAnon) {
  throw new Error('Faltan variables de entorno de Supabase');
}

// Cliente admin (service_role) para operaciones que requieren privilegios elevados
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// Cliente anónimo para verificar tokens JWT
export const supabaseAuth = createClient(supabaseUrl, supabaseAnon);

// Helper para acceder al schema 'lab_services' usando el cliente admin
export const db = () => supabaseAdmin.schema('lab_services');