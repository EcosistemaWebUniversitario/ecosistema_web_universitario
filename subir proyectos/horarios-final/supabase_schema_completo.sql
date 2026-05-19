-- ============================================================
-- SISTEMA DE HORARIOS — Schema SQL para Supabase
-- Ejecutar en: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- TABLA: profesor
CREATE TABLE IF NOT EXISTS public.profesor (
  id                   BIGSERIAL PRIMARY KEY,
  codigo               TEXT UNIQUE NOT NULL,
  nombres              TEXT NOT NULL,
  apellidos            TEXT NOT NULL,
  categoria_academica  TEXT,
  categoria_cientifica TEXT,
  email                TEXT,
  telefono             TEXT,
  activo               BOOLEAN NOT NULL DEFAULT TRUE,
  fecha_creacion       TIMESTAMPTZ DEFAULT NOW()
);

-- TABLA: asignatura
CREATE TABLE IF NOT EXISTS public.asignatura (
  id                    BIGSERIAL PRIMARY KEY,
  codigo                TEXT UNIQUE NOT NULL,
  nombre                TEXT NOT NULL,
  descripcion           TEXT,
  año_academico         INTEGER NOT NULL,
  periodo               INTEGER NOT NULL,
  horas_presenciales    INTEGER DEFAULT 0,
  horas_no_presenciales INTEGER DEFAULT 0,
  horas_totales         INTEGER DEFAULT 0,
  tipo_evaluacion       TEXT DEFAULT 'EF',
  color                 TEXT DEFAULT '#3498db',
  profesor_id           BIGINT REFERENCES public.profesor(id),
  fecha_creacion        TIMESTAMPTZ DEFAULT NOW()
);

-- TABLA: turno
CREATE TABLE IF NOT EXISTS public.turno (
  id               BIGSERIAL PRIMARY KEY,
  nombre           TEXT NOT NULL,
  hora_inicio      TEXT NOT NULL,
  hora_fin         TEXT NOT NULL,
  duracion_minutos INTEGER DEFAULT 90,
  seccion          TEXT NOT NULL,
  orden            INTEGER NOT NULL,
  activo           BOOLEAN NOT NULL DEFAULT TRUE
);

-- TABLA: horario_general
CREATE TABLE IF NOT EXISTS public.horario_general (
  id               BIGSERIAL PRIMARY KEY,
  titulo           TEXT NOT NULL DEFAULT 'Horario Docente',
  año_academico    TEXT NOT NULL,
  semestre         INTEGER NOT NULL,
  año_carrera      INTEGER NOT NULL,
  carrera          TEXT DEFAULT 'INGENIERÍA INFORMÁTICA',
  modalidad        TEXT DEFAULT 'Diurno',
  semanas_totales  INTEGER DEFAULT 22,
  semanas_clases   INTEGER DEFAULT 19,
  semanas_examenes INTEGER DEFAULT 3,
  fecha_inicio     DATE NOT NULL,
  fecha_fin        DATE NOT NULL,
  creado_por       UUID REFERENCES auth.users(id),
  creado_en        TIMESTAMPTZ DEFAULT NOW(),
  actualizado_en   TIMESTAMPTZ,
  activo           BOOLEAN NOT NULL DEFAULT TRUE
);

-- TABLA: horario_semanal
CREATE TABLE IF NOT EXISTS public.horario_semanal (
  id                 BIGSERIAL PRIMARY KEY,
  horario_general_id BIGINT NOT NULL REFERENCES public.horario_general(id) ON DELETE CASCADE,
  semana_numero      INTEGER NOT NULL,
  dia_semana         INTEGER NOT NULL,
  turno_id           BIGINT NOT NULL REFERENCES public.turno(id),
  asignatura_id      BIGINT REFERENCES public.asignatura(id),
  profesor_id        BIGINT REFERENCES public.profesor(id),
  color              TEXT,
  es_examen          BOOLEAN NOT NULL DEFAULT FALSE,
  fecha_especifica   DATE
);

-- ÍNDICES
CREATE INDEX IF NOT EXISTS idx_hs_horario    ON public.horario_semanal(horario_general_id);
CREATE INDEX IF NOT EXISTS idx_hs_semana     ON public.horario_semanal(semana_numero);
CREATE INDEX IF NOT EXISTS idx_hs_asignatura ON public.horario_semanal(asignatura_id);
CREATE INDEX IF NOT EXISTS idx_hs_profesor   ON public.horario_semanal(profesor_id);

-- TURNOS POR DEFECTO
INSERT INTO public.turno (nombre, hora_inicio, hora_fin, duracion_minutos, seccion, orden)
SELECT * FROM (VALUES
  ('Mañana 1', '08:15', '09:45', 90, 'mañana', 1),
  ('Mañana 2', '09:50', '11:20', 90, 'mañana', 2),
  ('Mañana 3', '11:35', '13:05', 90, 'mañana', 3),
  ('Tarde 1',  '13:10', '14:40', 90, 'tarde',  4),
  ('Tarde 2',  '14:45', '16:15', 90, 'tarde',  5),
  ('Tarde 3',  '16:30', '18:00', 90, 'tarde',  6)
) AS v(nombre, hora_inicio, hora_fin, duracion_minutos, seccion, orden)
WHERE NOT EXISTS (SELECT 1 FROM public.turno LIMIT 1);

-- ============================================================
-- RLS (Row Level Security)
-- ============================================================
ALTER TABLE public.profesor        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asignatura      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.turno           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horario_general ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horario_semanal ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_all" ON public.profesor
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "allow_all" ON public.asignatura
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "allow_all" ON public.turno
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "allow_all" ON public.horario_general
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "allow_all" ON public.horario_semanal
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
