alter table "academico"."students" add column "id_brigada" bigint;

alter table "academico"."students" add constraint "students_id_brigada_fkey" FOREIGN KEY (id_brigada) REFERENCES notas.brigada(id_brigada) ON DELETE SET NULL not valid;

alter table "academico"."students" validate constraint "students_id_brigada_fkey";

grant references on table "academico"."careers" to "service_role";

grant trigger on table "academico"."careers" to "service_role";

grant truncate on table "academico"."careers" to "service_role";

grant references on table "academico"."faculties" to "service_role";

grant trigger on table "academico"."faculties" to "service_role";

grant truncate on table "academico"."faculties" to "service_role";

grant references on table "academico"."municipalities" to "service_role";

grant trigger on table "academico"."municipalities" to "service_role";

grant truncate on table "academico"."municipalities" to "service_role";

grant references on table "academico"."professors" to "service_role";

grant trigger on table "academico"."professors" to "service_role";

grant truncate on table "academico"."professors" to "service_role";

grant references on table "academico"."students" to "service_role";

grant trigger on table "academico"."students" to "service_role";

grant truncate on table "academico"."students" to "service_role";

alter table "lab_services"."computers" alter column "status" set default 'AVAILABLE'::public.computer_status;

alter table "lab_services"."computers" alter column "status" set data type public.computer_status using "status"::text::public.computer_status;

alter table "lab_services"."incidents" alter column "status" set default 'OPEN'::public.incident_status;

alter table "lab_services"."incidents" alter column "status" set data type public.incident_status using "status"::text::public.incident_status;

alter table "lab_services"."labs" alter column "status" set default 'ACTIVE'::public.lab_status;

alter table "lab_services"."labs" alter column "status" set data type public.lab_status using "status"::text::public.lab_status;

create schema if not exists "labs";

create schema if not exists "notas";

create sequence "notas"."asignatura_id_asignatura_seq";

create sequence "notas"."brigada_id_brigada_seq";

create sequence "notas"."nota_id_nota_seq";


  create table "notas"."asignatura" (
    "id_asignatura" bigint not null default nextval('notas.asignatura_id_asignatura_seq'::regclass),
    "nombre_asignatura" text not null
      );


alter table "notas"."asignatura" enable row level security;


  create table "notas"."brigada" (
    "id_brigada" bigint not null default nextval('notas.brigada_id_brigada_seq'::regclass),
    "id_carrera" bigint not null,
    "nombre_brigada" text not null,
    "año_brigada" integer not null,
    "año_final_brigada" integer not null
      );


alter table "notas"."brigada" enable row level security;


  create table "notas"."carrera_asignatura" (
    "id_carrera" bigint not null,
    "id_asignatura" bigint not null
      );


alter table "notas"."carrera_asignatura" enable row level security;


  create table "notas"."nota" (
    "id_nota" bigint not null default nextval('notas.nota_id_nota_seq'::regclass),
    "id_estudiante" bigint not null,
    "id_asignatura" bigint not null,
    "valor" numeric(4,2) not null,
    "año" integer not null
      );


alter table "notas"."nota" enable row level security;

alter sequence "notas"."asignatura_id_asignatura_seq" owned by "notas"."asignatura"."id_asignatura";

alter sequence "notas"."brigada_id_brigada_seq" owned by "notas"."brigada"."id_brigada";

alter sequence "notas"."nota_id_nota_seq" owned by "notas"."nota"."id_nota";

CREATE UNIQUE INDEX asignatura_pkey ON notas.asignatura USING btree (id_asignatura);

CREATE UNIQUE INDEX brigada_pkey ON notas.brigada USING btree (id_brigada);

CREATE UNIQUE INDEX carrera_asignatura_pkey ON notas.carrera_asignatura USING btree (id_carrera, id_asignatura);

CREATE UNIQUE INDEX nota_pkey ON notas.nota USING btree (id_nota);

alter table "notas"."asignatura" add constraint "asignatura_pkey" PRIMARY KEY using index "asignatura_pkey";

alter table "notas"."brigada" add constraint "brigada_pkey" PRIMARY KEY using index "brigada_pkey";

alter table "notas"."carrera_asignatura" add constraint "carrera_asignatura_pkey" PRIMARY KEY using index "carrera_asignatura_pkey";

alter table "notas"."nota" add constraint "nota_pkey" PRIMARY KEY using index "nota_pkey";

alter table "notas"."carrera_asignatura" add constraint "carrera_asignatura_id_asignatura_fkey" FOREIGN KEY (id_asignatura) REFERENCES notas.asignatura(id_asignatura) ON DELETE CASCADE not valid;

