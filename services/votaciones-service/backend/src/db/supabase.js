// src/db/supabase.js
const { createClient } = require('@supabase/supabase-js');

const URL  = process.env.SUPABASE_URL;
const ANON = process.env.SUPABASE_ANON_KEY;
const SVC  = process.env.SUPABASE_SERVICE_KEY;

if (!URL || !ANON || !SVC) {
  console.error('[ERROR] Faltan variables SUPABASE_URL, SUPABASE_ANON_KEY o SUPABASE_SERVICE_KEY en el entorno');
  process.exit(1);
}

// Cliente anónimo para schema votaciones (usado para validar tokens)
const supabase = createClient(URL, ANON, {
  db: { schema: 'votaciones' }
});

// Cliente admin para public (ignora RLS – auth y profiles)
const supabaseAdmin = createClient(URL, SVC, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// Cliente admin para schema votaciones (ignora RLS – candidatos, votos, config)
const supabaseVotaciones = createClient(URL, SVC, {
  db: { schema: 'votaciones' },
  auth: { autoRefreshToken: false, persistSession: false }
});

module.exports = { supabase, supabaseAdmin, supabaseVotaciones };