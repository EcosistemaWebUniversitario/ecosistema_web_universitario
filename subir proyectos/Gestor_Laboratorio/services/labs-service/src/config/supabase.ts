import { createClient } from '@supabase/supabase-js';

// 🟢 Validación de variables de entorno
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// 🚨 Seguridad: evitar arranque silencioso roto
if (!supabaseUrl || !supabaseKey) {
	throw new Error('Missing Supabase environment variables');
}

// 🟢 Cliente único del servicio
export const supabase = createClient(supabaseUrl, supabaseKey);