alter table "notas"."carrera_asignatura" validate constraint "carrera_asignatura_id_asignatura_fkey";

alter table "notas"."nota" add constraint "nota_id_asignatura_fkey" FOREIGN KEY (id_asignatura) REFERENCES notas.asignatura(id_asignatura) not valid;

alter table "notas"."nota" validate constraint "nota_id_asignatura_fkey";

alter table "notas"."nota" add constraint "nota_valor_check" CHECK (((valor >= (0)::numeric) AND (valor <= (100)::numeric))) not valid;

alter table "notas"."nota" validate constraint "nota_valor_check";

grant delete on table "notas"."asignatura" to "anon";

grant insert on table "notas"."asignatura" to "anon";

grant select on table "notas"."asignatura" to "anon";

grant update on table "notas"."asignatura" to "anon";

grant delete on table "notas"."asignatura" to "authenticated";

grant insert on table "notas"."asignatura" to "authenticated";

grant select on table "notas"."asignatura" to "authenticated";

grant update on table "notas"."asignatura" to "authenticated";

grant delete on table "notas"."asignatura" to "service_role";

grant insert on table "notas"."asignatura" to "service_role";

grant references on table "notas"."asignatura" to "service_role";

grant select on table "notas"."asignatura" to "service_role";

grant trigger on table "notas"."asignatura" to "service_role";

grant truncate on table "notas"."asignatura" to "service_role";

grant update on table "notas"."asignatura" to "service_role";

grant delete on table "notas"."brigada" to "anon";

grant insert on table "notas"."brigada" to "anon";

grant select on table "notas"."brigada" to "anon";

grant update on table "notas"."brigada" to "anon";

grant delete on table "notas"."brigada" to "authenticated";

grant insert on table "notas"."brigada" to "authenticated";

grant select on table "notas"."brigada" to "authenticated";

grant update on table "notas"."brigada" to "authenticated";

grant delete on table "notas"."brigada" to "service_role";

grant insert on table "notas"."brigada" to "service_role";

grant references on table "notas"."brigada" to "service_role";

grant select on table "notas"."brigada" to "service_role";

grant trigger on table "notas"."brigada" to "service_role";

grant truncate on table "notas"."brigada" to "service_role";

grant update on table "notas"."brigada" to "service_role";

grant delete on table "notas"."carrera_asignatura" to "anon";

grant insert on table "notas"."carrera_asignatura" to "anon";

grant select on table "notas"."carrera_asignatura" to "anon";

grant update on table "notas"."carrera_asignatura" to "anon";

grant delete on table "notas"."carrera_asignatura" to "authenticated";

grant insert on table "notas"."carrera_asignatura" to "authenticated";

grant select on table "notas"."carrera_asignatura" to "authenticated";

grant update on table "notas"."carrera_asignatura" to "authenticated";

grant delete on table "notas"."carrera_asignatura" to "service_role";

grant insert on table "notas"."carrera_asignatura" to "service_role";

grant references on table "notas"."carrera_asignatura" to "service_role";

grant select on table "notas"."carrera_asignatura" to "service_role";

grant trigger on table "notas"."carrera_asignatura" to "service_role";

grant truncate on table "notas"."carrera_asignatura" to "service_role";

grant update on table "notas"."carrera_asignatura" to "service_role";

grant delete on table "notas"."nota" to "anon";

grant insert on table "notas"."nota" to "anon";

grant select on table "notas"."nota" to "anon";

grant update on table "notas"."nota" to "anon";

grant delete on table "notas"."nota" to "authenticated";

grant insert on table "notas"."nota" to "authenticated";

grant select on table "notas"."nota" to "authenticated";

grant update on table "notas"."nota" to "authenticated";

grant delete on table "notas"."nota" to "service_role";

grant insert on table "notas"."nota" to "service_role";

grant references on table "notas"."nota" to "service_role";

grant select on table "notas"."nota" to "service_role";

grant trigger on table "notas"."nota" to "service_role";

grant truncate on table "notas"."nota" to "service_role";

grant update on table "notas"."nota" to "service_role";


  create policy "allow_all"
  on "notas"."asignatura"
  as permissive
  for all
  to anon, authenticated
using (true)
with check (true);



  create policy "allow_all"
  on "notas"."brigada"
  as permissive
  for all
  to anon, authenticated
using (true)
with check (true);



  create policy "allow_all"
  on "notas"."carrera_asignatura"
  as permissive
  for all
  to anon, authenticated
