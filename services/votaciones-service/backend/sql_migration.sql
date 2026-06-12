-- Migración: vincular candidatos a public.profiles (rol estudiante)
-- Ejecutar en Supabase > SQL Editor ANTES de arrancar el servidor

ALTER TABLE votaciones.candidato
  ADD COLUMN IF NOT EXISTS profile_id UUID
    REFERENCES public.profiles(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_candidato_profile_id
  ON votaciones.candidato (profile_id);
