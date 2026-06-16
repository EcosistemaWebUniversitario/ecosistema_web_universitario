
  create table "lab_services"."computer" (
    "id" uuid not null default gen_random_uuid(),
    "lab_id" uuid not null,
    "serial_number" text not null,
    "status" text not null default 'AVAILABLE'::text,
    "brand" text,
    "model" text,
    "created_at" timestamp with time zone default now()
      );


alter table "lab_services"."computer" enable row level security;


  create table "lab_services"."incident" (
    "id" uuid not null default gen_random_uuid(),
    "computer_id" uuid not null,
    "title" text not null,
    "description" text not null,
    "status" text not null default 'OPEN'::text,
    "reported_by" uuid,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "lab_services"."incident" enable row level security;


  create table "lab_services"."lab" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "location" text not null,
    "capacity" integer not null default 0,
    "status" text not null default 'ACTIVE'::text,
    "technician_id" uuid,
    "created_at" timestamp with time zone default now()
      );


alter table "lab_services"."lab" enable row level security;

CREATE UNIQUE INDEX computer_pkey ON lab_services.computer USING btree (id);

CREATE UNIQUE INDEX computer_serial_number_key ON lab_services.computer USING btree (serial_number);

CREATE UNIQUE INDEX incident_pkey ON lab_services.incident USING btree (id);

CREATE UNIQUE INDEX lab_name_key ON lab_services.lab USING btree (name);

CREATE UNIQUE INDEX lab_pkey ON lab_services.lab USING btree (id);

alter table "lab_services"."computer" add constraint "computer_pkey" PRIMARY KEY using index "computer_pkey";

alter table "lab_services"."incident" add constraint "incident_pkey" PRIMARY KEY using index "incident_pkey";

alter table "lab_services"."lab" add constraint "lab_pkey" PRIMARY KEY using index "lab_pkey";

alter table "lab_services"."computer" add constraint "computer_lab_id_fkey" FOREIGN KEY (lab_id) REFERENCES lab_services.lab(id) ON DELETE CASCADE not valid;

alter table "lab_services"."computer" validate constraint "computer_lab_id_fkey";

alter table "lab_services"."computer" add constraint "computer_serial_number_key" UNIQUE using index "computer_serial_number_key";

alter table "lab_services"."computer" add constraint "computer_status_check" CHECK ((status = ANY (ARRAY['AVAILABLE'::text, 'IN_USE'::text, 'BROKEN'::text, 'MAINTENANCE'::text]))) not valid;

alter table "lab_services"."computer" validate constraint "computer_status_check";

alter table "lab_services"."incident" add constraint "incident_computer_id_fkey" FOREIGN KEY (computer_id) REFERENCES lab_services.computer(id) ON DELETE CASCADE not valid;

alter table "lab_services"."incident" validate constraint "incident_computer_id_fkey";

alter table "lab_services"."incident" add constraint "incident_reported_by_fkey" FOREIGN KEY (reported_by) REFERENCES auth.users(id) not valid;

alter table "lab_services"."incident" validate constraint "incident_reported_by_fkey";

alter table "lab_services"."incident" add constraint "incident_status_check" CHECK ((status = ANY (ARRAY['OPEN'::text, 'IN_PROGRESS'::text, 'RESOLVED'::text, 'CLOSED'::text]))) not valid;

alter table "lab_services"."incident" validate constraint "incident_status_check";

alter table "lab_services"."lab" add constraint "lab_name_key" UNIQUE using index "lab_name_key";

alter table "lab_services"."lab" add constraint "lab_status_check" CHECK ((status = ANY (ARRAY['ACTIVE'::text, 'INACTIVE'::text, 'MAINTENANCE'::text]))) not valid;

alter table "lab_services"."lab" validate constraint "lab_status_check";

alter table "lab_services"."lab" add constraint "lab_technician_id_fkey" FOREIGN KEY (technician_id) REFERENCES auth.users(id) not valid;

alter table "lab_services"."lab" validate constraint "lab_technician_id_fkey";

grant delete on table "lab_services"."computer" to "anon";

grant insert on table "lab_services"."computer" to "anon";

grant select on table "lab_services"."computer" to "anon";

grant update on table "lab_services"."computer" to "anon";

grant delete on table "lab_services"."computer" to "authenticated";

grant insert on table "lab_services"."computer" to "authenticated";

grant select on table "lab_services"."computer" to "authenticated";

grant update on table "lab_services"."computer" to "authenticated";

grant delete on table "lab_services"."computer" to "service_role";

grant insert on table "lab_services"."computer" to "service_role";

grant references on table "lab_services"."computer" to "service_role";

grant select on table "lab_services"."computer" to "service_role";

grant trigger on table "lab_services"."computer" to "service_role";

grant truncate on table "lab_services"."computer" to "service_role";

grant update on table "lab_services"."computer" to "service_role";

grant delete on table "lab_services"."incident" to "anon";

grant insert on table "lab_services"."incident" to "anon";

grant select on table "lab_services"."incident" to "anon";

grant update on table "lab_services"."incident" to "anon";

grant delete on table "lab_services"."incident" to "authenticated";

grant insert on table "lab_services"."incident" to "authenticated";

grant select on table "lab_services"."incident" to "authenticated";

grant update on table "lab_services"."incident" to "authenticated";

grant delete on table "lab_services"."incident" to "service_role";

grant insert on table "lab_services"."incident" to "service_role";

grant references on table "lab_services"."incident" to "service_role";

grant select on table "lab_services"."incident" to "service_role";

grant trigger on table "lab_services"."incident" to "service_role";

grant truncate on table "lab_services"."incident" to "service_role";

grant update on table "lab_services"."incident" to "service_role";

grant delete on table "lab_services"."lab" to "anon";

grant insert on table "lab_services"."lab" to "anon";

grant select on table "lab_services"."lab" to "anon";

grant update on table "lab_services"."lab" to "anon";

grant delete on table "lab_services"."lab" to "authenticated";

grant insert on table "lab_services"."lab" to "authenticated";

grant select on table "lab_services"."lab" to "authenticated";

grant update on table "lab_services"."lab" to "authenticated";

grant delete on table "lab_services"."lab" to "service_role";

grant insert on table "lab_services"."lab" to "service_role";

grant references on table "lab_services"."lab" to "service_role";

grant select on table "lab_services"."lab" to "service_role";

grant trigger on table "lab_services"."lab" to "service_role";

grant truncate on table "lab_services"."lab" to "service_role";

grant update on table "lab_services"."lab" to "service_role";


  create policy "allow_all"
  on "lab_services"."computer"
  as permissive
  for all
  to anon, authenticated
using (true)
with check (true);



  create policy "allow_all"
  on "lab_services"."incident"
  as permissive
  for all
  to anon, authenticated
using (true)
with check (true);



  create policy "allow_all"
  on "lab_services"."lab"
  as permissive
  for all
  to anon, authenticated
using (true)
with check (true);