using (true)
with check (true);



  create policy "allow_all"
  on "notas"."nota"
  as permissive
  for all
  to anon, authenticated
using (true)
with check (true);


create schema if not exists "votaciones";

create sequence "votaciones"."candidato_id_seq";

create sequence "votaciones"."voto_lider_id_seq";

create sequence "votaciones"."voto_organizacion_id_seq";


  create table "votaciones"."candidato" (
    "id" bigint not null default nextval('votaciones.candidato_id_seq'::regclass),
    "nombre" text not null,
    "descripcion" text,
    "foto" text,
    "tipo" text not null,
    "estudiante_id" bigint,
    "profile_id" uuid
      );


alter table "votaciones"."candidato" enable row level security;


  create table "votaciones"."configuracion" (
    "id" integer not null default 1,
    "inicio_votacion" timestamp with time zone,
    "fin_votacion" timestamp with time zone
      );


alter table "votaciones"."configuracion" enable row level security;


  create table "votaciones"."voto_lider" (
    "id" bigint not null default nextval('votaciones.voto_lider_id_seq'::regclass),
    "usuario_id" uuid,
    "candidato_id" bigint,
    "fecha_voto" timestamp with time zone default now()
      );


alter table "votaciones"."voto_lider" enable row level security;


  create table "votaciones"."voto_organizacion" (
    "id" bigint not null default nextval('votaciones.voto_organizacion_id_seq'::regclass),
    "usuario_id" uuid,
    "candidato_id" bigint,
    "fecha_voto" timestamp with time zone default now()
      );


alter table "votaciones"."voto_organizacion" enable row level security;

alter sequence "votaciones"."candidato_id_seq" owned by "votaciones"."candidato"."id";

alter sequence "votaciones"."voto_lider_id_seq" owned by "votaciones"."voto_lider"."id";

alter sequence "votaciones"."voto_organizacion_id_seq" owned by "votaciones"."voto_organizacion"."id";

CREATE UNIQUE INDEX candidato_pkey ON votaciones.candidato USING btree (id);

CREATE UNIQUE INDEX configuracion_pkey ON votaciones.configuracion USING btree (id);

CREATE UNIQUE INDEX voto_lider_pkey ON votaciones.voto_lider USING btree (id);

CREATE UNIQUE INDEX voto_lider_usuario_id_key ON votaciones.voto_lider USING btree (usuario_id);

CREATE UNIQUE INDEX voto_organizacion_pkey ON votaciones.voto_organizacion USING btree (id);

CREATE UNIQUE INDEX voto_organizacion_usuario_id_candidato_id_key ON votaciones.voto_organizacion USING btree (usuario_id, candidato_id);

alter table "votaciones"."candidato" add constraint "candidato_pkey" PRIMARY KEY using index "candidato_pkey";

alter table "votaciones"."configuracion" add constraint "configuracion_pkey" PRIMARY KEY using index "configuracion_pkey";

alter table "votaciones"."voto_lider" add constraint "voto_lider_pkey" PRIMARY KEY using index "voto_lider_pkey";

alter table "votaciones"."voto_organizacion" add constraint "voto_organizacion_pkey" PRIMARY KEY using index "voto_organizacion_pkey";

