require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { createClient } = require('@supabase/supabase-js');

const URL  = process.env.SUPABASE_URL;
const ANON = process.env.SUPABASE_ANON_KEY;
const SVC  = process.env.SUPABASE_SERVICE_KEY;

if (!URL || !ANON || !SVC) {
  console.error('[ERROR] Faltan variables en .env');
  process.exit(1);
}

const supabase = createClient(URL, ANON, {
  db: { schema: 'horarios' }
});

const supabaseAdmin = createClient(URL, SVC, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const supabasePublic = createClient(URL, ANON, {
  db: { schema: 'public' }
});

module.exports = { supabase, supabaseAdmin, supabasePublic };