alter table "votaciones"."candidato" add constraint "candidato_estudiante_id_fkey" FOREIGN KEY (estudiante_id) REFERENCES academico.students(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "votaciones"."candidato" validate constraint "candidato_estudiante_id_fkey";

alter table "votaciones"."candidato" add constraint "candidato_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "votaciones"."candidato" validate constraint "candidato_profile_id_fkey";

alter table "votaciones"."candidato" add constraint "candidato_tipo_check" CHECK ((tipo = ANY (ARRAY['organizacion'::text, 'lider'::text, 'ambos'::text]))) not valid;

alter table "votaciones"."candidato" validate constraint "candidato_tipo_check";

alter table "votaciones"."voto_lider" add constraint "voto_lider_candidato_id_fkey" FOREIGN KEY (candidato_id) REFERENCES votaciones.candidato(id) not valid;

alter table "votaciones"."voto_lider" validate constraint "voto_lider_candidato_id_fkey";

alter table "votaciones"."voto_lider" add constraint "voto_lider_usuario_id_fkey" FOREIGN KEY (usuario_id) REFERENCES auth.users(id) not valid;

alter table "votaciones"."voto_lider" validate constraint "voto_lider_usuario_id_fkey";

alter table "votaciones"."voto_lider" add constraint "voto_lider_usuario_id_key" UNIQUE using index "voto_lider_usuario_id_key";

alter table "votaciones"."voto_organizacion" add constraint "voto_organizacion_candidato_id_fkey" FOREIGN KEY (candidato_id) REFERENCES votaciones.candidato(id) not valid;

alter table "votaciones"."voto_organizacion" validate constraint "voto_organizacion_candidato_id_fkey";

alter table "votaciones"."voto_organizacion" add constraint "voto_organizacion_usuario_id_candidato_id_key" UNIQUE using index "voto_organizacion_usuario_id_candidato_id_key";

alter table "votaciones"."voto_organizacion" add constraint "voto_organizacion_usuario_id_fkey" FOREIGN KEY (usuario_id) REFERENCES auth.users(id) not valid;

alter table "votaciones"."voto_organizacion" validate constraint "voto_organizacion_usuario_id_fkey";

grant delete on table "votaciones"."candidato" to "anon";

grant insert on table "votaciones"."candidato" to "anon";

grant select on table "votaciones"."candidato" to "anon";

grant update on table "votaciones"."candidato" to "anon";

grant delete on table "votaciones"."candidato" to "authenticated";

grant insert on table "votaciones"."candidato" to "authenticated";

grant select on table "votaciones"."candidato" to "authenticated";

grant update on table "votaciones"."candidato" to "authenticated";

grant delete on table "votaciones"."candidato" to "service_role";

grant insert on table "votaciones"."candidato" to "service_role";

grant references on table "votaciones"."candidato" to "service_role";

grant select on table "votaciones"."candidato" to "service_role";

grant trigger on table "votaciones"."candidato" to "service_role";

grant truncate on table "votaciones"."candidato" to "service_role";

grant update on table "votaciones"."candidato" to "service_role";

grant delete on table "votaciones"."configuracion" to "anon";

grant insert on table "votaciones"."configuracion" to "anon";

grant select on table "votaciones"."configuracion" to "anon";

grant update on table "votaciones"."configuracion" to "anon";

grant delete on table "votaciones"."configuracion" to "authenticated";

grant insert on table "votaciones"."configuracion" to "authenticated";

grant select on table "votaciones"."configuracion" to "authenticated";

grant update on table "votaciones"."configuracion" to "authenticated";

grant delete on table "votaciones"."configuracion" to "service_role";

grant insert on table "votaciones"."configuracion" to "service_role";

grant references on table "votaciones"."configuracion" to "service_role";

grant select on table "votaciones"."configuracion" to "service_role";

grant trigger on table "votaciones"."configuracion" to "service_role";

grant truncate on table "votaciones"."configuracion" to "service_role";

grant update on table "votaciones"."configuracion" to "service_role";

grant delete on table "votaciones"."voto_lider" to "anon";

grant insert on table "votaciones"."voto_lider" to "anon";

grant select on table "votaciones"."voto_lider" to "anon";

grant update on table "votaciones"."voto_lider" to "anon";

grant delete on table "votaciones"."voto_lider" to "authenticated";

grant insert on table "votaciones"."voto_lider" to "authenticated";

grant select on table "votaciones"."voto_lider" to "authenticated";

grant update on table "votaciones"."voto_lider" to "authenticated";

grant delete on table "votaciones"."voto_lider" to "service_role";

grant insert on table "votaciones"."voto_lider" to "service_role";

grant references on table "votaciones"."voto_lider" to "service_role";

grant select on table "votaciones"."voto_lider" to "service_role";

grant trigger on table "votaciones"."voto_lider" to "service_role";

grant truncate on table "votaciones"."voto_lider" to "service_role";

grant update on table "votaciones"."voto_lider" to "service_role";

grant delete on table "votaciones"."voto_organizacion" to "anon";

grant insert on table "votaciones"."voto_organizacion" to "anon";

grant select on table "votaciones"."voto_organizacion" to "anon";

grant update on table "votaciones"."voto_organizacion" to "anon";

grant delete on table "votaciones"."voto_organizacion" to "authenticated";

grant insert on table "votaciones"."voto_organizacion" to "authenticated";

grant select on table "votaciones"."voto_organizacion" to "authenticated";

grant update on table "votaciones"."voto_organizacion" to "authenticated";

grant delete on table "votaciones"."voto_organizacion" to "service_role";

grant insert on table "votaciones"."voto_organizacion" to "service_role";

grant references on table "votaciones"."voto_organizacion" to "service_role";

grant select on table "votaciones"."voto_organizacion" to "service_role";

grant trigger on table "votaciones"."voto_organizacion" to "service_role";

grant truncate on table "votaciones"."voto_organizacion" to "service_role";

grant update on table "votaciones"."voto_organizacion" to "service_role";


