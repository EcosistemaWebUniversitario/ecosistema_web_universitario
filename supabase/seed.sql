SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict TqZkmJDH0HpSn0EYW0d71UmyOnYXlucPPM64bgHt8mjkXnopOcuX1PoinFNfvED

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: faculties; Type: TABLE DATA; Schema: academico; Owner: postgres
--

INSERT INTO "academico"."faculties" ("id", "name", "created_at", "updated_at") VALUES
	(1, 'Facultad de Ciencias Económicas', '2026-04-29 01:14:01.805207+00', '2026-04-29 01:14:01.805207+00'),
	(2, 'Facultad de Ciencias Sociales y Humanísticas', '2026-04-29 01:14:01.805207+00', '2026-04-29 01:14:01.805207+00'),
	(3, 'Facultad de Cultura Física', '2026-04-29 01:14:01.805207+00', '2026-04-29 01:14:01.805207+00'),
	(4, 'Facultad de Ciencias de la Educación', '2026-04-29 01:14:01.805207+00', '2026-04-29 01:14:01.805207+00'),
	(5, 'Facultad de Ciencias Técnicas y Agropecuarias', '2026-04-29 01:14:01.805207+00', '2026-04-29 01:14:01.805207+00');


--
-- Data for Name: careers; Type: TABLE DATA; Schema: academico; Owner: postgres
--

INSERT INTO "academico"."careers" ("id", "name", "faculty_id", "created_at", "updated_at") VALUES
	(1, 'Licenciatura en Contabilidad y Finanzas', 1, '2026-04-29 01:14:01.805207+00', '2026-04-29 01:14:01.805207+00'),
	(2, 'Licenciatura en Economía', 1, '2026-04-29 01:14:01.805207+00', '2026-04-29 01:14:01.805207+00'),
	(3, 'Licenciatura en Educación Economía', 1, '2026-04-29 01:14:01.805207+00', '2026-04-29 01:14:01.805207+00'),
	(4, 'Licenciatura en Comunicación Social', 2, '2026-04-29 01:14:01.805207+00', '2026-04-29 01:14:01.805207+00'),
	(5, 'Licenciatura en Derecho', 2, '2026-04-29 01:14:01.805207+00', '2026-04-29 01:14:01.805207+00'),
	(6, 'Licenciatura en Lenguas Extranjeras', 2, '2026-04-29 01:14:01.805207+00', '2026-04-29 01:14:01.805207+00'),
	(7, 'Licenciatura en Cultura Física', 3, '2026-04-29 01:14:01.805207+00', '2026-04-29 01:14:01.805207+00'),
	(8, 'Licenciatura en Pedagogía-Psicología', 4, '2026-04-29 01:14:01.805207+00', '2026-04-29 01:14:01.805207+00'),
	(9, 'Licenciatura en Educación Primaria', 4, '2026-04-29 01:14:01.805207+00', '2026-04-29 01:14:01.805207+00'),
	(10, 'Licenciatura en Logopedia', 4, '2026-04-29 01:14:01.805207+00', '2026-04-29 01:14:01.805207+00'),
	(11, 'Ingeniería Informática', 5, '2026-04-29 01:14:01.805207+00', '2026-04-29 01:14:01.805207+00'),
	(12, 'Ingeniería Agrónoma', 5, '2026-04-29 01:14:01.805207+00', '2026-04-29 01:14:01.805207+00'),
	(13, 'Ingeniería Industrial', 5, '2026-04-29 01:14:01.805207+00', '2026-04-29 01:14:01.805207+00');


--
-- Data for Name: municipalities; Type: TABLE DATA; Schema: academico; Owner: postgres
--

INSERT INTO "academico"."municipalities" ("id", "name", "created_at", "updated_at") VALUES
	(1, 'Tunas', '2026-04-29 01:14:01.805207+00', '2026-04-29 01:14:01.805207+00'),
	(2, 'Manati', '2026-04-29 01:14:01.805207+00', '2026-04-29 01:14:01.805207+00'),
	(3, 'Puerto Padre', '2026-04-29 01:14:01.805207+00', '2026-04-29 01:14:01.805207+00'),
	(4, 'Majibacoa', '2026-04-29 01:14:01.805207+00', '2026-04-29 01:14:01.805207+00'),
	(5, 'Amancio', '2026-04-29 01:14:01.805207+00', '2026-04-29 01:14:01.805207+00'),
	(6, 'Menendez', '2026-04-29 01:14:01.805207+00', '2026-04-29 01:14:01.805207+00'),
	(7, 'Jobabo', '2026-04-29 01:14:01.805207+00', '2026-04-29 01:14:01.805207+00');


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', 'd4fde6a5-0b50-4feb-931e-41ddba69d921', 'authenticated', 'authenticated', 'empresa@email.com', '$2a$10$IW82ShSuWEdvrYCub4od4.QPjrpOtK/eXk5iMMFGAVfAfi3RdsoXC', '2026-04-16 18:24:55.260289+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "Empresa ABC", "account_type": "empresa", "email_verified": true}', NULL, '2026-04-16 18:24:55.222751+00', '2026-04-16 18:24:55.262043+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'c964641a-d79a-49fa-88cf-be2b4ea4e53d', 'authenticated', 'authenticated', 'admin@gmail.com', '$2a$10$yTuGYaQa5fMSEo/NSYg6q.nnfMpitMlr8k84YKeocv6zKQoLtlOym', '2026-04-23 03:15:07.415148+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-04-25 00:21:15.047609+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "admin", "email_verified": true}', NULL, '2026-04-23 03:15:07.39121+00', '2026-04-25 00:21:15.086949+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '48a9dcd2-5dce-41e6-a7d8-2f757106a9d2', 'authenticated', 'authenticated', 'test1@email.com', '$2a$10$7ae/6efWU5F4kFz7hnSFvOwJcwIJee46nowm/ALM0bqWp.TnG74My', '2026-04-16 18:25:22.795727+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-04-17 01:10:05.04277+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "Juan Pérez", "account_type": "estudiante", "email_verified": true}', NULL, '2026-04-16 18:25:22.790244+00', '2026-04-17 01:10:05.05169+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'c3d3af2d-4a19-4a2b-9983-40ea2382602a', 'authenticated', 'authenticated', 'estudiante2@demo.com', '$2a$10$M.DPoKrGDu6olPXW0bDnDueyVZJ3kWNQBtoU0sa3Ez32bQw1svFaS', '2026-04-21 02:39:53.483003+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "María García", "email_verified": true}', NULL, '2026-04-21 02:39:53.48005+00', '2026-04-21 02:39:53.483749+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'bf2f1bed-52d3-425f-848e-725fd3198343', 'authenticated', 'authenticated', 'admin@practicas.com', '$2a$10$RP5lDy55dTiRTz31hDrtGuea3FtrkETqKSj99noga6X9vjGs0EzMu', '2026-04-21 02:39:49.810659+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-05-03 01:04:43.99056+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "Admin Prácticas", "email_verified": true}', NULL, '2026-04-21 02:39:49.781525+00', '2026-05-03 01:04:44.008556+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'b65cbbe5-5ff5-4381-850a-5a85c027bf51', 'authenticated', 'authenticated', 'admin@prelocalizacion.com', '$2a$10$JlpbSotNaGrAU6B6w7q6t.0kGE8JLedCxM3yPN.aiA0EPCF/yQ5zW', '2026-05-03 01:03:04.316854+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-05-03 01:08:26.550296+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "Admin Prelocalización", "email_verified": true}', NULL, '2026-05-03 01:03:04.290484+00', '2026-05-03 01:08:26.56559+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'b33f9da8-3b21-429f-9087-00d1ba2a879e', 'authenticated', 'authenticated', '4estudiante1@demo.com', '$2a$10$2DvShYfP9A311qWim3roteN58pq90VZDbe/k1zIZEM1Xlx2A/D7Mu', '2026-05-03 00:28:31.166005+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-05-03 01:20:45.560525+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "Juan Pérez", "account_type": "estudiante", "email_verified": true}', NULL, '2026-05-03 00:28:31.135864+00', '2026-05-03 01:20:45.575969+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'a3cd8efe-9625-4530-bfe2-3a448502a80b', 'authenticated', 'authenticated', 'estudiante1@demo.com', '$2a$10$uyU9WdT6klcj0iV1020twOBTSUvYhy26JUmk/5gAl6viooV4jpQYC', '2026-04-21 02:39:51.719352+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-05-09 01:54:27.490677+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "Rafael Cruz", "email_verified": true}', NULL, '2026-04-21 02:39:51.710981+00', '2026-05-09 01:54:27.504434+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'c592c020-ee98-43ab-a149-b967f3a25550', 'authenticated', 'authenticated', 'estudiante@gmail.com', '$2a$10$cj.nD6E07I5maVKnZXlGI.7Rt2Ctu7KJw6H9TP9szFutDHo2vXxIG', '2026-04-23 22:22:10.279403+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-04-23 22:22:34.783697+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "estudiante", "email_verified": true}', NULL, '2026-04-23 22:22:10.238316+00', '2026-04-23 22:22:34.788257+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '1851b445-e1a0-4d32-81ac-e29326a54484', 'authenticated', 'authenticated', 'luisenriquepupo16@gmail.com', '$2a$10$uPpju8SEIa2MFZ1XF6DgYu1yT5sVTVyJplEoedfK1qV5vUupN1Ppi', '2026-04-23 18:48:18.380819+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-04-23 18:48:18.339572+00', '2026-04-23 18:48:18.381915+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', 'authenticated', 'authenticated', 'empresa@demo.com', '$2a$10$ACkn0lbch1oTPRyZ2BzK7uWBOhU3cHirbe7LBFBLE.PurwxEb93bC', '2026-04-21 02:39:50.745157+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-05-09 03:26:53.999656+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "Empresa Demo", "email_verified": true}', NULL, '2026-04-21 02:39:50.739921+00', '2026-05-09 03:26:54.0695+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '67bcc9a2-5087-4f85-90d2-089e05c56d04', NULL, 'authenticated', 'tecnico_prueba@universidad.com', '$2a$06$1aGTKqWfq9ag0rd6GxM49OrHNeCsfcmLgmyMgVHZL9S6fx5SvCy5.', '2026-05-16 00:16:24.468662+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "Candidato Tecnico"}', NULL, '2026-05-16 00:16:24.468662+00', '2026-05-16 00:16:24.468662+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '2c9bed1b-8311-43b3-9f60-ce1827371711', 'authenticated', 'authenticated', 'yumenoao05@gmail.com', '$2a$06$hsDH74dvfajYjvTMMdZouOzpMcbEn4xvqJFfwMcL4wppqwbRcqnze', '2026-05-16 00:44:19.744942+00', NULL, '', NULL, '', NULL, '', NULL, NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"role": "lab_admin", "full_name": "Luis Enrique Pupo"}', false, '2026-05-16 00:44:19.744942+00', '2026-05-16 00:44:19.744942+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'b33c0d3f-4fa4-4a3d-b403-61d142ff77c3', 'authenticated', 'authenticated', 'ana@gmail.com', '$2a$10$u2g9aC3gCI.fbhzI1UA0G.Y0QIVRy7qoOO7LFpGDTuf.bn7rhzEoa', '2026-04-24 02:36:32.903474+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-04-24 02:36:56.718375+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "ana", "email_verified": true}', NULL, '2026-04-24 02:36:32.891587+00', '2026-04-24 02:36:56.72124+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '67c250c7-8a51-4fb1-a7d0-7420c7b18bf9', 'authenticated', 'authenticated', 'user@gmail.com', '$2a$10$qaBS5zYc0wVLjxgeatX1beJIwN.JNXBmpCMeCoaGH9y4T/E6nnG6K', '2026-04-23 03:24:35.000955+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-04-24 06:07:48.35626+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "user", "email_verified": true}', NULL, '2026-04-23 03:24:34.976556+00', '2026-04-24 06:07:48.365127+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."roles" ("id", "name", "description", "created_at") VALUES
	(1, 'super_admin', 'Super administrador del ecosistema', '2026-04-16 15:36:16.266756+00'),
	(2, 'admin_practicas', 'Administrador del servicio de prácticas', '2026-04-16 15:36:16.266756+00'),
	(3, 'admin_prelocalizacion', 'Administrador del servicio de prelocalización laboral', '2026-04-16 15:36:16.266756+00'),
	(4, 'estudiante', 'Usuario estudiante', '2026-04-16 15:36:16.266756+00'),
	(5, 'empresa', 'Entidad externa vinculada a prácticas y prelocalización', '2026-04-16 15:36:16.266756+00'),
	(11, 'admin_horarios', 'Administrador del sistema de horarios', '2026-04-23 02:16:39.471146+00'),
	(18, 'admin_votaciones', 'Administrador del servicio de votaciones', '2026-04-29 01:07:49.83806+00'),
	(19, 'admin_notas', 'Administrador del servicio de notas', '2026-04-29 01:07:49.83806+00'),
	(20, 'profesor', 'Profesor del ecosistema', '2026-04-29 01:07:49.83806+00'),
	(21, 'lab_admin', 'Administrador del servicio de laboratorio', '2026-04-29 01:07:49.83806+00'),
	(22, 'lab_technician', 'Técnico de laboratorio', '2026-04-29 01:07:49.83806+00');


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."profiles" ("id", "full_name", "role_id", "created_at", "updated_at", "account_type") VALUES
	('d4fde6a5-0b50-4feb-931e-41ddba69d921', 'Empresa ABC', 5, '2026-04-16 18:24:55.222352+00', '2026-04-16 18:24:55.222352+00', 'empresa'),
	('48a9dcd2-5dce-41e6-a7d8-2f757106a9d2', 'Juan Pérez', 4, '2026-04-16 18:25:22.789937+00', '2026-04-16 18:25:22.789937+00', 'estudiante'),
	('c964641a-d79a-49fa-88cf-be2b4ea4e53d', 'admin', 11, '2026-04-23 03:15:07.390823+00', '2026-04-23 03:15:07.390823+00', 'estudiante'),
	('67c250c7-8a51-4fb1-a7d0-7420c7b18bf9', 'user', 4, '2026-04-23 03:24:34.976089+00', '2026-04-23 03:24:34.976089+00', 'estudiante'),
	('1851b445-e1a0-4d32-81ac-e29326a54484', '', 4, '2026-04-23 18:48:18.339223+00', '2026-04-23 18:48:18.339223+00', 'estudiante'),
	('c592c020-ee98-43ab-a149-b967f3a25550', 'estudiante', 4, '2026-04-23 22:22:10.237356+00', '2026-04-23 22:22:10.237356+00', 'estudiante'),
	('b33c0d3f-4fa4-4a3d-b403-61d142ff77c3', 'ana', 4, '2026-04-24 02:36:32.891255+00', '2026-04-24 02:36:32.891255+00', 'estudiante'),
	('b33f9da8-3b21-429f-9087-00d1ba2a879e', 'Juan Pérez', 4, '2026-05-03 00:28:31.134059+00', '2026-05-03 00:28:31.134059+00', 'estudiante'),
	('bf2f1bed-52d3-425f-848e-725fd3198343', 'Admin Prácticas', 2, '2026-04-21 02:39:49.780409+00', '2026-04-21 02:39:49.780409+00', 'admin'),
	('b65cbbe5-5ff5-4381-850a-5a85c027bf51', 'Admin Prelocalización', 3, '2026-05-03 01:03:04.290055+00', '2026-05-03 01:03:04.290055+00', 'admin'),
	('2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', 'Empresa Demo', 5, '2026-04-21 02:39:50.733968+00', '2026-04-21 02:39:50.733968+00', 'empresa'),
	('a3cd8efe-9625-4530-bfe2-3a448502a80b', 'Rafael Cruz', 4, '2026-04-21 02:39:51.710011+00', '2026-04-21 02:39:51.710011+00', 'estudiante'),
	('c3d3af2d-4a19-4a2b-9983-40ea2382602a', 'María García', 4, '2026-04-21 02:39:53.479698+00', '2026-04-21 02:39:53.479698+00', 'estudiante'),
	('67bcc9a2-5087-4f85-90d2-089e05c56d04', 'Candidato Tecnico', 4, '2026-05-16 00:16:24.468662+00', '2026-05-16 00:16:24.468662+00', 'estudiante'),
	('2c9bed1b-8311-43b3-9f60-ce1827371711', 'Luis Enrique Pupo', 21, '2026-05-16 00:44:19.744942+00', '2026-05-16 00:44:19.744942+00', 'admin');


--
-- Data for Name: professors; Type: TABLE DATA; Schema: academico; Owner: postgres
--



--
-- Data for Name: students; Type: TABLE DATA; Schema: academico; Owner: postgres
--

INSERT INTO "academico"."students" ("id", "profile_id", "names", "surnames", "ci", "academic_year", "career_id", "municipality_id", "study_mode", "created_at", "updated_at") VALUES
	(1, 'a3cd8efe-9625-4530-bfe2-3a448502a80b', 'Rafael', 'Cruz', '12345678901', 3, 1, 1, 'REGULAR_DIURNO', '2026-05-01 02:34:11.413102+00', '2026-05-01 02:34:11.413102+00'),
	(2, 'c3d3af2d-4a19-4a2b-9983-40ea2382602a', 'María', 'García', '12345678902', 3, 1, 1, 'REGULAR_DIURNO', '2026-05-01 02:34:11.413102+00', '2026-05-01 02:34:11.413102+00'),
	(3, 'b33f9da8-3b21-429f-9087-00d1ba2a879e', 'Juan', 'Pérez', '06010112345', 4, 1, 1, 'REGULAR_DIURNO', '2026-05-03 01:22:27.586+00', '2026-05-03 01:22:27.586+00');


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('d4fde6a5-0b50-4feb-931e-41ddba69d921', 'd4fde6a5-0b50-4feb-931e-41ddba69d921', '{"sub": "d4fde6a5-0b50-4feb-931e-41ddba69d921", "email": "empresa@email.com", "email_verified": false, "phone_verified": false}', 'email', '2026-04-16 18:24:55.250859+00', '2026-04-16 18:24:55.250956+00', '2026-04-16 18:24:55.250956+00', '88abc9ea-0961-45e2-b0aa-daa3e663d36e'),
	('48a9dcd2-5dce-41e6-a7d8-2f757106a9d2', '48a9dcd2-5dce-41e6-a7d8-2f757106a9d2', '{"sub": "48a9dcd2-5dce-41e6-a7d8-2f757106a9d2", "email": "test1@email.com", "email_verified": false, "phone_verified": false}', 'email', '2026-04-16 18:25:22.794107+00', '2026-04-16 18:25:22.794159+00', '2026-04-16 18:25:22.794159+00', '5a504748-ad32-4bc7-b7fd-06fe13b68a22'),
	('bf2f1bed-52d3-425f-848e-725fd3198343', 'bf2f1bed-52d3-425f-848e-725fd3198343', '{"sub": "bf2f1bed-52d3-425f-848e-725fd3198343", "email": "admin@practicas.com", "email_verified": false, "phone_verified": false}', 'email', '2026-04-21 02:39:49.804937+00', '2026-04-21 02:39:49.804993+00', '2026-04-21 02:39:49.804993+00', '6b674127-028c-4395-9c63-dd8b02050bb8'),
	('2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', '{"sub": "2a352e89-1ccf-47e0-bd9b-75069e0d0cf9", "email": "empresa@demo.com", "email_verified": false, "phone_verified": false}', 'email', '2026-04-21 02:39:50.742154+00', '2026-04-21 02:39:50.742212+00', '2026-04-21 02:39:50.742212+00', 'e815f94d-f10d-4688-9226-cf953e0bbeb4'),
	('a3cd8efe-9625-4530-bfe2-3a448502a80b', 'a3cd8efe-9625-4530-bfe2-3a448502a80b', '{"sub": "a3cd8efe-9625-4530-bfe2-3a448502a80b", "email": "estudiante1@demo.com", "email_verified": false, "phone_verified": false}', 'email', '2026-04-21 02:39:51.717837+00', '2026-04-21 02:39:51.717892+00', '2026-04-21 02:39:51.717892+00', '6c1b9062-5d7d-482e-9180-bbadc6dea5f1'),
	('c3d3af2d-4a19-4a2b-9983-40ea2382602a', 'c3d3af2d-4a19-4a2b-9983-40ea2382602a', '{"sub": "c3d3af2d-4a19-4a2b-9983-40ea2382602a", "email": "estudiante2@demo.com", "email_verified": false, "phone_verified": false}', 'email', '2026-04-21 02:39:53.481602+00', '2026-04-21 02:39:53.481647+00', '2026-04-21 02:39:53.481647+00', 'f629ddcd-7716-4769-9f4a-e50b8cb67f86'),
	('c964641a-d79a-49fa-88cf-be2b4ea4e53d', 'c964641a-d79a-49fa-88cf-be2b4ea4e53d', '{"sub": "c964641a-d79a-49fa-88cf-be2b4ea4e53d", "email": "admin@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2026-04-23 03:15:07.41181+00', '2026-04-23 03:15:07.411865+00', '2026-04-23 03:15:07.411865+00', '4a07f7af-8f32-42e2-9f92-24de87c31bf1'),
	('67c250c7-8a51-4fb1-a7d0-7420c7b18bf9', '67c250c7-8a51-4fb1-a7d0-7420c7b18bf9', '{"sub": "67c250c7-8a51-4fb1-a7d0-7420c7b18bf9", "email": "user@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2026-04-23 03:24:34.995354+00', '2026-04-23 03:24:34.995415+00', '2026-04-23 03:24:34.995415+00', '899879f9-c409-40ed-a832-7477e659a6cf'),
	('1851b445-e1a0-4d32-81ac-e29326a54484', '1851b445-e1a0-4d32-81ac-e29326a54484', '{"sub": "1851b445-e1a0-4d32-81ac-e29326a54484", "email": "luisenriquepupo16@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2026-04-23 18:48:18.370879+00', '2026-04-23 18:48:18.370953+00', '2026-04-23 18:48:18.370953+00', '8f9a1677-f94d-4d8a-9e00-2b45eb30d611'),
	('c592c020-ee98-43ab-a149-b967f3a25550', 'c592c020-ee98-43ab-a149-b967f3a25550', '{"sub": "c592c020-ee98-43ab-a149-b967f3a25550", "email": "estudiante@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2026-04-23 22:22:10.274598+00', '2026-04-23 22:22:10.27466+00', '2026-04-23 22:22:10.27466+00', '834822cc-2146-44d9-8310-6264d40eb7ac'),
	('b33c0d3f-4fa4-4a3d-b403-61d142ff77c3', 'b33c0d3f-4fa4-4a3d-b403-61d142ff77c3', '{"sub": "b33c0d3f-4fa4-4a3d-b403-61d142ff77c3", "email": "ana@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2026-04-24 02:36:32.900904+00', '2026-04-24 02:36:32.900963+00', '2026-04-24 02:36:32.900963+00', '6723bbaa-b00f-4567-a0aa-80129ce28620'),
	('b33f9da8-3b21-429f-9087-00d1ba2a879e', 'b33f9da8-3b21-429f-9087-00d1ba2a879e', '{"sub": "b33f9da8-3b21-429f-9087-00d1ba2a879e", "email": "4estudiante1@demo.com", "email_verified": false, "phone_verified": false}', 'email', '2026-05-03 00:28:31.160003+00', '2026-05-03 00:28:31.160064+00', '2026-05-03 00:28:31.160064+00', '02ce2ca8-0c1e-46c2-8e13-e660d463ab33'),
	('b65cbbe5-5ff5-4381-850a-5a85c027bf51', 'b65cbbe5-5ff5-4381-850a-5a85c027bf51', '{"sub": "b65cbbe5-5ff5-4381-850a-5a85c027bf51", "email": "admin@prelocalizacion.com", "email_verified": false, "phone_verified": false}', 'email', '2026-05-03 01:03:04.311544+00', '2026-05-03 01:03:04.311615+00', '2026-05-03 01:03:04.311615+00', '5164967c-1861-4bff-b18d-c1ef35c96050');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter", "scopes") VALUES
	('e4c7af6e-93f6-4a02-9832-90388655d822', '48a9dcd2-5dce-41e6-a7d8-2f757106a9d2', '2026-04-17 00:33:36.523753+00', '2026-04-17 00:33:36.523753+00', NULL, 'aal1', NULL, NULL, 'node', '152.207.213.97', NULL, NULL, NULL, NULL, NULL),
	('777a65f0-2bd0-4715-99a4-47663a846218', '48a9dcd2-5dce-41e6-a7d8-2f757106a9d2', '2026-04-17 00:55:06.970012+00', '2026-04-17 00:55:06.970012+00', NULL, 'aal1', NULL, NULL, 'node', '152.207.213.97', NULL, NULL, NULL, NULL, NULL),
	('abe43117-7bd3-4380-890e-8dd8da86e8d6', '48a9dcd2-5dce-41e6-a7d8-2f757106a9d2', '2026-04-17 01:10:05.042915+00', '2026-04-17 01:10:05.042915+00', NULL, 'aal1', NULL, NULL, 'node', '152.207.213.97', NULL, NULL, NULL, NULL, NULL),
	('c59a6bcd-851d-4ad3-84a2-bd7ee5dd763d', 'a3cd8efe-9625-4530-bfe2-3a448502a80b', '2026-04-21 02:50:51.253701+00', '2026-04-21 02:50:51.253701+00', NULL, 'aal1', NULL, NULL, 'node', '152.207.213.164', NULL, NULL, NULL, NULL, NULL),
	('eee67a37-a9ae-4b15-9f8b-4073c54b3372', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', '2026-04-23 00:30:32.609404+00', '2026-04-23 00:30:32.609404+00', NULL, 'aal1', NULL, NULL, 'node', '152.207.213.115', NULL, NULL, NULL, NULL, NULL),
	('7d9eeb78-7870-4067-a457-3639b2d87287', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', '2026-04-23 00:47:47.807072+00', '2026-04-23 00:47:47.807072+00', NULL, 'aal1', NULL, NULL, 'node', '152.207.213.115', NULL, NULL, NULL, NULL, NULL),
	('659bf5b4-0e41-4591-87f9-79f032788c74', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', '2026-04-23 01:00:55.201015+00', '2026-04-23 01:00:55.201015+00', NULL, 'aal1', NULL, NULL, 'node', '152.207.213.115', NULL, NULL, NULL, NULL, NULL),
	('699dc278-359a-4aea-8679-27e4067601f1', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', '2026-04-23 01:43:33.742143+00', '2026-04-23 01:43:33.742143+00', NULL, 'aal1', NULL, NULL, 'node', '152.207.213.115', NULL, NULL, NULL, NULL, NULL),
	('8eaf4122-a7ab-41d0-ad07-6e60d6d00553', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', '2026-04-23 02:02:08.27184+00', '2026-04-23 02:02:08.27184+00', NULL, 'aal1', NULL, NULL, 'node', '152.207.213.115', NULL, NULL, NULL, NULL, NULL),
	('1a61b39f-20db-4827-83bc-ae3d80d04e1a', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', '2026-04-23 02:13:30.334656+00', '2026-04-23 02:13:30.334656+00', NULL, 'aal1', NULL, NULL, 'node', '152.207.213.115', NULL, NULL, NULL, NULL, NULL),
	('cc268766-5e61-424b-bc0c-0ada1e024e5c', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', '2026-04-23 02:21:10.104613+00', '2026-04-23 02:21:10.104613+00', NULL, 'aal1', NULL, NULL, 'node', '152.207.213.115', NULL, NULL, NULL, NULL, NULL),
	('dd3e8138-6734-437c-ac58-936a2f1cc339', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', '2026-04-23 02:23:09.472441+00', '2026-04-23 02:23:09.472441+00', NULL, 'aal1', NULL, NULL, 'node', '152.207.213.115', NULL, NULL, NULL, NULL, NULL),
	('ffb67c9f-8b05-49c8-9c02-a74751e9bdb9', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', '2026-04-23 02:26:50.28598+00', '2026-04-23 02:26:50.28598+00', NULL, 'aal1', NULL, NULL, 'node', '152.207.213.115', NULL, NULL, NULL, NULL, NULL),
	('e77c7d9a-3bae-4503-9d44-8cc0bd285c79', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', '2026-04-23 02:31:40.541451+00', '2026-04-23 02:31:40.541451+00', NULL, 'aal1', NULL, NULL, 'node', '152.207.213.115', NULL, NULL, NULL, NULL, NULL),
	('85e7c9cc-fd52-40b3-99fd-533d6deec6ca', 'a3cd8efe-9625-4530-bfe2-3a448502a80b', '2026-04-23 02:34:31.495888+00', '2026-04-23 02:34:31.495888+00', NULL, 'aal1', NULL, NULL, 'node', '155.117.189.30', NULL, NULL, NULL, NULL, NULL),
	('cdae33dc-ec9f-4bf4-8248-df435fbeb36f', 'a3cd8efe-9625-4530-bfe2-3a448502a80b', '2026-04-23 02:43:56.539916+00', '2026-04-23 02:43:56.539916+00', NULL, 'aal1', NULL, NULL, 'node', '152.207.213.115', NULL, NULL, NULL, NULL, NULL),
	('32e9c7e3-f105-46ad-9831-a2ef1a191b5d', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', '2026-04-23 02:44:45.906531+00', '2026-04-23 02:44:45.906531+00', NULL, 'aal1', NULL, NULL, 'node', '152.207.213.115', NULL, NULL, NULL, NULL, NULL),
	('ce7b6515-c80c-499b-90df-a3dc4d2ee7b7', 'bf2f1bed-52d3-425f-848e-725fd3198343', '2026-04-23 02:51:28.387643+00', '2026-04-23 02:51:28.387643+00', NULL, 'aal1', NULL, NULL, 'node', '152.207.213.115', NULL, NULL, NULL, NULL, NULL),
	('415c5c8b-953e-49fa-a15a-5f90e5a20ad8', 'c964641a-d79a-49fa-88cf-be2b4ea4e53d', '2026-04-23 03:18:27.871004+00', '2026-04-23 03:18:27.871004+00', NULL, 'aal1', NULL, NULL, 'node', '79.127.147.91', NULL, NULL, NULL, NULL, NULL),
	('2e2ea7ac-6117-4397-8b90-2961d313fb19', 'c964641a-d79a-49fa-88cf-be2b4ea4e53d', '2026-04-23 03:23:34.960042+00', '2026-04-23 03:23:34.960042+00', NULL, 'aal1', NULL, NULL, 'node', '79.127.147.91', NULL, NULL, NULL, NULL, NULL),
	('96332d6b-7637-4633-9b88-48e4ff8008ef', '67c250c7-8a51-4fb1-a7d0-7420c7b18bf9', '2026-04-23 03:25:01.548796+00', '2026-04-23 03:25:01.548796+00', NULL, 'aal1', NULL, NULL, 'node', '79.127.147.91', NULL, NULL, NULL, NULL, NULL),
	('0b19176e-f306-4244-bfba-a87505ae907a', 'c964641a-d79a-49fa-88cf-be2b4ea4e53d', '2026-04-23 03:35:00.310102+00', '2026-04-23 03:35:00.310102+00', NULL, 'aal1', NULL, NULL, 'node', '79.127.147.91', NULL, NULL, NULL, NULL, NULL),
	('b698f94a-dc72-4721-bd18-d104ffc8c1b4', '67c250c7-8a51-4fb1-a7d0-7420c7b18bf9', '2026-04-23 03:50:49.763856+00', '2026-04-23 03:50:49.763856+00', NULL, 'aal1', NULL, NULL, 'node', '79.127.147.91', NULL, NULL, NULL, NULL, NULL),
	('4513f36d-1363-4835-ba21-2aed1c9081b9', 'c964641a-d79a-49fa-88cf-be2b4ea4e53d', '2026-04-23 21:49:09.519095+00', '2026-04-23 21:49:09.519095+00', NULL, 'aal1', NULL, NULL, 'node', '159.26.100.219', NULL, NULL, NULL, NULL, NULL),
	('1dd8b130-e69b-472a-b869-fcf7cc0646e3', '67c250c7-8a51-4fb1-a7d0-7420c7b18bf9', '2026-04-23 22:21:07.413007+00', '2026-04-23 22:21:07.413007+00', NULL, 'aal1', NULL, NULL, 'node', '159.26.100.219', NULL, NULL, NULL, NULL, NULL),
	('24d2a8a2-1baf-4c62-8f3b-753ad885243e', 'c964641a-d79a-49fa-88cf-be2b4ea4e53d', '2026-04-23 22:21:38.073649+00', '2026-04-23 22:21:38.073649+00', NULL, 'aal1', NULL, NULL, 'node', '159.26.100.219', NULL, NULL, NULL, NULL, NULL),
	('167e5df8-442e-40cf-8de7-4dfd5fdb1c06', 'c592c020-ee98-43ab-a149-b967f3a25550', '2026-04-23 22:22:34.783792+00', '2026-04-23 22:22:34.783792+00', NULL, 'aal1', NULL, NULL, 'node', '159.26.100.219', NULL, NULL, NULL, NULL, NULL),
	('9aac439a-8764-4fbc-b4d2-fcd917cb8c2b', 'c964641a-d79a-49fa-88cf-be2b4ea4e53d', '2026-04-24 02:33:23.193263+00', '2026-04-24 02:33:23.193263+00', NULL, 'aal1', NULL, NULL, 'node', '159.26.100.219', NULL, NULL, NULL, NULL, NULL),
	('eaeb4aa6-8b30-4a62-9ff0-9796744546f4', '67c250c7-8a51-4fb1-a7d0-7420c7b18bf9', '2026-04-24 02:33:51.416559+00', '2026-04-24 02:33:51.416559+00', NULL, 'aal1', NULL, NULL, 'node', '159.26.100.219', NULL, NULL, NULL, NULL, NULL),
	('3dd91012-3aa2-458d-a1a6-86b71aeb7752', 'c964641a-d79a-49fa-88cf-be2b4ea4e53d', '2026-04-24 02:36:05.014968+00', '2026-04-24 02:36:05.014968+00', NULL, 'aal1', NULL, NULL, 'node', '159.26.100.219', NULL, NULL, NULL, NULL, NULL),
	('f8370a4a-48ec-4b77-9bd5-c8fbd3c34c8e', 'b33c0d3f-4fa4-4a3d-b403-61d142ff77c3', '2026-04-24 02:36:56.718979+00', '2026-04-24 02:36:56.718979+00', NULL, 'aal1', NULL, NULL, 'node', '159.26.100.219', NULL, NULL, NULL, NULL, NULL),
	('2d9d62bf-70d1-4ad4-bb88-dc8c70959216', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', '2026-05-09 01:29:54.83728+00', '2026-05-09 01:29:54.83728+00', NULL, 'aal1', NULL, NULL, 'node', '152.207.213.149', NULL, NULL, NULL, NULL, NULL),
	('92f6c442-264d-449b-8b3a-070bdb349895', 'a3cd8efe-9625-4530-bfe2-3a448502a80b', '2026-05-09 01:54:27.493052+00', '2026-05-09 01:54:27.493052+00', NULL, 'aal1', NULL, NULL, 'node', '152.207.213.149', NULL, NULL, NULL, NULL, NULL),
	('3048a2c0-f613-48e9-a776-49535d5eb5e7', 'c964641a-d79a-49fa-88cf-be2b4ea4e53d', '2026-04-24 02:44:42.355973+00', '2026-04-24 05:37:25.56033+00', NULL, 'aal1', NULL, '2026-04-24 05:37:25.560217', 'node', '159.26.100.219', NULL, NULL, NULL, NULL, NULL),
	('55849ed8-d2da-4ef2-981e-3af24eef9815', 'c964641a-d79a-49fa-88cf-be2b4ea4e53d', '2026-04-24 06:04:11.153693+00', '2026-04-24 06:04:11.153693+00', NULL, 'aal1', NULL, NULL, 'node', '159.26.100.219', NULL, NULL, NULL, NULL, NULL),
	('ee599a1f-0336-4161-8412-3001ef94cc86', 'c964641a-d79a-49fa-88cf-be2b4ea4e53d', '2026-04-24 06:05:48.153547+00', '2026-04-24 06:05:48.153547+00', NULL, 'aal1', NULL, NULL, 'node', '159.26.100.219', NULL, NULL, NULL, NULL, NULL),
	('31015a9a-bb69-4652-9bdb-e5b605a59cd4', '67c250c7-8a51-4fb1-a7d0-7420c7b18bf9', '2026-04-24 06:07:48.356364+00', '2026-04-24 06:07:48.356364+00', NULL, 'aal1', NULL, NULL, 'node', '159.26.100.219', NULL, NULL, NULL, NULL, NULL),
	('c8e298d0-76c7-4a6e-b0d7-031bb9b803df', 'c964641a-d79a-49fa-88cf-be2b4ea4e53d', '2026-04-24 06:08:42.030219+00', '2026-04-24 06:08:42.030219+00', NULL, 'aal1', NULL, NULL, 'node', '159.26.100.219', NULL, NULL, NULL, NULL, NULL),
	('9b812bab-1a29-4229-964b-c3fccff81004', 'c964641a-d79a-49fa-88cf-be2b4ea4e53d', '2026-04-24 06:11:36.32884+00', '2026-04-24 06:11:36.32884+00', NULL, 'aal1', NULL, NULL, 'node', '159.26.100.219', NULL, NULL, NULL, NULL, NULL),
	('0cea5d7d-4b66-43fe-bdf9-7a7625e9419b', 'c964641a-d79a-49fa-88cf-be2b4ea4e53d', '2026-04-24 12:33:45.049078+00', '2026-04-24 12:33:45.049078+00', NULL, 'aal1', NULL, NULL, 'node', '146.70.147.101', NULL, NULL, NULL, NULL, NULL),
	('fc63de88-8e0f-48b6-b635-a20f06c7667b', 'c964641a-d79a-49fa-88cf-be2b4ea4e53d', '2026-04-24 17:51:50.012197+00', '2026-04-24 17:51:50.012197+00', NULL, 'aal1', NULL, NULL, 'node', '159.26.100.220', NULL, NULL, NULL, NULL, NULL),
	('e8df5ca1-1685-4fd1-95bd-443fb30eefda', 'c964641a-d79a-49fa-88cf-be2b4ea4e53d', '2026-04-25 00:21:15.047737+00', '2026-04-25 00:21:15.047737+00', NULL, 'aal1', NULL, NULL, 'node', '95.173.217.70', NULL, NULL, NULL, NULL, NULL),
	('e7fbf6cb-672c-4140-8f10-85490114e08a', 'bf2f1bed-52d3-425f-848e-725fd3198343', '2026-05-01 01:48:13.669445+00', '2026-05-01 01:48:13.669445+00', NULL, 'aal1', NULL, NULL, 'node', '152.207.213.136', NULL, NULL, NULL, NULL, NULL),
	('22ebab62-6968-4a9e-9d76-3d8d83484ea1', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', '2026-05-01 01:48:30.892144+00', '2026-05-01 01:48:30.892144+00', NULL, 'aal1', NULL, NULL, 'node', '152.207.213.136', NULL, NULL, NULL, NULL, NULL),
	('cf28dda7-88a6-4743-8aac-a11778ef13eb', 'a3cd8efe-9625-4530-bfe2-3a448502a80b', '2026-05-01 01:48:39.717889+00', '2026-05-01 01:48:39.717889+00', NULL, 'aal1', NULL, NULL, 'node', '152.207.213.136', NULL, NULL, NULL, NULL, NULL),
	('6ebcfdd1-416c-408a-8f89-9cb60247b83f', 'bf2f1bed-52d3-425f-848e-725fd3198343', '2026-05-01 01:52:58.888313+00', '2026-05-01 01:52:58.888313+00', NULL, 'aal1', NULL, NULL, 'node', '152.207.213.136', NULL, NULL, NULL, NULL, NULL),
	('9ef8af0b-2aa3-420c-800c-a8630775a767', 'bf2f1bed-52d3-425f-848e-725fd3198343', '2026-05-01 02:08:50.638944+00', '2026-05-01 02:08:50.638944+00', NULL, 'aal1', NULL, NULL, 'node', '152.207.213.136', NULL, NULL, NULL, NULL, NULL),
	('3178bbdf-e8d4-425e-a131-04d38c5aa7a0', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', '2026-05-01 02:11:49.317359+00', '2026-05-01 02:11:49.317359+00', NULL, 'aal1', NULL, NULL, 'node', '152.207.213.136', NULL, NULL, NULL, NULL, NULL),
	('ce76f490-cf91-4aab-ad6c-e651aa14fcbe', 'a3cd8efe-9625-4530-bfe2-3a448502a80b', '2026-05-01 02:15:13.640681+00', '2026-05-01 02:15:13.640681+00', NULL, 'aal1', NULL, NULL, 'node', '152.207.213.136', NULL, NULL, NULL, NULL, NULL),
	('1ddbac87-1554-434b-aaaf-adc3faace058', 'bf2f1bed-52d3-425f-848e-725fd3198343', '2026-05-01 04:10:56.997209+00', '2026-05-01 04:10:56.997209+00', NULL, 'aal1', NULL, NULL, 'node', '152.207.213.136', NULL, NULL, NULL, NULL, NULL),
	('8d787549-2136-4e4e-bd90-4e24cb219169', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', '2026-05-01 04:11:02.696028+00', '2026-05-01 04:11:02.696028+00', NULL, 'aal1', NULL, NULL, 'node', '152.207.213.136', NULL, NULL, NULL, NULL, NULL),
	('4b434841-3b3f-45b2-a7c4-0a775eaa83cc', 'a3cd8efe-9625-4530-bfe2-3a448502a80b', '2026-05-01 04:11:06.311188+00', '2026-05-01 04:11:06.311188+00', NULL, 'aal1', NULL, NULL, 'node', '152.207.213.136', NULL, NULL, NULL, NULL, NULL),
	('baf45348-97f0-444d-8f4e-c4ad7fa583a9', 'a3cd8efe-9625-4530-bfe2-3a448502a80b', '2026-05-01 04:14:12.470802+00', '2026-05-01 04:14:12.470802+00', NULL, 'aal1', NULL, NULL, 'node', '152.207.213.136', NULL, NULL, NULL, NULL, NULL),
	('b3e122b7-d6fc-4f1b-893b-f5f6dbabe265', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', '2026-05-01 04:15:00.514707+00', '2026-05-01 04:15:00.514707+00', NULL, 'aal1', NULL, NULL, 'node', '152.207.213.136', NULL, NULL, NULL, NULL, NULL),
	('5d66dbf3-f3d8-4eda-8af3-d6e851c27e84', 'a3cd8efe-9625-4530-bfe2-3a448502a80b', '2026-05-01 04:16:03.539309+00', '2026-05-01 04:16:03.539309+00', NULL, 'aal1', NULL, NULL, 'node', '152.207.213.136', NULL, NULL, NULL, NULL, NULL),
	('6aed96b0-4eee-4d45-9b75-86c55155460b', 'b33f9da8-3b21-429f-9087-00d1ba2a879e', '2026-05-03 00:29:26.53155+00', '2026-05-03 00:29:26.53155+00', NULL, 'aal1', NULL, NULL, 'node', '152.207.213.71', NULL, NULL, NULL, NULL, NULL),
	('0677857e-60de-4135-b074-fccf511642f3', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', '2026-05-03 00:31:26.543636+00', '2026-05-03 00:31:26.543636+00', NULL, 'aal1', NULL, NULL, 'node', '152.207.213.71', NULL, NULL, NULL, NULL, NULL),
	('2ef2fb74-92e5-4083-ab48-934199c39a63', 'bf2f1bed-52d3-425f-848e-725fd3198343', '2026-05-03 01:04:43.991728+00', '2026-05-03 01:04:43.991728+00', NULL, 'aal1', NULL, NULL, 'node', '152.207.213.71', NULL, NULL, NULL, NULL, NULL),
	('7462be53-f8ed-4f95-9a76-75f1e51f9d29', 'b65cbbe5-5ff5-4381-850a-5a85c027bf51', '2026-05-03 01:08:26.551589+00', '2026-05-03 01:08:26.551589+00', NULL, 'aal1', NULL, NULL, 'node', '152.207.213.71', NULL, NULL, NULL, NULL, NULL),
	('8c7ced6b-9ab6-4948-b746-251d33a5aef6', 'b33f9da8-3b21-429f-9087-00d1ba2a879e', '2026-05-03 01:12:01.176817+00', '2026-05-03 01:12:01.176817+00', NULL, 'aal1', NULL, NULL, 'node', '152.207.213.71', NULL, NULL, NULL, NULL, NULL),
	('74eefd87-ae7f-486b-8bb6-ebb19ace4eee', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', '2026-05-03 01:18:13.054677+00', '2026-05-03 01:18:13.054677+00', NULL, 'aal1', NULL, NULL, 'node', '152.207.213.71', NULL, NULL, NULL, NULL, NULL),
	('48fa15bf-5076-426c-8eb5-2f3508df1cce', 'b33f9da8-3b21-429f-9087-00d1ba2a879e', '2026-05-03 01:20:45.563119+00', '2026-05-03 01:20:45.563119+00', NULL, 'aal1', NULL, NULL, 'node', '152.207.213.71', NULL, NULL, NULL, NULL, NULL),
	('f118e7e6-5326-496e-acee-ef2d4bf03f9b', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', '2026-05-03 01:26:09.136804+00', '2026-05-03 01:26:09.136804+00', NULL, 'aal1', NULL, NULL, 'node', '152.207.213.71', NULL, NULL, NULL, NULL, NULL),
	('d6228b89-a8ad-49b0-8125-434d2f870165', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', '2026-05-03 03:13:23.590911+00', '2026-05-03 03:13:23.590911+00', NULL, 'aal1', NULL, NULL, 'node', '155.117.189.81', NULL, NULL, NULL, NULL, NULL),
	('37d3dd68-0900-4864-91af-bd35cb987f0b', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', '2026-05-03 04:07:28.238111+00', '2026-05-03 04:07:28.238111+00', NULL, 'aal1', NULL, NULL, 'node', '152.207.213.71', NULL, NULL, NULL, NULL, NULL),
	('5432e706-7c04-4c22-b082-79026957e957', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', '2026-05-05 03:52:32.25856+00', '2026-05-05 03:52:32.25856+00', NULL, 'aal1', NULL, NULL, 'node', '152.207.213.111', NULL, NULL, NULL, NULL, NULL),
	('bbcbeb8e-3d64-45c1-811c-52ea71adf55e', 'a3cd8efe-9625-4530-bfe2-3a448502a80b', '2026-05-05 03:58:15.249371+00', '2026-05-05 03:58:15.249371+00', NULL, 'aal1', NULL, NULL, 'node', '152.207.213.111', NULL, NULL, NULL, NULL, NULL),
	('6155cad2-2459-4f36-8144-3b20bfc721f3', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', '2026-05-05 12:41:30.067182+00', '2026-05-05 14:01:27.993334+00', NULL, 'aal1', NULL, '2026-05-05 14:01:27.993201', 'node', '152.207.167.141', NULL, NULL, NULL, NULL, NULL),
	('0435e8eb-409d-46a2-a075-dc85955b5009', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', '2026-05-05 14:01:56.764338+00', '2026-05-05 14:01:56.764338+00', NULL, 'aal1', NULL, NULL, 'node', '152.207.111.141', NULL, NULL, NULL, NULL, NULL),
	('38cd12bc-65f2-46e8-b938-8c56ef0a1ffd', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', '2026-05-05 14:14:17.478069+00', '2026-05-05 14:14:17.478069+00', NULL, 'aal1', NULL, NULL, 'node', '152.207.111.141', NULL, NULL, NULL, NULL, NULL),
	('09528abf-95f4-4adc-8b4d-0de618fdd85f', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', '2026-05-09 01:03:37.985572+00', '2026-05-09 01:03:37.985572+00', NULL, 'aal1', NULL, NULL, 'node', '152.207.213.149', NULL, NULL, NULL, NULL, NULL),
	('12e86f66-e160-4858-9cd8-c0d252b15b23', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', '2026-05-09 02:34:01.916393+00', '2026-05-09 02:34:01.916393+00', NULL, 'aal1', NULL, NULL, 'node', '152.207.213.149', NULL, NULL, NULL, NULL, NULL),
	('0760033c-5adf-4e10-aa3d-3fcf4876c972', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', '2026-05-09 03:26:54.008723+00', '2026-05-09 03:26:54.008723+00', NULL, 'aal1', NULL, NULL, 'node', '155.117.189.71', NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('e4c7af6e-93f6-4a02-9832-90388655d822', '2026-04-17 00:33:36.558797+00', '2026-04-17 00:33:36.558797+00', 'password', 'a1c7741f-fad5-4009-b9a9-83da325d89d5'),
	('777a65f0-2bd0-4715-99a4-47663a846218', '2026-04-17 00:55:06.985963+00', '2026-04-17 00:55:06.985963+00', 'password', '0a227e2e-d180-4f48-a612-7a4f515ab114'),
	('abe43117-7bd3-4380-890e-8dd8da86e8d6', '2026-04-17 01:10:05.053933+00', '2026-04-17 01:10:05.053933+00', 'password', 'bcfdf6cb-36ee-410c-b028-f39a24a1ffb1'),
	('c59a6bcd-851d-4ad3-84a2-bd7ee5dd763d', '2026-04-21 02:50:51.293119+00', '2026-04-21 02:50:51.293119+00', 'password', 'c99670c6-74ff-464d-94dc-e424760bfc93'),
	('eee67a37-a9ae-4b15-9f8b-4073c54b3372', '2026-04-23 00:30:32.646262+00', '2026-04-23 00:30:32.646262+00', 'password', '38b2fced-94a5-43db-8438-e6c8a0facdf7'),
	('7d9eeb78-7870-4067-a457-3639b2d87287', '2026-04-23 00:47:47.827971+00', '2026-04-23 00:47:47.827971+00', 'password', 'e31bf514-3924-4757-82f9-b005a3c890d2'),
	('659bf5b4-0e41-4591-87f9-79f032788c74', '2026-04-23 01:00:55.215671+00', '2026-04-23 01:00:55.215671+00', 'password', '0f810fe3-58e6-4ba6-828e-ccb4eb824819'),
	('699dc278-359a-4aea-8679-27e4067601f1', '2026-04-23 01:43:33.768751+00', '2026-04-23 01:43:33.768751+00', 'password', 'b9d2963e-d92f-4b7f-8ffe-4b83ab80a095'),
	('8eaf4122-a7ab-41d0-ad07-6e60d6d00553', '2026-04-23 02:02:08.286842+00', '2026-04-23 02:02:08.286842+00', 'password', 'c51ff825-ff19-4f62-8ac9-3ad88bc3140a'),
	('1a61b39f-20db-4827-83bc-ae3d80d04e1a', '2026-04-23 02:13:30.356367+00', '2026-04-23 02:13:30.356367+00', 'password', 'b57e8967-90dd-47a8-899d-5d35a0cac36a'),
	('cc268766-5e61-424b-bc0c-0ada1e024e5c', '2026-04-23 02:21:10.125911+00', '2026-04-23 02:21:10.125911+00', 'password', '3c5592c2-f675-473d-b8ca-107932263047'),
	('dd3e8138-6734-437c-ac58-936a2f1cc339', '2026-04-23 02:23:09.485566+00', '2026-04-23 02:23:09.485566+00', 'password', '0d0ace72-20b0-49bb-ae04-b850ba45ae97'),
	('ffb67c9f-8b05-49c8-9c02-a74751e9bdb9', '2026-04-23 02:26:50.295932+00', '2026-04-23 02:26:50.295932+00', 'password', '99244087-bed9-4626-845f-c4167c59ef88'),
	('e77c7d9a-3bae-4503-9d44-8cc0bd285c79', '2026-04-23 02:31:40.566336+00', '2026-04-23 02:31:40.566336+00', 'password', '4150d17f-d4e0-415e-858e-d3263aa74124'),
	('85e7c9cc-fd52-40b3-99fd-533d6deec6ca', '2026-04-23 02:34:31.508126+00', '2026-04-23 02:34:31.508126+00', 'password', '3f8d151e-d709-4d4f-a285-2f0efd6e6cfd'),
	('cdae33dc-ec9f-4bf4-8248-df435fbeb36f', '2026-04-23 02:43:56.556746+00', '2026-04-23 02:43:56.556746+00', 'password', '79886ecb-9df0-47fe-a435-524bb01d07d5'),
	('32e9c7e3-f105-46ad-9831-a2ef1a191b5d', '2026-04-23 02:44:45.919124+00', '2026-04-23 02:44:45.919124+00', 'password', '48edacd1-d29b-4b07-a6e4-52adca6794f2'),
	('ce7b6515-c80c-499b-90df-a3dc4d2ee7b7', '2026-04-23 02:51:28.403163+00', '2026-04-23 02:51:28.403163+00', 'password', '1b54e19e-ad31-4ddb-80a7-d22f5a2145ef'),
	('415c5c8b-953e-49fa-a15a-5f90e5a20ad8', '2026-04-23 03:18:27.88906+00', '2026-04-23 03:18:27.88906+00', 'password', '3ef5c788-4c91-474c-be33-6e362c74fc1c'),
	('2e2ea7ac-6117-4397-8b90-2961d313fb19', '2026-04-23 03:23:35.097621+00', '2026-04-23 03:23:35.097621+00', 'password', 'f81ee027-99ee-4da8-9802-aacc90d14d05'),
	('96332d6b-7637-4633-9b88-48e4ff8008ef', '2026-04-23 03:25:01.552674+00', '2026-04-23 03:25:01.552674+00', 'password', '4de68b3c-658b-456a-b6df-0d4cc0145cd3'),
	('0b19176e-f306-4244-bfba-a87505ae907a', '2026-04-23 03:35:00.32652+00', '2026-04-23 03:35:00.32652+00', 'password', '93463b2a-a922-47de-a822-280b32e72539'),
	('b698f94a-dc72-4721-bd18-d104ffc8c1b4', '2026-04-23 03:50:49.777142+00', '2026-04-23 03:50:49.777142+00', 'password', 'fa6540d8-3930-435d-a8f1-01d28d8b574d'),
	('4513f36d-1363-4835-ba21-2aed1c9081b9', '2026-04-23 21:49:09.552908+00', '2026-04-23 21:49:09.552908+00', 'password', '16161650-3cc0-4e7d-bfd1-315757bc794e'),
	('1dd8b130-e69b-472a-b869-fcf7cc0646e3', '2026-04-23 22:21:07.425338+00', '2026-04-23 22:21:07.425338+00', 'password', 'bb38832c-7da2-4bd9-92fd-fab1e415011c'),
	('24d2a8a2-1baf-4c62-8f3b-753ad885243e', '2026-04-23 22:21:38.091335+00', '2026-04-23 22:21:38.091335+00', 'password', 'a501fd78-2c43-48f6-8b8e-ed7a2e5cf06f'),
	('167e5df8-442e-40cf-8de7-4dfd5fdb1c06', '2026-04-23 22:22:34.788803+00', '2026-04-23 22:22:34.788803+00', 'password', 'b709cb6d-0d32-4f77-bf7a-84ca872e2a14'),
	('9aac439a-8764-4fbc-b4d2-fcd917cb8c2b', '2026-04-24 02:33:23.233669+00', '2026-04-24 02:33:23.233669+00', 'password', 'ffea30a3-4191-4475-8e56-7aec202d61a7'),
	('eaeb4aa6-8b30-4a62-9ff0-9796744546f4', '2026-04-24 02:33:51.464005+00', '2026-04-24 02:33:51.464005+00', 'password', 'a43cacf0-f5da-4250-932e-591d37335278'),
	('3dd91012-3aa2-458d-a1a6-86b71aeb7752', '2026-04-24 02:36:05.044287+00', '2026-04-24 02:36:05.044287+00', 'password', 'cf521b07-a83a-46a7-b907-ba5cdfd575c2'),
	('f8370a4a-48ec-4b77-9bd5-c8fbd3c34c8e', '2026-04-24 02:36:56.72169+00', '2026-04-24 02:36:56.72169+00', 'password', '93d2b1e2-7636-4508-9530-74f1df70e1fe'),
	('3048a2c0-f613-48e9-a776-49535d5eb5e7', '2026-04-24 02:44:42.368716+00', '2026-04-24 02:44:42.368716+00', 'password', '199d24f5-85bf-4e04-948b-e58697d745d2'),
	('55849ed8-d2da-4ef2-981e-3af24eef9815', '2026-04-24 06:04:11.175822+00', '2026-04-24 06:04:11.175822+00', 'password', '88106865-dc7f-463d-9e8e-c449a88211e6'),
	('ee599a1f-0336-4161-8412-3001ef94cc86', '2026-04-24 06:05:48.166025+00', '2026-04-24 06:05:48.166025+00', 'password', '0ddc37ba-58ac-4826-af9d-b71d785285dd'),
	('31015a9a-bb69-4652-9bdb-e5b605a59cd4', '2026-04-24 06:07:48.366148+00', '2026-04-24 06:07:48.366148+00', 'password', '9f758f3e-e15a-4f4c-809f-4507464ce078'),
	('c8e298d0-76c7-4a6e-b0d7-031bb9b803df', '2026-04-24 06:08:42.04488+00', '2026-04-24 06:08:42.04488+00', 'password', 'cd725c78-44f1-4656-9d7e-2ac9afbcceac'),
	('9b812bab-1a29-4229-964b-c3fccff81004', '2026-04-24 06:11:36.350488+00', '2026-04-24 06:11:36.350488+00', 'password', 'bc253959-ddbf-4df2-8349-9b4c2ea5ff8e'),
	('0cea5d7d-4b66-43fe-bdf9-7a7625e9419b', '2026-04-24 12:33:45.095616+00', '2026-04-24 12:33:45.095616+00', 'password', 'e5a68db5-e776-485a-9ef8-aaef4d271278'),
	('fc63de88-8e0f-48b6-b635-a20f06c7667b', '2026-04-24 17:51:50.101899+00', '2026-04-24 17:51:50.101899+00', 'password', '76e4646a-27d0-41ee-b269-961eea05d87a'),
	('e8df5ca1-1685-4fd1-95bd-443fb30eefda', '2026-04-25 00:21:15.092564+00', '2026-04-25 00:21:15.092564+00', 'password', 'b29a6f30-e458-46a1-8b81-4289ffe457b0'),
	('e7fbf6cb-672c-4140-8f10-85490114e08a', '2026-05-01 01:48:13.704487+00', '2026-05-01 01:48:13.704487+00', 'password', 'd5f8ab3e-29b3-41c8-a02b-8802e202d43a'),
	('22ebab62-6968-4a9e-9d76-3d8d83484ea1', '2026-05-01 01:48:30.903437+00', '2026-05-01 01:48:30.903437+00', 'password', 'dbd42985-457e-4a83-b87c-54a225f21ae6'),
	('cf28dda7-88a6-4743-8aac-a11778ef13eb', '2026-05-01 01:48:39.720812+00', '2026-05-01 01:48:39.720812+00', 'password', '18077491-9626-4b92-baca-4858792cdca4'),
	('6ebcfdd1-416c-408a-8f89-9cb60247b83f', '2026-05-01 01:52:58.901189+00', '2026-05-01 01:52:58.901189+00', 'password', '40c1750f-17bb-43a6-b083-0b75bf2414a9'),
	('9ef8af0b-2aa3-420c-800c-a8630775a767', '2026-05-01 02:08:50.697106+00', '2026-05-01 02:08:50.697106+00', 'password', 'b52fad9d-aa95-4b36-9ffe-6d4189522769'),
	('3178bbdf-e8d4-425e-a131-04d38c5aa7a0', '2026-05-01 02:11:49.325256+00', '2026-05-01 02:11:49.325256+00', 'password', 'ccad8ac9-b217-4413-a123-2f021743d847'),
	('ce76f490-cf91-4aab-ad6c-e651aa14fcbe', '2026-05-01 02:15:13.651647+00', '2026-05-01 02:15:13.651647+00', 'password', 'd2d23f99-cf8f-45a1-b2c6-ee32d28e22b9'),
	('1ddbac87-1554-434b-aaaf-adc3faace058', '2026-05-01 04:10:57.03259+00', '2026-05-01 04:10:57.03259+00', 'password', '789b89fa-bd80-4b4c-a2ec-bf6dc0585b3b'),
	('8d787549-2136-4e4e-bd90-4e24cb219169', '2026-05-01 04:11:02.703037+00', '2026-05-01 04:11:02.703037+00', 'password', 'ef18fddd-010d-47ff-98c5-33e5a6f732cb'),
	('4b434841-3b3f-45b2-a7c4-0a775eaa83cc', '2026-05-01 04:11:06.315933+00', '2026-05-01 04:11:06.315933+00', 'password', 'a9e6d961-d856-4c42-970a-d70e1a52af9e'),
	('baf45348-97f0-444d-8f4e-c4ad7fa583a9', '2026-05-01 04:14:12.488813+00', '2026-05-01 04:14:12.488813+00', 'password', '2dd962f1-5008-42ae-860a-ab497f5c51f5'),
	('b3e122b7-d6fc-4f1b-893b-f5f6dbabe265', '2026-05-01 04:15:00.560844+00', '2026-05-01 04:15:00.560844+00', 'password', '496b9105-0fb7-4a69-8779-d5cba106ee2a'),
	('5d66dbf3-f3d8-4eda-8af3-d6e851c27e84', '2026-05-01 04:16:03.55093+00', '2026-05-01 04:16:03.55093+00', 'password', '7924728a-0983-4190-a623-dfcf83164eba'),
	('6aed96b0-4eee-4d45-9b75-86c55155460b', '2026-05-03 00:29:26.568174+00', '2026-05-03 00:29:26.568174+00', 'password', '393340eb-5f07-4c13-94b0-30793e7c2677'),
	('0677857e-60de-4135-b074-fccf511642f3', '2026-05-03 00:31:26.561652+00', '2026-05-03 00:31:26.561652+00', 'password', '28972aaa-6a04-4bc2-a92e-737fb39fc4d6'),
	('2ef2fb74-92e5-4083-ab48-934199c39a63', '2026-05-03 01:04:44.011535+00', '2026-05-03 01:04:44.011535+00', 'password', '272a15df-d981-4b1c-9185-4d549886fffc'),
	('7462be53-f8ed-4f95-9a76-75f1e51f9d29', '2026-05-03 01:08:26.567325+00', '2026-05-03 01:08:26.567325+00', 'password', '65bfc462-7a58-478b-9b4a-909a32155d84'),
	('8c7ced6b-9ab6-4948-b746-251d33a5aef6', '2026-05-03 01:12:01.190597+00', '2026-05-03 01:12:01.190597+00', 'password', '328d81b0-98e2-4b43-bf34-e5d751db3ee1'),
	('74eefd87-ae7f-486b-8bb6-ebb19ace4eee', '2026-05-03 01:18:13.079528+00', '2026-05-03 01:18:13.079528+00', 'password', 'b29d8d05-037d-47cc-ac93-0205ece03159'),
	('48fa15bf-5076-426c-8eb5-2f3508df1cce', '2026-05-03 01:20:45.578696+00', '2026-05-03 01:20:45.578696+00', 'password', '8bc6726c-8ae1-4aab-b974-34810cdc4bf5'),
	('f118e7e6-5326-496e-acee-ef2d4bf03f9b', '2026-05-03 01:26:09.158416+00', '2026-05-03 01:26:09.158416+00', 'password', 'e9348504-7c27-433c-bc29-ef75a6ddb799'),
	('d6228b89-a8ad-49b0-8125-434d2f870165', '2026-05-03 03:13:23.661553+00', '2026-05-03 03:13:23.661553+00', 'password', 'ef409586-0976-4092-ac67-78c01ecb2158'),
	('37d3dd68-0900-4864-91af-bd35cb987f0b', '2026-05-03 04:07:28.260084+00', '2026-05-03 04:07:28.260084+00', 'password', '83ce234d-c621-4e1c-a3e7-fb121a1bf0ba'),
	('5432e706-7c04-4c22-b082-79026957e957', '2026-05-05 03:52:32.330287+00', '2026-05-05 03:52:32.330287+00', 'password', 'a17f2a97-e987-4a0a-8ddf-6a7c065c5c75'),
	('bbcbeb8e-3d64-45c1-811c-52ea71adf55e', '2026-05-05 03:58:15.267367+00', '2026-05-05 03:58:15.267367+00', 'password', '4f2f47f5-bac1-4b24-8b19-e4592d756970'),
	('6155cad2-2459-4f36-8144-3b20bfc721f3', '2026-05-05 12:41:30.110979+00', '2026-05-05 12:41:30.110979+00', 'password', '40a57d6b-fa17-4902-9e6c-761843bcbdd7'),
	('0435e8eb-409d-46a2-a075-dc85955b5009', '2026-05-05 14:01:56.780063+00', '2026-05-05 14:01:56.780063+00', 'password', '73ff9fa8-ac0d-4347-8c1c-fc931695592a'),
	('38cd12bc-65f2-46e8-b938-8c56ef0a1ffd', '2026-05-05 14:14:17.490815+00', '2026-05-05 14:14:17.490815+00', 'password', '44239d03-1268-42f8-9dbc-c52761f49d2e'),
	('09528abf-95f4-4adc-8b4d-0de618fdd85f', '2026-05-09 01:03:38.032873+00', '2026-05-09 01:03:38.032873+00', 'password', 'd4f49e5c-4b01-45d9-a9b1-38889568a1aa'),
	('2d9d62bf-70d1-4ad4-bb88-dc8c70959216', '2026-05-09 01:29:54.855004+00', '2026-05-09 01:29:54.855004+00', 'password', '75add52a-b051-414e-8a0d-1c2277cc5a41'),
	('92f6c442-264d-449b-8b3a-070bdb349895', '2026-05-09 01:54:27.50676+00', '2026-05-09 01:54:27.50676+00', 'password', 'cd1db376-a4eb-4267-9b8f-0370657f5d0f'),
	('12e86f66-e160-4858-9cd8-c0d252b15b23', '2026-05-09 02:34:01.955049+00', '2026-05-09 02:34:01.955049+00', 'password', '8be791fc-0ee7-46bd-8654-e749e64ee42e'),
	('0760033c-5adf-4e10-aa3d-3fcf4876c972', '2026-05-09 03:26:54.087118+00', '2026-05-09 03:26:54.087118+00', 'password', 'ffe28947-57f9-482f-a512-666048516e09');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 1, 'lj7wfinzpwhm', '48a9dcd2-5dce-41e6-a7d8-2f757106a9d2', false, '2026-04-17 00:33:36.544202+00', '2026-04-17 00:33:36.544202+00', NULL, 'e4c7af6e-93f6-4a02-9832-90388655d822'),
	('00000000-0000-0000-0000-000000000000', 2, '6iibyzwxz5ds', '48a9dcd2-5dce-41e6-a7d8-2f757106a9d2', false, '2026-04-17 00:55:06.981625+00', '2026-04-17 00:55:06.981625+00', NULL, '777a65f0-2bd0-4715-99a4-47663a846218'),
	('00000000-0000-0000-0000-000000000000', 3, 'pvugiusggwc4', '48a9dcd2-5dce-41e6-a7d8-2f757106a9d2', false, '2026-04-17 01:10:05.049266+00', '2026-04-17 01:10:05.049266+00', NULL, 'abe43117-7bd3-4380-890e-8dd8da86e8d6'),
	('00000000-0000-0000-0000-000000000000', 4, 'er3od2w2shza', 'a3cd8efe-9625-4530-bfe2-3a448502a80b', false, '2026-04-21 02:50:51.273232+00', '2026-04-21 02:50:51.273232+00', NULL, 'c59a6bcd-851d-4ad3-84a2-bd7ee5dd763d'),
	('00000000-0000-0000-0000-000000000000', 5, '7wuwze5r4krq', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', false, '2026-04-23 00:30:32.630276+00', '2026-04-23 00:30:32.630276+00', NULL, 'eee67a37-a9ae-4b15-9f8b-4073c54b3372'),
	('00000000-0000-0000-0000-000000000000', 6, 'ig3uicuxg5rx', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', false, '2026-04-23 00:47:47.821242+00', '2026-04-23 00:47:47.821242+00', NULL, '7d9eeb78-7870-4067-a457-3639b2d87287'),
	('00000000-0000-0000-0000-000000000000', 7, 'b4b6lhnvfyyv', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', false, '2026-04-23 01:00:55.21109+00', '2026-04-23 01:00:55.21109+00', NULL, '659bf5b4-0e41-4591-87f9-79f032788c74'),
	('00000000-0000-0000-0000-000000000000', 8, 'e6jvhaqjlxgv', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', false, '2026-04-23 01:43:33.752655+00', '2026-04-23 01:43:33.752655+00', NULL, '699dc278-359a-4aea-8679-27e4067601f1'),
	('00000000-0000-0000-0000-000000000000', 9, 'wgkrp3x3nq5x', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', false, '2026-04-23 02:02:08.282302+00', '2026-04-23 02:02:08.282302+00', NULL, '8eaf4122-a7ab-41d0-ad07-6e60d6d00553'),
	('00000000-0000-0000-0000-000000000000', 10, 'jvfb3hp25yfd', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', false, '2026-04-23 02:13:30.348441+00', '2026-04-23 02:13:30.348441+00', NULL, '1a61b39f-20db-4827-83bc-ae3d80d04e1a'),
	('00000000-0000-0000-0000-000000000000', 11, '2o2gks4cdoee', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', false, '2026-04-23 02:21:10.120103+00', '2026-04-23 02:21:10.120103+00', NULL, 'cc268766-5e61-424b-bc0c-0ada1e024e5c'),
	('00000000-0000-0000-0000-000000000000', 12, 'ekxkwbyf3jeh', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', false, '2026-04-23 02:23:09.480402+00', '2026-04-23 02:23:09.480402+00', NULL, 'dd3e8138-6734-437c-ac58-936a2f1cc339'),
	('00000000-0000-0000-0000-000000000000', 13, 'iduloa2qriyb', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', false, '2026-04-23 02:26:50.289704+00', '2026-04-23 02:26:50.289704+00', NULL, 'ffb67c9f-8b05-49c8-9c02-a74751e9bdb9'),
	('00000000-0000-0000-0000-000000000000', 14, 'llb5zv26rkxl', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', false, '2026-04-23 02:31:40.560831+00', '2026-04-23 02:31:40.560831+00', NULL, 'e77c7d9a-3bae-4503-9d44-8cc0bd285c79'),
	('00000000-0000-0000-0000-000000000000', 15, 'rjk3isthakja', 'a3cd8efe-9625-4530-bfe2-3a448502a80b', false, '2026-04-23 02:34:31.5037+00', '2026-04-23 02:34:31.5037+00', NULL, '85e7c9cc-fd52-40b3-99fd-533d6deec6ca'),
	('00000000-0000-0000-0000-000000000000', 16, 's7qfziiy7ek7', 'a3cd8efe-9625-4530-bfe2-3a448502a80b', false, '2026-04-23 02:43:56.552103+00', '2026-04-23 02:43:56.552103+00', NULL, 'cdae33dc-ec9f-4bf4-8248-df435fbeb36f'),
	('00000000-0000-0000-0000-000000000000', 17, 'lg72uta23p2i', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', false, '2026-04-23 02:44:45.914419+00', '2026-04-23 02:44:45.914419+00', NULL, '32e9c7e3-f105-46ad-9831-a2ef1a191b5d'),
	('00000000-0000-0000-0000-000000000000', 18, '4qjamdpbxknw', 'bf2f1bed-52d3-425f-848e-725fd3198343', false, '2026-04-23 02:51:28.39743+00', '2026-04-23 02:51:28.39743+00', NULL, 'ce7b6515-c80c-499b-90df-a3dc4d2ee7b7'),
	('00000000-0000-0000-0000-000000000000', 19, 'ava425zezib4', 'c964641a-d79a-49fa-88cf-be2b4ea4e53d', false, '2026-04-23 03:18:27.884177+00', '2026-04-23 03:18:27.884177+00', NULL, '415c5c8b-953e-49fa-a15a-5f90e5a20ad8'),
	('00000000-0000-0000-0000-000000000000', 20, 'fcgjpmmbzitm', 'c964641a-d79a-49fa-88cf-be2b4ea4e53d', false, '2026-04-23 03:23:35.063892+00', '2026-04-23 03:23:35.063892+00', NULL, '2e2ea7ac-6117-4397-8b90-2961d313fb19'),
	('00000000-0000-0000-0000-000000000000', 21, 'bvlzg4ilkowi', '67c250c7-8a51-4fb1-a7d0-7420c7b18bf9', false, '2026-04-23 03:25:01.55095+00', '2026-04-23 03:25:01.55095+00', NULL, '96332d6b-7637-4633-9b88-48e4ff8008ef'),
	('00000000-0000-0000-0000-000000000000', 22, 'wpf6pggib3sp', 'c964641a-d79a-49fa-88cf-be2b4ea4e53d', false, '2026-04-23 03:35:00.320663+00', '2026-04-23 03:35:00.320663+00', NULL, '0b19176e-f306-4244-bfba-a87505ae907a'),
	('00000000-0000-0000-0000-000000000000', 23, 'u7arl2qy2fyf', '67c250c7-8a51-4fb1-a7d0-7420c7b18bf9', false, '2026-04-23 03:50:49.77417+00', '2026-04-23 03:50:49.77417+00', NULL, 'b698f94a-dc72-4721-bd18-d104ffc8c1b4'),
	('00000000-0000-0000-0000-000000000000', 24, '24a2pxmeghr6', 'c964641a-d79a-49fa-88cf-be2b4ea4e53d', false, '2026-04-23 21:49:09.530132+00', '2026-04-23 21:49:09.530132+00', NULL, '4513f36d-1363-4835-ba21-2aed1c9081b9'),
	('00000000-0000-0000-0000-000000000000', 25, '4m6j7ulzv4rt', '67c250c7-8a51-4fb1-a7d0-7420c7b18bf9', false, '2026-04-23 22:21:07.420083+00', '2026-04-23 22:21:07.420083+00', NULL, '1dd8b130-e69b-472a-b869-fcf7cc0646e3'),
	('00000000-0000-0000-0000-000000000000', 26, '5hgnietnteru', 'c964641a-d79a-49fa-88cf-be2b4ea4e53d', false, '2026-04-23 22:21:38.087852+00', '2026-04-23 22:21:38.087852+00', NULL, '24d2a8a2-1baf-4c62-8f3b-753ad885243e'),
	('00000000-0000-0000-0000-000000000000', 27, 'fgwfa3jupwcm', 'c592c020-ee98-43ab-a149-b967f3a25550', false, '2026-04-23 22:22:34.786856+00', '2026-04-23 22:22:34.786856+00', NULL, '167e5df8-442e-40cf-8de7-4dfd5fdb1c06'),
	('00000000-0000-0000-0000-000000000000', 28, 'zeypwual5dhd', 'c964641a-d79a-49fa-88cf-be2b4ea4e53d', false, '2026-04-24 02:33:23.210247+00', '2026-04-24 02:33:23.210247+00', NULL, '9aac439a-8764-4fbc-b4d2-fcd917cb8c2b'),
	('00000000-0000-0000-0000-000000000000', 29, 'bgu25zdrc4yz', '67c250c7-8a51-4fb1-a7d0-7420c7b18bf9', false, '2026-04-24 02:33:51.455432+00', '2026-04-24 02:33:51.455432+00', NULL, 'eaeb4aa6-8b30-4a62-9ff0-9796744546f4'),
	('00000000-0000-0000-0000-000000000000', 30, 'dl3273grbnb3', 'c964641a-d79a-49fa-88cf-be2b4ea4e53d', false, '2026-04-24 02:36:05.038229+00', '2026-04-24 02:36:05.038229+00', NULL, '3dd91012-3aa2-458d-a1a6-86b71aeb7752'),
	('00000000-0000-0000-0000-000000000000', 31, 'jch5l73253pe', 'b33c0d3f-4fa4-4a3d-b403-61d142ff77c3', false, '2026-04-24 02:36:56.72018+00', '2026-04-24 02:36:56.72018+00', NULL, 'f8370a4a-48ec-4b77-9bd5-c8fbd3c34c8e'),
	('00000000-0000-0000-0000-000000000000', 32, '2vngjaihy45x', 'c964641a-d79a-49fa-88cf-be2b4ea4e53d', true, '2026-04-24 02:44:42.36403+00', '2026-04-24 03:42:20.542787+00', NULL, '3048a2c0-f613-48e9-a776-49535d5eb5e7'),
	('00000000-0000-0000-0000-000000000000', 33, 'ff2b6jwzvnrq', 'c964641a-d79a-49fa-88cf-be2b4ea4e53d', true, '2026-04-24 03:42:20.549437+00', '2026-04-24 04:39:51.449257+00', '2vngjaihy45x', '3048a2c0-f613-48e9-a776-49535d5eb5e7'),
	('00000000-0000-0000-0000-000000000000', 34, 'kdnjl7j3sxdq', 'c964641a-d79a-49fa-88cf-be2b4ea4e53d', true, '2026-04-24 04:39:51.455501+00', '2026-04-24 05:37:25.536607+00', 'ff2b6jwzvnrq', '3048a2c0-f613-48e9-a776-49535d5eb5e7'),
	('00000000-0000-0000-0000-000000000000', 35, 'zklfk3nw4b35', 'c964641a-d79a-49fa-88cf-be2b4ea4e53d', false, '2026-04-24 05:37:25.544331+00', '2026-04-24 05:37:25.544331+00', 'kdnjl7j3sxdq', '3048a2c0-f613-48e9-a776-49535d5eb5e7'),
	('00000000-0000-0000-0000-000000000000', 36, 'kpugqbivx4sy', 'c964641a-d79a-49fa-88cf-be2b4ea4e53d', false, '2026-04-24 06:04:11.166497+00', '2026-04-24 06:04:11.166497+00', NULL, '55849ed8-d2da-4ef2-981e-3af24eef9815'),
	('00000000-0000-0000-0000-000000000000', 37, 'cejmjbvlf4og', 'c964641a-d79a-49fa-88cf-be2b4ea4e53d', false, '2026-04-24 06:05:48.163107+00', '2026-04-24 06:05:48.163107+00', NULL, 'ee599a1f-0336-4161-8412-3001ef94cc86'),
	('00000000-0000-0000-0000-000000000000', 38, '64fanavsf7oq', '67c250c7-8a51-4fb1-a7d0-7420c7b18bf9', false, '2026-04-24 06:07:48.363352+00', '2026-04-24 06:07:48.363352+00', NULL, '31015a9a-bb69-4652-9bdb-e5b605a59cd4'),
	('00000000-0000-0000-0000-000000000000', 39, 'ojjcp7nh32d2', 'c964641a-d79a-49fa-88cf-be2b4ea4e53d', false, '2026-04-24 06:08:42.042255+00', '2026-04-24 06:08:42.042255+00', NULL, 'c8e298d0-76c7-4a6e-b0d7-031bb9b803df'),
	('00000000-0000-0000-0000-000000000000', 40, 'gojaeqpiqjmn', 'c964641a-d79a-49fa-88cf-be2b4ea4e53d', false, '2026-04-24 06:11:36.342336+00', '2026-04-24 06:11:36.342336+00', NULL, '9b812bab-1a29-4229-964b-c3fccff81004'),
	('00000000-0000-0000-0000-000000000000', 41, 'doqg4wklcbyz', 'c964641a-d79a-49fa-88cf-be2b4ea4e53d', false, '2026-04-24 12:33:45.071064+00', '2026-04-24 12:33:45.071064+00', NULL, '0cea5d7d-4b66-43fe-bdf9-7a7625e9419b'),
	('00000000-0000-0000-0000-000000000000', 42, '46swgkxwpmxi', 'c964641a-d79a-49fa-88cf-be2b4ea4e53d', false, '2026-04-24 17:51:50.059066+00', '2026-04-24 17:51:50.059066+00', NULL, 'fc63de88-8e0f-48b6-b635-a20f06c7667b'),
	('00000000-0000-0000-0000-000000000000', 43, 'ebt6dmlrqpl2', 'c964641a-d79a-49fa-88cf-be2b4ea4e53d', false, '2026-04-25 00:21:15.068119+00', '2026-04-25 00:21:15.068119+00', NULL, 'e8df5ca1-1685-4fd1-95bd-443fb30eefda'),
	('00000000-0000-0000-0000-000000000000', 44, 'mk5r6he2nht2', 'bf2f1bed-52d3-425f-848e-725fd3198343', false, '2026-05-01 01:48:13.678284+00', '2026-05-01 01:48:13.678284+00', NULL, 'e7fbf6cb-672c-4140-8f10-85490114e08a'),
	('00000000-0000-0000-0000-000000000000', 45, 'fjv33akuqrtj', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', false, '2026-05-01 01:48:30.901385+00', '2026-05-01 01:48:30.901385+00', NULL, '22ebab62-6968-4a9e-9d76-3d8d83484ea1'),
	('00000000-0000-0000-0000-000000000000', 46, '4zdzt66rxc2l', 'a3cd8efe-9625-4530-bfe2-3a448502a80b', false, '2026-05-01 01:48:39.719318+00', '2026-05-01 01:48:39.719318+00', NULL, 'cf28dda7-88a6-4743-8aac-a11778ef13eb'),
	('00000000-0000-0000-0000-000000000000', 47, 'dswydg4n5vaq', 'bf2f1bed-52d3-425f-848e-725fd3198343', false, '2026-05-01 01:52:58.898355+00', '2026-05-01 01:52:58.898355+00', NULL, '6ebcfdd1-416c-408a-8f89-9cb60247b83f'),
	('00000000-0000-0000-0000-000000000000', 48, 't5wdwlyfsewz', 'bf2f1bed-52d3-425f-848e-725fd3198343', false, '2026-05-01 02:08:50.693361+00', '2026-05-01 02:08:50.693361+00', NULL, '9ef8af0b-2aa3-420c-800c-a8630775a767'),
	('00000000-0000-0000-0000-000000000000', 49, 'dogcsgplhlk2', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', false, '2026-05-01 02:11:49.321946+00', '2026-05-01 02:11:49.321946+00', NULL, '3178bbdf-e8d4-425e-a131-04d38c5aa7a0'),
	('00000000-0000-0000-0000-000000000000', 50, 'jteieyu7wsxb', 'a3cd8efe-9625-4530-bfe2-3a448502a80b', false, '2026-05-01 02:15:13.648821+00', '2026-05-01 02:15:13.648821+00', NULL, 'ce76f490-cf91-4aab-ad6c-e651aa14fcbe'),
	('00000000-0000-0000-0000-000000000000', 51, 'brz4vdjmma72', 'bf2f1bed-52d3-425f-848e-725fd3198343', false, '2026-05-01 04:10:57.015416+00', '2026-05-01 04:10:57.015416+00', NULL, '1ddbac87-1554-434b-aaaf-adc3faace058'),
	('00000000-0000-0000-0000-000000000000', 52, 'swphanz5w5lw', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', false, '2026-05-01 04:11:02.698045+00', '2026-05-01 04:11:02.698045+00', NULL, '8d787549-2136-4e4e-bd90-4e24cb219169'),
	('00000000-0000-0000-0000-000000000000', 53, 'ketq5lqsegqu', 'a3cd8efe-9625-4530-bfe2-3a448502a80b', false, '2026-05-01 04:11:06.312505+00', '2026-05-01 04:11:06.312505+00', NULL, '4b434841-3b3f-45b2-a7c4-0a775eaa83cc'),
	('00000000-0000-0000-0000-000000000000', 54, 'al2yrziaxyju', 'a3cd8efe-9625-4530-bfe2-3a448502a80b', false, '2026-05-01 04:14:12.485921+00', '2026-05-01 04:14:12.485921+00', NULL, 'baf45348-97f0-444d-8f4e-c4ad7fa583a9'),
	('00000000-0000-0000-0000-000000000000', 55, 'r7qej3lbhtct', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', false, '2026-05-01 04:15:00.544817+00', '2026-05-01 04:15:00.544817+00', NULL, 'b3e122b7-d6fc-4f1b-893b-f5f6dbabe265'),
	('00000000-0000-0000-0000-000000000000', 56, 'afjplsmajwrm', 'a3cd8efe-9625-4530-bfe2-3a448502a80b', false, '2026-05-01 04:16:03.54602+00', '2026-05-01 04:16:03.54602+00', NULL, '5d66dbf3-f3d8-4eda-8af3-d6e851c27e84'),
	('00000000-0000-0000-0000-000000000000', 57, 'j5h6t26ycsbt', 'b33f9da8-3b21-429f-9087-00d1ba2a879e', false, '2026-05-03 00:29:26.544353+00', '2026-05-03 00:29:26.544353+00', NULL, '6aed96b0-4eee-4d45-9b75-86c55155460b'),
	('00000000-0000-0000-0000-000000000000', 58, 'm5iutcm3osfm', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', false, '2026-05-03 00:31:26.555234+00', '2026-05-03 00:31:26.555234+00', NULL, '0677857e-60de-4135-b074-fccf511642f3'),
	('00000000-0000-0000-0000-000000000000', 59, 'bl3xnkfzb6ac', 'bf2f1bed-52d3-425f-848e-725fd3198343', false, '2026-05-03 01:04:43.99779+00', '2026-05-03 01:04:43.99779+00', NULL, '2ef2fb74-92e5-4083-ab48-934199c39a63'),
	('00000000-0000-0000-0000-000000000000', 60, 'zbfbhh4y3rqq', 'b65cbbe5-5ff5-4381-850a-5a85c027bf51', false, '2026-05-03 01:08:26.562841+00', '2026-05-03 01:08:26.562841+00', NULL, '7462be53-f8ed-4f95-9a76-75f1e51f9d29'),
	('00000000-0000-0000-0000-000000000000', 61, 'lty6yvgvj2dr', 'b33f9da8-3b21-429f-9087-00d1ba2a879e', false, '2026-05-03 01:12:01.187532+00', '2026-05-03 01:12:01.187532+00', NULL, '8c7ced6b-9ab6-4948-b746-251d33a5aef6'),
	('00000000-0000-0000-0000-000000000000', 62, 'md6crahjn7pk', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', false, '2026-05-03 01:18:13.071335+00', '2026-05-03 01:18:13.071335+00', NULL, '74eefd87-ae7f-486b-8bb6-ebb19ace4eee'),
	('00000000-0000-0000-0000-000000000000', 63, 't5mbpxazk23w', 'b33f9da8-3b21-429f-9087-00d1ba2a879e', false, '2026-05-03 01:20:45.573598+00', '2026-05-03 01:20:45.573598+00', NULL, '48fa15bf-5076-426c-8eb5-2f3508df1cce'),
	('00000000-0000-0000-0000-000000000000', 64, '2j6fk6m6f4vf', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', false, '2026-05-03 01:26:09.154404+00', '2026-05-03 01:26:09.154404+00', NULL, 'f118e7e6-5326-496e-acee-ef2d4bf03f9b'),
	('00000000-0000-0000-0000-000000000000', 65, 'ldk7m63beykf', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', false, '2026-05-03 03:13:23.624568+00', '2026-05-03 03:13:23.624568+00', NULL, 'd6228b89-a8ad-49b0-8125-434d2f870165'),
	('00000000-0000-0000-0000-000000000000', 66, 'bhmy4g3zcige', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', false, '2026-05-03 04:07:28.247185+00', '2026-05-03 04:07:28.247185+00', NULL, '37d3dd68-0900-4864-91af-bd35cb987f0b'),
	('00000000-0000-0000-0000-000000000000', 67, 'i3v4npd3sg5d', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', false, '2026-05-05 03:52:32.293388+00', '2026-05-05 03:52:32.293388+00', NULL, '5432e706-7c04-4c22-b082-79026957e957'),
	('00000000-0000-0000-0000-000000000000', 68, '4m736xxd4shm', 'a3cd8efe-9625-4530-bfe2-3a448502a80b', false, '2026-05-05 03:58:15.262999+00', '2026-05-05 03:58:15.262999+00', NULL, 'bbcbeb8e-3d64-45c1-811c-52ea71adf55e'),
	('00000000-0000-0000-0000-000000000000', 69, 'hxsefxa3cezv', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', true, '2026-05-05 12:41:30.086366+00', '2026-05-05 14:01:27.952073+00', NULL, '6155cad2-2459-4f36-8144-3b20bfc721f3'),
	('00000000-0000-0000-0000-000000000000', 70, '5tge46hplbse', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', false, '2026-05-05 14:01:27.970629+00', '2026-05-05 14:01:27.970629+00', 'hxsefxa3cezv', '6155cad2-2459-4f36-8144-3b20bfc721f3'),
	('00000000-0000-0000-0000-000000000000', 71, '43jna43aa4mo', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', false, '2026-05-05 14:01:56.77115+00', '2026-05-05 14:01:56.77115+00', NULL, '0435e8eb-409d-46a2-a075-dc85955b5009'),
	('00000000-0000-0000-0000-000000000000', 72, 'reut2stl7syg', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', false, '2026-05-05 14:14:17.487038+00', '2026-05-05 14:14:17.487038+00', NULL, '38cd12bc-65f2-46e8-b938-8c56ef0a1ffd'),
	('00000000-0000-0000-0000-000000000000', 73, 'wp5lzegewon7', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', false, '2026-05-09 01:03:38.004258+00', '2026-05-09 01:03:38.004258+00', NULL, '09528abf-95f4-4adc-8b4d-0de618fdd85f'),
	('00000000-0000-0000-0000-000000000000', 74, 'w6myxkwpqwjy', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', false, '2026-05-09 01:29:54.849964+00', '2026-05-09 01:29:54.849964+00', NULL, '2d9d62bf-70d1-4ad4-bb88-dc8c70959216'),
	('00000000-0000-0000-0000-000000000000', 75, 'oc6tn24moskk', 'a3cd8efe-9625-4530-bfe2-3a448502a80b', false, '2026-05-09 01:54:27.502161+00', '2026-05-09 01:54:27.502161+00', NULL, '92f6c442-264d-449b-8b3a-070bdb349895'),
	('00000000-0000-0000-0000-000000000000', 76, '5u7lfmcu4gbr', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', false, '2026-05-09 02:34:01.936551+00', '2026-05-09 02:34:01.936551+00', NULL, '12e86f66-e160-4858-9cd8-c0d252b15b23'),
	('00000000-0000-0000-0000-000000000000', 77, 't3n5v2wryzjo', '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', false, '2026-05-09 03:26:54.042244+00', '2026-05-09 03:26:54.042244+00', NULL, '0760033c-5adf-4e10-aa3d-3fcf4876c972');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: profesor; Type: TABLE DATA; Schema: horarios; Owner: postgres
--

INSERT INTO "horarios"."profesor" ("id", "codigo", "nombres", "apellidos", "categoria_academica", "categoria_cientifica", "email", "telefono", "activo", "fecha_creacion") VALUES
	(1, 'PRO001', 'Juan Carlos', 'Pérez López', 'Instructor', 'Máster', 'profesorjuancarlos@gmail.com', '', true, '2026-04-23 03:43:25.555767+00'),
	(2, 'PRO002', 'Elena', 'De la Cruz Jorge', 'Titular', 'Doctor', 'profesoraelena@gmail.com', '', true, '2026-04-23 03:44:25.971351+00'),
	(3, 'PRO003', 'Felipe', 'González Quesada', 'Asistente', 'Doctor en Ciencias', 'profesorfelipe@gmail.com', '', true, '2026-04-23 03:45:29.391726+00');


--
-- Data for Name: asignatura; Type: TABLE DATA; Schema: horarios; Owner: postgres
--

INSERT INTO "horarios"."asignatura" ("id", "codigo", "nombre", "descripcion", "año_academico", "periodo", "horas_presenciales", "horas_no_presenciales", "horas_totales", "tipo_evaluacion", "color", "profesor_id", "fecha_creacion") VALUES
	(1, 'IP', 'Introducción a la Programación', 'Donde empieza todo. El inicio, fundamentos, programación básica, etc.', 1, 1, 45, 15, 0, 'P', '#ff3333', 1, '2026-04-23 03:36:52.603869+00'),
	(2, 'FI', 'Fundamentos de Informática', 'Teoría y definiciones además de arquitecturas y surgimiento de la programación', 1, 1, 36, 12, 0, 'TC', '#924fe3', 2, '2026-04-23 03:39:47.427012+00'),
	(3, 'M', 'Matemática I', 'Matemática I: Álgebra', 1, 1, 57, 3, 0, 'EF', '#368ffc', 3, '2026-04-23 03:41:45.423015+00');


--
-- Data for Name: horario_general; Type: TABLE DATA; Schema: horarios; Owner: postgres
--

INSERT INTO "horarios"."horario_general" ("id", "titulo", "año_academico", "semestre", "año_carrera", "carrera", "modalidad", "semanas_totales", "semanas_clases", "semanas_examenes", "fecha_inicio", "fecha_fin", "creado_por", "creado_en", "actualizado_en", "activo") VALUES
	(1, 'Horario Docente 2025-2026', '2025-2026', 1, 1, 'INGENIERÍA INFORMÁTICA', 'Diurno', 22, 19, 3, '2026-09-01', '2027-01-31', 'c964641a-d79a-49fa-88cf-be2b4ea4e53d', '2026-04-23 03:47:34.036723+00', NULL, true);


--
-- Data for Name: turno; Type: TABLE DATA; Schema: horarios; Owner: postgres
--

INSERT INTO "horarios"."turno" ("id", "nombre", "hora_inicio", "hora_fin", "duracion_minutos", "seccion", "orden", "activo") VALUES
	(1, 'Mañana 1', '08:15', '09:45', 90, 'mañana', 1, true),
	(2, 'Mañana 2', '09:50', '11:20', 90, 'mañana', 2, true),
	(3, 'Mañana 3', '11:35', '13:05', 90, 'mañana', 3, true),
	(4, 'Tarde 1', '13:10', '14:40', 90, 'tarde', 4, true),
	(5, 'Tarde 2', '14:45', '16:15', 90, 'tarde', 5, true),
	(6, 'Tarde 3', '16:30', '18:00', 90, 'tarde', 6, true);


--
-- Data for Name: horario_semanal; Type: TABLE DATA; Schema: horarios; Owner: postgres
--

INSERT INTO "horarios"."horario_semanal" ("id", "horario_general_id", "semana_numero", "dia_semana", "turno_id", "asignatura_id", "profesor_id", "color", "es_examen", "fecha_especifica") VALUES
	(367, 1, 13, 1, 1, 3, 3, '#368ffc', false, '2026-11-25'),
	(309, 1, 11, 1, 3, 3, 3, '#368ffc', false, '2026-11-11'),
	(4, 1, 1, 0, 4, NULL, NULL, NULL, false, '2026-09-01'),
	(5, 1, 1, 0, 5, NULL, NULL, NULL, false, '2026-09-01'),
	(6, 1, 1, 0, 6, NULL, NULL, NULL, false, '2026-09-01'),
	(9, 1, 1, 1, 3, 1, 1, '#ff3333', false, '2026-09-02'),
	(247, 1, 9, 1, 1, 1, 1, '#ff3333', false, '2026-10-28'),
	(121, 1, 5, 0, 1, 2, 2, '#924fe3', false, '2026-09-29'),
	(10, 1, 1, 1, 4, NULL, NULL, NULL, false, '2026-09-02'),
	(11, 1, 1, 1, 5, NULL, NULL, NULL, false, '2026-09-02'),
	(12, 1, 1, 1, 6, NULL, NULL, NULL, false, '2026-09-02'),
	(20, 1, 1, 3, 2, 2, 2, '#924fe3', false, '2026-09-04'),
	(398, 1, 14, 1, 2, 2, 2, '#924fe3', false, '2026-12-02'),
	(16, 1, 1, 2, 4, NULL, NULL, NULL, false, '2026-09-03'),
	(17, 1, 1, 2, 5, NULL, NULL, NULL, false, '2026-09-03'),
	(18, 1, 1, 2, 6, NULL, NULL, NULL, false, '2026-09-03'),
	(22, 1, 1, 3, 4, NULL, NULL, NULL, false, '2026-09-04'),
	(23, 1, 1, 3, 5, NULL, NULL, NULL, false, '2026-09-04'),
	(24, 1, 1, 3, 6, NULL, NULL, NULL, false, '2026-09-04'),
	(25, 1, 1, 4, 1, NULL, NULL, NULL, false, '2026-09-05'),
	(26, 1, 1, 4, 2, NULL, NULL, NULL, false, '2026-09-05'),
	(27, 1, 1, 4, 3, NULL, NULL, NULL, false, '2026-09-05'),
	(28, 1, 1, 4, 4, NULL, NULL, NULL, false, '2026-09-05'),
	(29, 1, 1, 4, 5, NULL, NULL, NULL, false, '2026-09-05'),
	(30, 1, 1, 4, 6, NULL, NULL, NULL, false, '2026-09-05'),
	(34, 1, 2, 0, 4, NULL, NULL, NULL, false, '2026-09-08'),
	(35, 1, 2, 0, 5, NULL, NULL, NULL, false, '2026-09-08'),
	(36, 1, 2, 0, 6, NULL, NULL, NULL, false, '2026-09-08'),
	(40, 1, 2, 1, 4, NULL, NULL, NULL, false, '2026-09-09'),
	(41, 1, 2, 1, 5, NULL, NULL, NULL, false, '2026-09-09'),
	(42, 1, 2, 1, 6, NULL, NULL, NULL, false, '2026-09-09'),
	(46, 1, 2, 2, 4, NULL, NULL, NULL, false, '2026-09-10'),
	(47, 1, 2, 2, 5, NULL, NULL, NULL, false, '2026-09-10'),
	(48, 1, 2, 2, 6, NULL, NULL, NULL, false, '2026-09-10'),
	(52, 1, 2, 3, 4, NULL, NULL, NULL, false, '2026-09-11'),
	(53, 1, 2, 3, 5, NULL, NULL, NULL, false, '2026-09-11'),
	(54, 1, 2, 3, 6, NULL, NULL, NULL, false, '2026-09-11'),
	(55, 1, 2, 4, 1, NULL, NULL, NULL, false, '2026-09-12'),
	(56, 1, 2, 4, 2, NULL, NULL, NULL, false, '2026-09-12'),
	(57, 1, 2, 4, 3, NULL, NULL, NULL, false, '2026-09-12'),
	(58, 1, 2, 4, 4, NULL, NULL, NULL, false, '2026-09-12'),
	(59, 1, 2, 4, 5, NULL, NULL, NULL, false, '2026-09-12'),
	(60, 1, 2, 4, 6, NULL, NULL, NULL, false, '2026-09-12'),
	(64, 1, 3, 0, 4, NULL, NULL, NULL, false, '2026-09-15'),
	(65, 1, 3, 0, 5, NULL, NULL, NULL, false, '2026-09-15'),
	(66, 1, 3, 0, 6, NULL, NULL, NULL, false, '2026-09-15'),
	(70, 1, 3, 1, 4, NULL, NULL, NULL, false, '2026-09-16'),
	(71, 1, 3, 1, 5, NULL, NULL, NULL, false, '2026-09-16'),
	(72, 1, 3, 1, 6, NULL, NULL, NULL, false, '2026-09-16'),
	(76, 1, 3, 2, 4, NULL, NULL, NULL, false, '2026-09-17'),
	(77, 1, 3, 2, 5, NULL, NULL, NULL, false, '2026-09-17'),
	(78, 1, 3, 2, 6, NULL, NULL, NULL, false, '2026-09-17'),
	(82, 1, 3, 3, 4, NULL, NULL, NULL, false, '2026-09-18'),
	(83, 1, 3, 3, 5, NULL, NULL, NULL, false, '2026-09-18'),
	(84, 1, 3, 3, 6, NULL, NULL, NULL, false, '2026-09-18'),
	(85, 1, 3, 4, 1, NULL, NULL, NULL, false, '2026-09-19'),
	(86, 1, 3, 4, 2, NULL, NULL, NULL, false, '2026-09-19'),
	(87, 1, 3, 4, 3, NULL, NULL, NULL, false, '2026-09-19'),
	(88, 1, 3, 4, 4, NULL, NULL, NULL, false, '2026-09-19'),
	(89, 1, 3, 4, 5, NULL, NULL, NULL, false, '2026-09-19'),
	(90, 1, 3, 4, 6, NULL, NULL, NULL, false, '2026-09-19'),
	(94, 1, 4, 0, 4, NULL, NULL, NULL, false, '2026-09-22'),
	(95, 1, 4, 0, 5, NULL, NULL, NULL, false, '2026-09-22'),
	(96, 1, 4, 0, 6, NULL, NULL, NULL, false, '2026-09-22'),
	(100, 1, 4, 1, 4, NULL, NULL, NULL, false, '2026-09-23'),
	(101, 1, 4, 1, 5, NULL, NULL, NULL, false, '2026-09-23'),
	(102, 1, 4, 1, 6, NULL, NULL, NULL, false, '2026-09-23'),
	(106, 1, 4, 2, 4, NULL, NULL, NULL, false, '2026-09-24'),
	(107, 1, 4, 2, 5, NULL, NULL, NULL, false, '2026-09-24'),
	(2, 1, 1, 0, 2, NULL, NULL, NULL, false, '2026-09-01'),
	(108, 1, 4, 2, 6, NULL, NULL, NULL, false, '2026-09-24'),
	(62, 1, 3, 0, 2, 3, 3, '#368ffc', false, '2026-09-15'),
	(195, 1, 7, 2, 3, 3, 3, '#368ffc', false, '2026-10-15'),
	(284, 1, 10, 2, 2, 3, 3, '#368ffc', false, '2026-11-05'),
	(112, 1, 4, 3, 4, NULL, NULL, NULL, false, '2026-09-25'),
	(113, 1, 4, 3, 5, NULL, NULL, NULL, false, '2026-09-25'),
	(114, 1, 4, 3, 6, NULL, NULL, NULL, false, '2026-09-25'),
	(115, 1, 4, 4, 1, NULL, NULL, NULL, false, '2026-09-26'),
	(116, 1, 4, 4, 2, NULL, NULL, NULL, false, '2026-09-26'),
	(117, 1, 4, 4, 3, NULL, NULL, NULL, false, '2026-09-26'),
	(118, 1, 4, 4, 4, NULL, NULL, NULL, false, '2026-09-26'),
	(119, 1, 4, 4, 5, NULL, NULL, NULL, false, '2026-09-26'),
	(120, 1, 4, 4, 6, NULL, NULL, NULL, false, '2026-09-26'),
	(63, 1, 3, 0, 3, 1, 1, '#ff3333', false, '2026-09-15'),
	(279, 1, 10, 1, 3, 1, 1, '#ff3333', false, '2026-11-04'),
	(301, 1, 11, 0, 1, 1, 1, '#ff3333', false, '2026-11-10'),
	(124, 1, 5, 0, 4, NULL, NULL, NULL, false, '2026-09-29'),
	(125, 1, 5, 0, 5, NULL, NULL, NULL, false, '2026-09-29'),
	(126, 1, 5, 0, 6, NULL, NULL, NULL, false, '2026-09-29'),
	(464, 1, 16, 2, 2, 2, 2, '#924fe3', false, '2026-12-17'),
	(193, 1, 7, 2, 1, 2, 2, '#924fe3', false, '2026-10-15'),
	(130, 1, 5, 1, 4, NULL, NULL, NULL, false, '2026-09-30'),
	(131, 1, 5, 1, 5, NULL, NULL, NULL, false, '2026-09-30'),
	(132, 1, 5, 1, 6, NULL, NULL, NULL, false, '2026-09-30'),
	(136, 1, 5, 2, 4, NULL, NULL, NULL, false, '2026-10-01'),
	(137, 1, 5, 2, 5, NULL, NULL, NULL, false, '2026-10-01'),
	(138, 1, 5, 2, 6, NULL, NULL, NULL, false, '2026-10-01'),
	(142, 1, 5, 3, 4, NULL, NULL, NULL, false, '2026-10-02'),
	(143, 1, 5, 3, 5, NULL, NULL, NULL, false, '2026-10-02'),
	(144, 1, 5, 3, 6, NULL, NULL, NULL, false, '2026-10-02'),
	(145, 1, 5, 4, 1, NULL, NULL, NULL, false, '2026-10-03'),
	(146, 1, 5, 4, 2, NULL, NULL, NULL, false, '2026-10-03'),
	(147, 1, 5, 4, 3, NULL, NULL, NULL, false, '2026-10-03'),
	(148, 1, 5, 4, 4, NULL, NULL, NULL, false, '2026-10-03'),
	(149, 1, 5, 4, 5, NULL, NULL, NULL, false, '2026-10-03'),
	(150, 1, 5, 4, 6, NULL, NULL, NULL, false, '2026-10-03'),
	(154, 1, 6, 0, 4, NULL, NULL, NULL, false, '2026-10-06'),
	(155, 1, 6, 0, 5, NULL, NULL, NULL, false, '2026-10-06'),
	(156, 1, 6, 0, 6, NULL, NULL, NULL, false, '2026-10-06'),
	(160, 1, 6, 1, 4, NULL, NULL, NULL, false, '2026-10-07'),
	(161, 1, 6, 1, 5, NULL, NULL, NULL, false, '2026-10-07'),
	(162, 1, 6, 1, 6, NULL, NULL, NULL, false, '2026-10-07'),
	(166, 1, 6, 2, 4, NULL, NULL, NULL, false, '2026-10-08'),
	(167, 1, 6, 2, 5, NULL, NULL, NULL, false, '2026-10-08'),
	(168, 1, 6, 2, 6, NULL, NULL, NULL, false, '2026-10-08'),
	(172, 1, 6, 3, 4, NULL, NULL, NULL, false, '2026-10-09'),
	(173, 1, 6, 3, 5, NULL, NULL, NULL, false, '2026-10-09'),
	(174, 1, 6, 3, 6, NULL, NULL, NULL, false, '2026-10-09'),
	(175, 1, 6, 4, 1, NULL, NULL, NULL, false, '2026-10-10'),
	(176, 1, 6, 4, 2, NULL, NULL, NULL, false, '2026-10-10'),
	(177, 1, 6, 4, 3, NULL, NULL, NULL, false, '2026-10-10'),
	(178, 1, 6, 4, 4, NULL, NULL, NULL, false, '2026-10-10'),
	(179, 1, 6, 4, 5, NULL, NULL, NULL, false, '2026-10-10'),
	(180, 1, 6, 4, 6, NULL, NULL, NULL, false, '2026-10-10'),
	(184, 1, 7, 0, 4, NULL, NULL, NULL, false, '2026-10-13'),
	(185, 1, 7, 0, 5, NULL, NULL, NULL, false, '2026-10-13'),
	(186, 1, 7, 0, 6, NULL, NULL, NULL, false, '2026-10-13'),
	(190, 1, 7, 1, 4, NULL, NULL, NULL, false, '2026-10-14'),
	(191, 1, 7, 1, 5, NULL, NULL, NULL, false, '2026-10-14'),
	(192, 1, 7, 1, 6, NULL, NULL, NULL, false, '2026-10-14'),
	(196, 1, 7, 2, 4, NULL, NULL, NULL, false, '2026-10-15'),
	(197, 1, 7, 2, 5, NULL, NULL, NULL, false, '2026-10-15'),
	(198, 1, 7, 2, 6, NULL, NULL, NULL, false, '2026-10-15'),
	(202, 1, 7, 3, 4, NULL, NULL, NULL, false, '2026-10-16'),
	(203, 1, 7, 3, 5, NULL, NULL, NULL, false, '2026-10-16'),
	(204, 1, 7, 3, 6, NULL, NULL, NULL, false, '2026-10-16'),
	(205, 1, 7, 4, 1, NULL, NULL, NULL, false, '2026-10-17'),
	(206, 1, 7, 4, 2, NULL, NULL, NULL, false, '2026-10-17'),
	(207, 1, 7, 4, 3, NULL, NULL, NULL, false, '2026-10-17'),
	(208, 1, 7, 4, 4, NULL, NULL, NULL, false, '2026-10-17'),
	(209, 1, 7, 4, 5, NULL, NULL, NULL, false, '2026-10-17'),
	(210, 1, 7, 4, 6, NULL, NULL, NULL, false, '2026-10-17'),
	(214, 1, 8, 0, 4, NULL, NULL, NULL, false, '2026-10-20'),
	(215, 1, 8, 0, 5, NULL, NULL, NULL, false, '2026-10-20'),
	(216, 1, 8, 0, 6, NULL, NULL, NULL, false, '2026-10-20'),
	(220, 1, 8, 1, 4, NULL, NULL, NULL, false, '2026-10-21'),
	(221, 1, 8, 1, 5, NULL, NULL, NULL, false, '2026-10-21'),
	(222, 1, 8, 1, 6, NULL, NULL, NULL, false, '2026-10-21'),
	(226, 1, 8, 2, 4, NULL, NULL, NULL, false, '2026-10-22'),
	(227, 1, 8, 2, 5, NULL, NULL, NULL, false, '2026-10-22'),
	(228, 1, 8, 2, 6, NULL, NULL, NULL, false, '2026-10-22'),
	(232, 1, 8, 3, 4, NULL, NULL, NULL, false, '2026-10-23'),
	(233, 1, 8, 3, 5, NULL, NULL, NULL, false, '2026-10-23'),
	(234, 1, 8, 3, 6, NULL, NULL, NULL, false, '2026-10-23'),
	(235, 1, 8, 4, 1, NULL, NULL, NULL, false, '2026-10-24'),
	(236, 1, 8, 4, 2, NULL, NULL, NULL, false, '2026-10-24'),
	(237, 1, 8, 4, 3, NULL, NULL, NULL, false, '2026-10-24'),
	(238, 1, 8, 4, 4, NULL, NULL, NULL, false, '2026-10-24'),
	(239, 1, 8, 4, 5, NULL, NULL, NULL, false, '2026-10-24'),
	(240, 1, 8, 4, 6, NULL, NULL, NULL, false, '2026-10-24'),
	(244, 1, 9, 0, 4, NULL, NULL, NULL, false, '2026-10-27'),
	(245, 1, 9, 0, 5, NULL, NULL, NULL, false, '2026-10-27'),
	(246, 1, 9, 0, 6, NULL, NULL, NULL, false, '2026-10-27'),
	(250, 1, 9, 1, 4, NULL, NULL, NULL, false, '2026-10-28'),
	(251, 1, 9, 1, 5, NULL, NULL, NULL, false, '2026-10-28'),
	(252, 1, 9, 1, 6, NULL, NULL, NULL, false, '2026-10-28'),
	(256, 1, 9, 2, 4, NULL, NULL, NULL, false, '2026-10-29'),
	(257, 1, 9, 2, 5, NULL, NULL, NULL, false, '2026-10-29'),
	(258, 1, 9, 2, 6, NULL, NULL, NULL, false, '2026-10-29'),
	(262, 1, 9, 3, 4, NULL, NULL, NULL, false, '2026-10-30'),
	(263, 1, 9, 3, 5, NULL, NULL, NULL, false, '2026-10-30'),
	(264, 1, 9, 3, 6, NULL, NULL, NULL, false, '2026-10-30'),
	(265, 1, 9, 4, 1, NULL, NULL, NULL, false, '2026-10-31'),
	(266, 1, 9, 4, 2, NULL, NULL, NULL, false, '2026-10-31'),
	(267, 1, 9, 4, 3, NULL, NULL, NULL, false, '2026-10-31'),
	(268, 1, 9, 4, 4, NULL, NULL, NULL, false, '2026-10-31'),
	(269, 1, 9, 4, 5, NULL, NULL, NULL, false, '2026-10-31'),
	(270, 1, 9, 4, 6, NULL, NULL, NULL, false, '2026-10-31'),
	(274, 1, 10, 0, 4, NULL, NULL, NULL, false, '2026-11-03'),
	(275, 1, 10, 0, 5, NULL, NULL, NULL, false, '2026-11-03'),
	(276, 1, 10, 0, 6, NULL, NULL, NULL, false, '2026-11-03'),
	(280, 1, 10, 1, 4, NULL, NULL, NULL, false, '2026-11-04'),
	(281, 1, 10, 1, 5, NULL, NULL, NULL, false, '2026-11-04'),
	(282, 1, 10, 1, 6, NULL, NULL, NULL, false, '2026-11-04'),
	(286, 1, 10, 2, 4, NULL, NULL, NULL, false, '2026-11-05'),
	(287, 1, 10, 2, 5, NULL, NULL, NULL, false, '2026-11-05'),
	(288, 1, 10, 2, 6, NULL, NULL, NULL, false, '2026-11-05'),
	(292, 1, 10, 3, 4, NULL, NULL, NULL, false, '2026-11-06'),
	(293, 1, 10, 3, 5, NULL, NULL, NULL, false, '2026-11-06'),
	(294, 1, 10, 3, 6, NULL, NULL, NULL, false, '2026-11-06'),
	(295, 1, 10, 4, 1, NULL, NULL, NULL, false, '2026-11-07'),
	(296, 1, 10, 4, 2, NULL, NULL, NULL, false, '2026-11-07'),
	(297, 1, 10, 4, 3, NULL, NULL, NULL, false, '2026-11-07'),
	(298, 1, 10, 4, 4, NULL, NULL, NULL, false, '2026-11-07'),
	(299, 1, 10, 4, 5, NULL, NULL, NULL, false, '2026-11-07'),
	(300, 1, 10, 4, 6, NULL, NULL, NULL, false, '2026-11-07'),
	(304, 1, 11, 0, 4, NULL, NULL, NULL, false, '2026-11-10'),
	(305, 1, 11, 0, 5, NULL, NULL, NULL, false, '2026-11-10'),
	(306, 1, 11, 0, 6, NULL, NULL, NULL, false, '2026-11-10'),
	(310, 1, 11, 1, 4, NULL, NULL, NULL, false, '2026-11-11'),
	(311, 1, 11, 1, 5, NULL, NULL, NULL, false, '2026-11-11'),
	(312, 1, 11, 1, 6, NULL, NULL, NULL, false, '2026-11-11'),
	(316, 1, 11, 2, 4, NULL, NULL, NULL, false, '2026-11-12'),
	(317, 1, 11, 2, 5, NULL, NULL, NULL, false, '2026-11-12'),
	(318, 1, 11, 2, 6, NULL, NULL, NULL, false, '2026-11-12'),
	(322, 1, 11, 3, 4, NULL, NULL, NULL, false, '2026-11-13'),
	(323, 1, 11, 3, 5, NULL, NULL, NULL, false, '2026-11-13'),
	(324, 1, 11, 3, 6, NULL, NULL, NULL, false, '2026-11-13'),
	(325, 1, 11, 4, 1, NULL, NULL, NULL, false, '2026-11-14'),
	(326, 1, 11, 4, 2, NULL, NULL, NULL, false, '2026-11-14'),
	(327, 1, 11, 4, 3, NULL, NULL, NULL, false, '2026-11-14'),
	(328, 1, 11, 4, 4, NULL, NULL, NULL, false, '2026-11-14'),
	(329, 1, 11, 4, 5, NULL, NULL, NULL, false, '2026-11-14'),
	(330, 1, 11, 4, 6, NULL, NULL, NULL, false, '2026-11-14'),
	(334, 1, 12, 0, 4, NULL, NULL, NULL, false, '2026-11-17'),
	(335, 1, 12, 0, 5, NULL, NULL, NULL, false, '2026-11-17'),
	(336, 1, 12, 0, 6, NULL, NULL, NULL, false, '2026-11-17'),
	(340, 1, 12, 1, 4, NULL, NULL, NULL, false, '2026-11-18'),
	(341, 1, 12, 1, 5, NULL, NULL, NULL, false, '2026-11-18'),
	(342, 1, 12, 1, 6, NULL, NULL, NULL, false, '2026-11-18'),
	(346, 1, 12, 2, 4, NULL, NULL, NULL, false, '2026-11-19'),
	(347, 1, 12, 2, 5, NULL, NULL, NULL, false, '2026-11-19'),
	(348, 1, 12, 2, 6, NULL, NULL, NULL, false, '2026-11-19'),
	(352, 1, 12, 3, 4, NULL, NULL, NULL, false, '2026-11-20'),
	(353, 1, 12, 3, 5, NULL, NULL, NULL, false, '2026-11-20'),
	(354, 1, 12, 3, 6, NULL, NULL, NULL, false, '2026-11-20'),
	(355, 1, 12, 4, 1, NULL, NULL, NULL, false, '2026-11-21'),
	(356, 1, 12, 4, 2, NULL, NULL, NULL, false, '2026-11-21'),
	(357, 1, 12, 4, 3, NULL, NULL, NULL, false, '2026-11-21'),
	(358, 1, 12, 4, 4, NULL, NULL, NULL, false, '2026-11-21'),
	(359, 1, 12, 4, 5, NULL, NULL, NULL, false, '2026-11-21'),
	(360, 1, 12, 4, 6, NULL, NULL, NULL, false, '2026-11-21'),
	(364, 1, 13, 0, 4, NULL, NULL, NULL, false, '2026-11-24'),
	(365, 1, 13, 0, 5, NULL, NULL, NULL, false, '2026-11-24'),
	(366, 1, 13, 0, 6, NULL, NULL, NULL, false, '2026-11-24'),
	(370, 1, 13, 1, 4, NULL, NULL, NULL, false, '2026-11-25'),
	(371, 1, 13, 1, 5, NULL, NULL, NULL, false, '2026-11-25'),
	(372, 1, 13, 1, 6, NULL, NULL, NULL, false, '2026-11-25'),
	(376, 1, 13, 2, 4, NULL, NULL, NULL, false, '2026-11-26'),
	(377, 1, 13, 2, 5, NULL, NULL, NULL, false, '2026-11-26'),
	(378, 1, 13, 2, 6, NULL, NULL, NULL, false, '2026-11-26'),
	(382, 1, 13, 3, 4, NULL, NULL, NULL, false, '2026-11-27'),
	(383, 1, 13, 3, 5, NULL, NULL, NULL, false, '2026-11-27'),
	(384, 1, 13, 3, 6, NULL, NULL, NULL, false, '2026-11-27'),
	(385, 1, 13, 4, 1, NULL, NULL, NULL, false, '2026-11-28'),
	(386, 1, 13, 4, 2, NULL, NULL, NULL, false, '2026-11-28'),
	(387, 1, 13, 4, 3, NULL, NULL, NULL, false, '2026-11-28'),
	(388, 1, 13, 4, 4, NULL, NULL, NULL, false, '2026-11-28'),
	(389, 1, 13, 4, 5, NULL, NULL, NULL, false, '2026-11-28'),
	(390, 1, 13, 4, 6, NULL, NULL, NULL, false, '2026-11-28'),
	(394, 1, 14, 0, 4, NULL, NULL, NULL, false, '2026-12-01'),
	(395, 1, 14, 0, 5, NULL, NULL, NULL, false, '2026-12-01'),
	(396, 1, 14, 0, 6, NULL, NULL, NULL, false, '2026-12-01'),
	(400, 1, 14, 1, 4, NULL, NULL, NULL, false, '2026-12-02'),
	(401, 1, 14, 1, 5, NULL, NULL, NULL, false, '2026-12-02'),
	(402, 1, 14, 1, 6, NULL, NULL, NULL, false, '2026-12-02'),
	(406, 1, 14, 2, 4, NULL, NULL, NULL, false, '2026-12-03'),
	(407, 1, 14, 2, 5, NULL, NULL, NULL, false, '2026-12-03'),
	(408, 1, 14, 2, 6, NULL, NULL, NULL, false, '2026-12-03'),
	(412, 1, 14, 3, 4, NULL, NULL, NULL, false, '2026-12-04'),
	(413, 1, 14, 3, 5, NULL, NULL, NULL, false, '2026-12-04'),
	(414, 1, 14, 3, 6, NULL, NULL, NULL, false, '2026-12-04'),
	(415, 1, 14, 4, 1, NULL, NULL, NULL, false, '2026-12-05'),
	(416, 1, 14, 4, 2, NULL, NULL, NULL, false, '2026-12-05'),
	(417, 1, 14, 4, 3, NULL, NULL, NULL, false, '2026-12-05'),
	(418, 1, 14, 4, 4, NULL, NULL, NULL, false, '2026-12-05'),
	(419, 1, 14, 4, 5, NULL, NULL, NULL, false, '2026-12-05'),
	(420, 1, 14, 4, 6, NULL, NULL, NULL, false, '2026-12-05'),
	(424, 1, 15, 0, 4, NULL, NULL, NULL, false, '2026-12-08'),
	(425, 1, 15, 0, 5, NULL, NULL, NULL, false, '2026-12-08'),
	(426, 1, 15, 0, 6, NULL, NULL, NULL, false, '2026-12-08'),
	(430, 1, 15, 1, 4, NULL, NULL, NULL, false, '2026-12-09'),
	(431, 1, 15, 1, 5, NULL, NULL, NULL, false, '2026-12-09'),
	(432, 1, 15, 1, 6, NULL, NULL, NULL, false, '2026-12-09'),
	(436, 1, 15, 2, 4, NULL, NULL, NULL, false, '2026-12-10'),
	(437, 1, 15, 2, 5, NULL, NULL, NULL, false, '2026-12-10'),
	(438, 1, 15, 2, 6, NULL, NULL, NULL, false, '2026-12-10'),
	(442, 1, 15, 3, 4, NULL, NULL, NULL, false, '2026-12-11'),
	(443, 1, 15, 3, 5, NULL, NULL, NULL, false, '2026-12-11'),
	(444, 1, 15, 3, 6, NULL, NULL, NULL, false, '2026-12-11'),
	(445, 1, 15, 4, 1, NULL, NULL, NULL, false, '2026-12-12'),
	(446, 1, 15, 4, 2, NULL, NULL, NULL, false, '2026-12-12'),
	(447, 1, 15, 4, 3, NULL, NULL, NULL, false, '2026-12-12'),
	(448, 1, 15, 4, 4, NULL, NULL, NULL, false, '2026-12-12'),
	(449, 1, 15, 4, 5, NULL, NULL, NULL, false, '2026-12-12'),
	(450, 1, 15, 4, 6, NULL, NULL, NULL, false, '2026-12-12'),
	(454, 1, 16, 0, 4, NULL, NULL, NULL, false, '2026-12-15'),
	(455, 1, 16, 0, 5, NULL, NULL, NULL, false, '2026-12-15'),
	(456, 1, 16, 0, 6, NULL, NULL, NULL, false, '2026-12-15'),
	(460, 1, 16, 1, 4, NULL, NULL, NULL, false, '2026-12-16'),
	(461, 1, 16, 1, 5, NULL, NULL, NULL, false, '2026-12-16'),
	(462, 1, 16, 1, 6, NULL, NULL, NULL, false, '2026-12-16'),
	(466, 1, 16, 2, 4, NULL, NULL, NULL, false, '2026-12-17'),
	(467, 1, 16, 2, 5, NULL, NULL, NULL, false, '2026-12-17'),
	(468, 1, 16, 2, 6, NULL, NULL, NULL, false, '2026-12-17'),
	(472, 1, 16, 3, 4, NULL, NULL, NULL, false, '2026-12-18'),
	(473, 1, 16, 3, 5, NULL, NULL, NULL, false, '2026-12-18'),
	(474, 1, 16, 3, 6, NULL, NULL, NULL, false, '2026-12-18'),
	(475, 1, 16, 4, 1, NULL, NULL, NULL, false, '2026-12-19'),
	(476, 1, 16, 4, 2, NULL, NULL, NULL, false, '2026-12-19'),
	(477, 1, 16, 4, 3, NULL, NULL, NULL, false, '2026-12-19'),
	(478, 1, 16, 4, 4, NULL, NULL, NULL, false, '2026-12-19'),
	(479, 1, 16, 4, 5, NULL, NULL, NULL, false, '2026-12-19'),
	(480, 1, 16, 4, 6, NULL, NULL, NULL, false, '2026-12-19'),
	(484, 1, 17, 0, 4, NULL, NULL, NULL, false, '2026-12-22'),
	(485, 1, 17, 0, 5, NULL, NULL, NULL, false, '2026-12-22'),
	(486, 1, 17, 0, 6, NULL, NULL, NULL, false, '2026-12-22'),
	(490, 1, 17, 1, 4, NULL, NULL, NULL, false, '2026-12-23'),
	(491, 1, 17, 1, 5, NULL, NULL, NULL, false, '2026-12-23'),
	(492, 1, 17, 1, 6, NULL, NULL, NULL, false, '2026-12-23'),
	(496, 1, 17, 2, 4, NULL, NULL, NULL, false, '2026-12-24'),
	(497, 1, 17, 2, 5, NULL, NULL, NULL, false, '2026-12-24'),
	(498, 1, 17, 2, 6, NULL, NULL, NULL, false, '2026-12-24'),
	(502, 1, 17, 3, 4, NULL, NULL, NULL, false, '2026-12-25'),
	(503, 1, 17, 3, 5, NULL, NULL, NULL, false, '2026-12-25'),
	(504, 1, 17, 3, 6, NULL, NULL, NULL, false, '2026-12-25'),
	(505, 1, 17, 4, 1, NULL, NULL, NULL, false, '2026-12-26'),
	(506, 1, 17, 4, 2, NULL, NULL, NULL, false, '2026-12-26'),
	(507, 1, 17, 4, 3, NULL, NULL, NULL, false, '2026-12-26'),
	(508, 1, 17, 4, 4, NULL, NULL, NULL, false, '2026-12-26'),
	(509, 1, 17, 4, 5, NULL, NULL, NULL, false, '2026-12-26'),
	(510, 1, 17, 4, 6, NULL, NULL, NULL, false, '2026-12-26'),
	(514, 1, 18, 0, 4, NULL, NULL, NULL, false, '2026-12-29'),
	(515, 1, 18, 0, 5, NULL, NULL, NULL, false, '2026-12-29'),
	(516, 1, 18, 0, 6, NULL, NULL, NULL, false, '2026-12-29'),
	(520, 1, 18, 1, 4, NULL, NULL, NULL, false, '2026-12-30'),
	(521, 1, 18, 1, 5, NULL, NULL, NULL, false, '2026-12-30'),
	(522, 1, 18, 1, 6, NULL, NULL, NULL, false, '2026-12-30'),
	(526, 1, 18, 2, 4, NULL, NULL, NULL, false, '2026-12-31'),
	(527, 1, 18, 2, 5, NULL, NULL, NULL, false, '2026-12-31'),
	(528, 1, 18, 2, 6, NULL, NULL, NULL, false, '2026-12-31'),
	(532, 1, 18, 3, 4, NULL, NULL, NULL, false, '2027-01-01'),
	(533, 1, 18, 3, 5, NULL, NULL, NULL, false, '2027-01-01'),
	(534, 1, 18, 3, 6, NULL, NULL, NULL, false, '2027-01-01'),
	(535, 1, 18, 4, 1, NULL, NULL, NULL, false, '2027-01-02'),
	(536, 1, 18, 4, 2, NULL, NULL, NULL, false, '2027-01-02'),
	(537, 1, 18, 4, 3, NULL, NULL, NULL, false, '2027-01-02'),
	(538, 1, 18, 4, 4, NULL, NULL, NULL, false, '2027-01-02'),
	(539, 1, 18, 4, 5, NULL, NULL, NULL, false, '2027-01-02'),
	(540, 1, 18, 4, 6, NULL, NULL, NULL, false, '2027-01-02'),
	(544, 1, 19, 0, 4, NULL, NULL, NULL, false, '2027-01-05'),
	(545, 1, 19, 0, 5, NULL, NULL, NULL, false, '2027-01-05'),
	(546, 1, 19, 0, 6, NULL, NULL, NULL, false, '2027-01-05'),
	(550, 1, 19, 1, 4, NULL, NULL, NULL, false, '2027-01-06'),
	(551, 1, 19, 1, 5, NULL, NULL, NULL, false, '2027-01-06'),
	(552, 1, 19, 1, 6, NULL, NULL, NULL, false, '2027-01-06'),
	(556, 1, 19, 2, 4, NULL, NULL, NULL, false, '2027-01-07'),
	(557, 1, 19, 2, 5, NULL, NULL, NULL, false, '2027-01-07'),
	(558, 1, 19, 2, 6, NULL, NULL, NULL, false, '2027-01-07'),
	(562, 1, 19, 3, 4, NULL, NULL, NULL, false, '2027-01-08'),
	(563, 1, 19, 3, 5, NULL, NULL, NULL, false, '2027-01-08'),
	(564, 1, 19, 3, 6, NULL, NULL, NULL, false, '2027-01-08'),
	(565, 1, 19, 4, 1, NULL, NULL, NULL, false, '2027-01-09'),
	(566, 1, 19, 4, 2, NULL, NULL, NULL, false, '2027-01-09'),
	(567, 1, 19, 4, 3, NULL, NULL, NULL, false, '2027-01-09'),
	(568, 1, 19, 4, 4, NULL, NULL, NULL, false, '2027-01-09'),
	(569, 1, 19, 4, 5, NULL, NULL, NULL, false, '2027-01-09'),
	(570, 1, 19, 4, 6, NULL, NULL, NULL, false, '2027-01-09'),
	(571, 1, 20, 0, 1, NULL, NULL, NULL, true, '2027-01-12'),
	(572, 1, 20, 0, 2, NULL, NULL, NULL, true, '2027-01-12'),
	(573, 1, 20, 0, 3, NULL, NULL, NULL, true, '2027-01-12'),
	(574, 1, 20, 0, 4, NULL, NULL, NULL, true, '2027-01-12'),
	(575, 1, 20, 0, 5, NULL, NULL, NULL, true, '2027-01-12'),
	(576, 1, 20, 0, 6, NULL, NULL, NULL, true, '2027-01-12'),
	(577, 1, 20, 1, 1, NULL, NULL, NULL, true, '2027-01-13'),
	(578, 1, 20, 1, 2, NULL, NULL, NULL, true, '2027-01-13'),
	(579, 1, 20, 1, 3, NULL, NULL, NULL, true, '2027-01-13'),
	(580, 1, 20, 1, 4, NULL, NULL, NULL, true, '2027-01-13'),
	(581, 1, 20, 1, 5, NULL, NULL, NULL, true, '2027-01-13'),
	(582, 1, 20, 1, 6, NULL, NULL, NULL, true, '2027-01-13'),
	(583, 1, 20, 2, 1, NULL, NULL, NULL, true, '2027-01-14'),
	(584, 1, 20, 2, 2, NULL, NULL, NULL, true, '2027-01-14'),
	(585, 1, 20, 2, 3, NULL, NULL, NULL, true, '2027-01-14'),
	(586, 1, 20, 2, 4, NULL, NULL, NULL, true, '2027-01-14'),
	(587, 1, 20, 2, 5, NULL, NULL, NULL, true, '2027-01-14'),
	(588, 1, 20, 2, 6, NULL, NULL, NULL, true, '2027-01-14'),
	(589, 1, 20, 3, 1, NULL, NULL, NULL, true, '2027-01-15'),
	(590, 1, 20, 3, 2, NULL, NULL, NULL, true, '2027-01-15'),
	(591, 1, 20, 3, 3, NULL, NULL, NULL, true, '2027-01-15'),
	(592, 1, 20, 3, 4, NULL, NULL, NULL, true, '2027-01-15'),
	(593, 1, 20, 3, 5, NULL, NULL, NULL, true, '2027-01-15'),
	(594, 1, 20, 3, 6, NULL, NULL, NULL, true, '2027-01-15'),
	(595, 1, 20, 4, 1, NULL, NULL, NULL, true, '2027-01-16'),
	(596, 1, 20, 4, 2, NULL, NULL, NULL, true, '2027-01-16'),
	(597, 1, 20, 4, 3, NULL, NULL, NULL, true, '2027-01-16'),
	(598, 1, 20, 4, 4, NULL, NULL, NULL, true, '2027-01-16'),
	(599, 1, 20, 4, 5, NULL, NULL, NULL, true, '2027-01-16'),
	(600, 1, 20, 4, 6, NULL, NULL, NULL, true, '2027-01-16'),
	(601, 1, 21, 0, 1, NULL, NULL, NULL, true, '2027-01-19'),
	(602, 1, 21, 0, 2, NULL, NULL, NULL, true, '2027-01-19'),
	(603, 1, 21, 0, 3, NULL, NULL, NULL, true, '2027-01-19'),
	(604, 1, 21, 0, 4, NULL, NULL, NULL, true, '2027-01-19'),
	(605, 1, 21, 0, 5, NULL, NULL, NULL, true, '2027-01-19'),
	(606, 1, 21, 0, 6, NULL, NULL, NULL, true, '2027-01-19'),
	(607, 1, 21, 1, 1, NULL, NULL, NULL, true, '2027-01-20'),
	(608, 1, 21, 1, 2, NULL, NULL, NULL, true, '2027-01-20'),
	(609, 1, 21, 1, 3, NULL, NULL, NULL, true, '2027-01-20'),
	(610, 1, 21, 1, 4, NULL, NULL, NULL, true, '2027-01-20'),
	(611, 1, 21, 1, 5, NULL, NULL, NULL, true, '2027-01-20'),
	(612, 1, 21, 1, 6, NULL, NULL, NULL, true, '2027-01-20'),
	(613, 1, 21, 2, 1, NULL, NULL, NULL, true, '2027-01-21'),
	(614, 1, 21, 2, 2, NULL, NULL, NULL, true, '2027-01-21'),
	(615, 1, 21, 2, 3, NULL, NULL, NULL, true, '2027-01-21'),
	(616, 1, 21, 2, 4, NULL, NULL, NULL, true, '2027-01-21'),
	(617, 1, 21, 2, 5, NULL, NULL, NULL, true, '2027-01-21'),
	(618, 1, 21, 2, 6, NULL, NULL, NULL, true, '2027-01-21'),
	(619, 1, 21, 3, 1, NULL, NULL, NULL, true, '2027-01-22'),
	(620, 1, 21, 3, 2, NULL, NULL, NULL, true, '2027-01-22'),
	(621, 1, 21, 3, 3, NULL, NULL, NULL, true, '2027-01-22'),
	(622, 1, 21, 3, 4, NULL, NULL, NULL, true, '2027-01-22'),
	(623, 1, 21, 3, 5, NULL, NULL, NULL, true, '2027-01-22'),
	(624, 1, 21, 3, 6, NULL, NULL, NULL, true, '2027-01-22'),
	(625, 1, 21, 4, 1, NULL, NULL, NULL, true, '2027-01-23'),
	(626, 1, 21, 4, 2, NULL, NULL, NULL, true, '2027-01-23'),
	(627, 1, 21, 4, 3, NULL, NULL, NULL, true, '2027-01-23'),
	(628, 1, 21, 4, 4, NULL, NULL, NULL, true, '2027-01-23'),
	(629, 1, 21, 4, 5, NULL, NULL, NULL, true, '2027-01-23'),
	(630, 1, 21, 4, 6, NULL, NULL, NULL, true, '2027-01-23'),
	(631, 1, 22, 0, 1, NULL, NULL, NULL, true, '2027-01-26'),
	(632, 1, 22, 0, 2, NULL, NULL, NULL, true, '2027-01-26'),
	(633, 1, 22, 0, 3, NULL, NULL, NULL, true, '2027-01-26'),
	(634, 1, 22, 0, 4, NULL, NULL, NULL, true, '2027-01-26'),
	(635, 1, 22, 0, 5, NULL, NULL, NULL, true, '2027-01-26'),
	(636, 1, 22, 0, 6, NULL, NULL, NULL, true, '2027-01-26'),
	(637, 1, 22, 1, 1, NULL, NULL, NULL, true, '2027-01-27'),
	(638, 1, 22, 1, 2, NULL, NULL, NULL, true, '2027-01-27'),
	(639, 1, 22, 1, 3, NULL, NULL, NULL, true, '2027-01-27'),
	(640, 1, 22, 1, 4, NULL, NULL, NULL, true, '2027-01-27'),
	(641, 1, 22, 1, 5, NULL, NULL, NULL, true, '2027-01-27'),
	(642, 1, 22, 1, 6, NULL, NULL, NULL, true, '2027-01-27'),
	(643, 1, 22, 2, 1, NULL, NULL, NULL, true, '2027-01-28'),
	(644, 1, 22, 2, 2, NULL, NULL, NULL, true, '2027-01-28'),
	(645, 1, 22, 2, 3, NULL, NULL, NULL, true, '2027-01-28'),
	(646, 1, 22, 2, 4, NULL, NULL, NULL, true, '2027-01-28'),
	(647, 1, 22, 2, 5, NULL, NULL, NULL, true, '2027-01-28'),
	(648, 1, 22, 2, 6, NULL, NULL, NULL, true, '2027-01-28'),
	(649, 1, 22, 3, 1, NULL, NULL, NULL, true, '2027-01-29'),
	(650, 1, 22, 3, 2, NULL, NULL, NULL, true, '2027-01-29'),
	(651, 1, 22, 3, 3, NULL, NULL, NULL, true, '2027-01-29'),
	(652, 1, 22, 3, 4, NULL, NULL, NULL, true, '2027-01-29'),
	(653, 1, 22, 3, 5, NULL, NULL, NULL, true, '2027-01-29'),
	(654, 1, 22, 3, 6, NULL, NULL, NULL, true, '2027-01-29'),
	(655, 1, 22, 4, 1, NULL, NULL, NULL, true, '2027-01-30'),
	(656, 1, 22, 4, 2, NULL, NULL, NULL, true, '2027-01-30'),
	(657, 1, 22, 4, 3, NULL, NULL, NULL, true, '2027-01-30'),
	(658, 1, 22, 4, 4, NULL, NULL, NULL, true, '2027-01-30'),
	(659, 1, 22, 4, 5, NULL, NULL, NULL, true, '2027-01-30'),
	(660, 1, 22, 4, 6, NULL, NULL, NULL, true, '2027-01-30'),
	(3, 1, 1, 0, 3, NULL, NULL, NULL, false, '2026-09-01'),
	(13, 1, 1, 2, 1, NULL, NULL, NULL, false, '2026-09-03'),
	(14, 1, 1, 2, 2, NULL, NULL, NULL, false, '2026-09-03'),
	(19, 1, 1, 3, 1, NULL, NULL, NULL, false, '2026-09-04'),
	(21, 1, 1, 3, 3, NULL, NULL, NULL, false, '2026-09-04'),
	(31, 1, 2, 0, 1, NULL, NULL, NULL, false, '2026-09-08'),
	(32, 1, 2, 0, 2, NULL, NULL, NULL, false, '2026-09-08'),
	(37, 1, 2, 1, 1, NULL, NULL, NULL, false, '2026-09-09'),
	(33, 1, 2, 0, 3, 3, 3, '#368ffc', false, '2026-09-08'),
	(43, 1, 2, 2, 1, NULL, NULL, NULL, false, '2026-09-10'),
	(50, 1, 2, 3, 2, NULL, NULL, NULL, false, '2026-09-11'),
	(51, 1, 2, 3, 3, NULL, NULL, NULL, false, '2026-09-11'),
	(61, 1, 3, 0, 1, NULL, NULL, NULL, false, '2026-09-15'),
	(67, 1, 3, 1, 1, NULL, NULL, NULL, false, '2026-09-16'),
	(68, 1, 3, 1, 2, NULL, NULL, NULL, false, '2026-09-16'),
	(69, 1, 3, 1, 3, NULL, NULL, NULL, false, '2026-09-16'),
	(73, 1, 3, 2, 1, NULL, NULL, NULL, false, '2026-09-17'),
	(74, 1, 3, 2, 2, NULL, NULL, NULL, false, '2026-09-17'),
	(109, 1, 4, 3, 1, 3, 3, '#368ffc', false, '2026-09-25'),
	(91, 1, 4, 0, 1, NULL, NULL, NULL, false, '2026-09-22'),
	(92, 1, 4, 0, 2, NULL, NULL, NULL, false, '2026-09-22'),
	(97, 1, 4, 1, 1, NULL, NULL, NULL, false, '2026-09-23'),
	(98, 1, 4, 1, 2, NULL, NULL, NULL, false, '2026-09-23'),
	(103, 1, 4, 2, 1, NULL, NULL, NULL, false, '2026-09-24'),
	(111, 1, 4, 3, 3, NULL, NULL, NULL, false, '2026-09-25'),
	(122, 1, 5, 0, 2, NULL, NULL, NULL, false, '2026-09-29'),
	(123, 1, 5, 0, 3, NULL, NULL, NULL, false, '2026-09-29'),
	(127, 1, 5, 1, 1, NULL, NULL, NULL, false, '2026-09-30'),
	(99, 1, 4, 1, 3, 3, 3, '#368ffc', false, '2026-09-23'),
	(139, 1, 5, 3, 1, NULL, NULL, NULL, false, '2026-10-02'),
	(140, 1, 5, 3, 2, NULL, NULL, NULL, false, '2026-10-02'),
	(141, 1, 5, 3, 3, NULL, NULL, NULL, false, '2026-10-02'),
	(153, 1, 6, 0, 3, NULL, NULL, NULL, false, '2026-10-06'),
	(157, 1, 6, 1, 1, NULL, NULL, NULL, false, '2026-10-07'),
	(159, 1, 6, 1, 3, NULL, NULL, NULL, false, '2026-10-07'),
	(163, 1, 6, 2, 1, NULL, NULL, NULL, false, '2026-10-08'),
	(165, 1, 6, 2, 3, NULL, NULL, NULL, false, '2026-10-08'),
	(169, 1, 6, 3, 1, NULL, NULL, NULL, false, '2026-10-09'),
	(170, 1, 6, 3, 2, NULL, NULL, NULL, false, '2026-10-09'),
	(171, 1, 6, 3, 3, NULL, NULL, NULL, false, '2026-10-09'),
	(181, 1, 7, 0, 1, NULL, NULL, NULL, false, '2026-10-13'),
	(182, 1, 7, 0, 2, NULL, NULL, NULL, false, '2026-10-13'),
	(187, 1, 7, 1, 1, NULL, NULL, NULL, false, '2026-10-14'),
	(188, 1, 7, 1, 2, NULL, NULL, NULL, false, '2026-10-14'),
	(189, 1, 7, 1, 3, NULL, NULL, NULL, false, '2026-10-14'),
	(194, 1, 7, 2, 2, NULL, NULL, NULL, false, '2026-10-15'),
	(199, 1, 7, 3, 1, NULL, NULL, NULL, false, '2026-10-16'),
	(201, 1, 7, 3, 3, NULL, NULL, NULL, false, '2026-10-16'),
	(211, 1, 8, 0, 1, NULL, NULL, NULL, false, '2026-10-20'),
	(217, 1, 8, 1, 1, NULL, NULL, NULL, false, '2026-10-21'),
	(218, 1, 8, 1, 2, NULL, NULL, NULL, false, '2026-10-21'),
	(219, 1, 8, 1, 3, NULL, NULL, NULL, false, '2026-10-21'),
	(133, 1, 5, 2, 1, 3, 3, '#368ffc', false, '2026-10-01'),
	(129, 1, 5, 1, 3, 3, 3, '#368ffc', false, '2026-09-30'),
	(8, 1, 1, 1, 2, 3, 3, '#368ffc', false, '2026-09-02'),
	(152, 1, 6, 0, 2, 3, 3, '#368ffc', false, '2026-10-06'),
	(213, 1, 8, 0, 3, 3, 3, '#368ffc', false, '2026-10-20'),
	(164, 1, 6, 2, 2, 3, 3, '#368ffc', false, '2026-10-08'),
	(93, 1, 4, 0, 3, 1, 1, '#ff3333', false, '2026-09-22'),
	(104, 1, 4, 2, 2, 1, 1, '#ff3333', false, '2026-09-24'),
	(128, 1, 5, 1, 2, 1, 1, '#ff3333', false, '2026-09-30'),
	(135, 1, 5, 2, 3, 1, 1, '#ff3333', false, '2026-10-01'),
	(212, 1, 8, 0, 2, 1, 1, '#ff3333', false, '2026-10-20'),
	(49, 1, 2, 3, 1, 1, 1, '#ff3333', false, '2026-09-11'),
	(45, 1, 2, 2, 3, 1, 1, '#ff3333', false, '2026-09-10'),
	(80, 1, 3, 3, 2, 1, 1, '#ff3333', false, '2026-09-18'),
	(200, 1, 7, 3, 2, 1, 1, '#ff3333', false, '2026-10-16'),
	(7, 1, 1, 1, 1, 1, 1, '#ff3333', false, '2026-09-02'),
	(183, 1, 7, 0, 3, 1, 1, '#ff3333', false, '2026-10-13'),
	(134, 1, 5, 2, 2, 2, 2, '#924fe3', false, '2026-10-01'),
	(39, 1, 2, 1, 3, 2, 2, '#924fe3', false, '2026-09-09'),
	(44, 1, 2, 2, 2, 2, 2, '#924fe3', false, '2026-09-10'),
	(15, 1, 1, 2, 3, 2, 2, '#924fe3', false, '2026-09-03'),
	(151, 1, 6, 0, 1, 2, 2, '#924fe3', false, '2026-10-06'),
	(79, 1, 3, 3, 1, 2, 2, '#924fe3', false, '2026-09-18'),
	(105, 1, 4, 2, 3, 2, 2, '#924fe3', false, '2026-09-24'),
	(110, 1, 4, 3, 2, 2, 2, '#924fe3', false, '2026-09-25'),
	(81, 1, 3, 3, 3, 2, 2, '#924fe3', false, '2026-09-18'),
	(158, 1, 6, 1, 2, 2, 2, '#924fe3', false, '2026-10-07'),
	(223, 1, 8, 2, 1, 2, 2, '#924fe3', false, '2026-10-22'),
	(1, 1, 1, 0, 1, NULL, NULL, NULL, false, '2026-09-01'),
	(434, 1, 15, 2, 2, 3, 3, '#368ffc', false, '2026-12-10'),
	(75, 1, 3, 2, 3, 3, 3, '#368ffc', false, '2026-09-17'),
	(38, 1, 2, 1, 2, 3, 3, '#368ffc', false, '2026-09-09'),
	(224, 1, 8, 2, 2, NULL, NULL, NULL, false, '2026-10-22'),
	(230, 1, 8, 3, 2, NULL, NULL, NULL, false, '2026-10-23'),
	(231, 1, 8, 3, 3, NULL, NULL, NULL, false, '2026-10-23'),
	(241, 1, 9, 0, 1, NULL, NULL, NULL, false, '2026-10-27'),
	(242, 1, 9, 0, 2, NULL, NULL, NULL, false, '2026-10-27'),
	(243, 1, 9, 0, 3, NULL, NULL, NULL, false, '2026-10-27'),
	(248, 1, 9, 1, 2, NULL, NULL, NULL, false, '2026-10-28'),
	(249, 1, 9, 1, 3, NULL, NULL, NULL, false, '2026-10-28'),
	(253, 1, 9, 2, 1, NULL, NULL, NULL, false, '2026-10-29'),
	(254, 1, 9, 2, 2, NULL, NULL, NULL, false, '2026-10-29'),
	(255, 1, 9, 2, 3, NULL, NULL, NULL, false, '2026-10-29'),
	(259, 1, 9, 3, 1, NULL, NULL, NULL, false, '2026-10-30'),
	(260, 1, 9, 3, 2, NULL, NULL, NULL, false, '2026-10-30'),
	(261, 1, 9, 3, 3, NULL, NULL, NULL, false, '2026-10-30'),
	(272, 1, 10, 0, 2, NULL, NULL, NULL, false, '2026-11-03'),
	(277, 1, 10, 1, 1, NULL, NULL, NULL, false, '2026-11-04'),
	(283, 1, 10, 2, 1, NULL, NULL, NULL, false, '2026-11-05'),
	(289, 1, 10, 3, 1, NULL, NULL, NULL, false, '2026-11-06'),
	(290, 1, 10, 3, 2, NULL, NULL, NULL, false, '2026-11-06'),
	(291, 1, 10, 3, 3, NULL, NULL, NULL, false, '2026-11-06'),
	(302, 1, 11, 0, 2, NULL, NULL, NULL, false, '2026-11-10'),
	(303, 1, 11, 0, 3, NULL, NULL, NULL, false, '2026-11-10'),
	(307, 1, 11, 1, 1, NULL, NULL, NULL, false, '2026-11-11'),
	(308, 1, 11, 1, 2, NULL, NULL, NULL, false, '2026-11-11'),
	(314, 1, 11, 2, 2, NULL, NULL, NULL, false, '2026-11-12'),
	(320, 1, 11, 3, 2, NULL, NULL, NULL, false, '2026-11-13'),
	(321, 1, 11, 3, 3, NULL, NULL, NULL, false, '2026-11-13'),
	(332, 1, 12, 0, 2, NULL, NULL, NULL, false, '2026-11-17'),
	(333, 1, 12, 0, 3, NULL, NULL, NULL, false, '2026-11-17'),
	(337, 1, 12, 1, 1, NULL, NULL, NULL, false, '2026-11-18'),
	(343, 1, 12, 2, 1, NULL, NULL, NULL, false, '2026-11-19'),
	(344, 1, 12, 2, 2, NULL, NULL, NULL, false, '2026-11-19'),
	(345, 1, 12, 2, 3, NULL, NULL, NULL, false, '2026-11-19'),
	(350, 1, 12, 3, 2, NULL, NULL, NULL, false, '2026-11-20'),
	(351, 1, 12, 3, 3, NULL, NULL, NULL, false, '2026-11-20'),
	(362, 1, 13, 0, 2, NULL, NULL, NULL, false, '2026-11-24'),
	(368, 1, 13, 1, 2, NULL, NULL, NULL, false, '2026-11-25'),
	(373, 1, 13, 2, 1, NULL, NULL, NULL, false, '2026-11-26'),
	(374, 1, 13, 2, 2, NULL, NULL, NULL, false, '2026-11-26'),
	(375, 1, 13, 2, 3, NULL, NULL, NULL, false, '2026-11-26'),
	(380, 1, 13, 3, 2, NULL, NULL, NULL, false, '2026-11-27'),
	(392, 1, 14, 0, 2, NULL, NULL, NULL, false, '2026-12-01'),
	(397, 1, 14, 1, 1, NULL, NULL, NULL, false, '2026-12-02'),
	(399, 1, 14, 1, 3, NULL, NULL, NULL, false, '2026-12-02'),
	(403, 1, 14, 2, 1, NULL, NULL, NULL, false, '2026-12-03'),
	(404, 1, 14, 2, 2, NULL, NULL, NULL, false, '2026-12-03'),
	(405, 1, 14, 2, 3, NULL, NULL, NULL, false, '2026-12-03'),
	(409, 1, 14, 3, 1, NULL, NULL, NULL, false, '2026-12-04'),
	(411, 1, 14, 3, 3, NULL, NULL, NULL, false, '2026-12-04'),
	(421, 1, 15, 0, 1, NULL, NULL, NULL, false, '2026-12-08'),
	(422, 1, 15, 0, 2, NULL, NULL, NULL, false, '2026-12-08'),
	(423, 1, 15, 0, 3, NULL, NULL, NULL, false, '2026-12-08'),
	(427, 1, 15, 1, 1, NULL, NULL, NULL, false, '2026-12-09'),
	(428, 1, 15, 1, 2, NULL, NULL, NULL, false, '2026-12-09'),
	(429, 1, 15, 1, 3, NULL, NULL, NULL, false, '2026-12-09'),
	(331, 1, 12, 0, 1, 3, 3, '#368ffc', false, '2026-11-17'),
	(435, 1, 15, 2, 3, NULL, NULL, NULL, false, '2026-12-10'),
	(439, 1, 15, 3, 1, NULL, NULL, NULL, false, '2026-12-11'),
	(452, 1, 16, 0, 2, NULL, NULL, NULL, false, '2026-12-15'),
	(453, 1, 16, 0, 3, NULL, NULL, NULL, false, '2026-12-15'),
	(433, 1, 15, 2, 1, 3, 3, '#368ffc', false, '2026-12-10'),
	(458, 1, 16, 1, 2, NULL, NULL, NULL, false, '2026-12-16'),
	(463, 1, 16, 2, 1, NULL, NULL, NULL, false, '2026-12-17'),
	(469, 1, 16, 3, 1, NULL, NULL, NULL, false, '2026-12-18'),
	(470, 1, 16, 3, 2, NULL, NULL, NULL, false, '2026-12-18'),
	(471, 1, 16, 3, 3, NULL, NULL, NULL, false, '2026-12-18'),
	(481, 1, 17, 0, 1, NULL, NULL, NULL, false, '2026-12-22'),
	(483, 1, 17, 0, 3, NULL, NULL, NULL, false, '2026-12-22'),
	(487, 1, 17, 1, 1, NULL, NULL, NULL, false, '2026-12-23'),
	(488, 1, 17, 1, 2, NULL, NULL, NULL, false, '2026-12-23'),
	(489, 1, 17, 1, 3, NULL, NULL, NULL, false, '2026-12-23'),
	(457, 1, 16, 1, 1, 3, 3, '#368ffc', false, '2026-12-16'),
	(363, 1, 13, 0, 3, 3, 3, '#368ffc', false, '2026-11-24'),
	(319, 1, 11, 3, 1, 3, 3, '#368ffc', false, '2026-11-13'),
	(482, 1, 17, 0, 2, 3, 3, '#368ffc', false, '2026-12-22'),
	(285, 1, 10, 2, 3, 3, 3, '#368ffc', false, '2026-11-05'),
	(391, 1, 14, 0, 1, 3, 3, '#368ffc', false, '2026-12-01'),
	(338, 1, 12, 1, 2, 3, 3, '#368ffc', false, '2026-11-18'),
	(369, 1, 13, 1, 3, 1, 1, '#ff3333', false, '2026-11-25'),
	(361, 1, 13, 0, 1, 1, 1, '#ff3333', false, '2026-11-24'),
	(465, 1, 16, 2, 3, 1, 1, '#ff3333', false, '2026-12-17'),
	(451, 1, 16, 0, 1, 1, 1, '#ff3333', false, '2026-12-15'),
	(440, 1, 15, 3, 2, 1, 1, '#ff3333', false, '2026-12-11'),
	(410, 1, 14, 3, 2, 1, 1, '#ff3333', false, '2026-12-04'),
	(225, 1, 8, 2, 3, 1, 1, '#ff3333', false, '2026-10-22'),
	(313, 1, 11, 2, 1, 1, 1, '#ff3333', false, '2026-11-12'),
	(273, 1, 10, 0, 3, 1, 1, '#ff3333', false, '2026-11-03'),
	(441, 1, 15, 3, 3, 1, 1, '#ff3333', false, '2026-12-11'),
	(349, 1, 12, 3, 1, 1, 1, '#ff3333', false, '2026-11-20'),
	(459, 1, 16, 1, 3, 2, 2, '#924fe3', false, '2026-12-16'),
	(379, 1, 13, 3, 1, 2, 2, '#924fe3', false, '2026-11-27'),
	(278, 1, 10, 1, 2, 2, 2, '#924fe3', false, '2026-11-04'),
	(271, 1, 10, 0, 1, 2, 2, '#924fe3', false, '2026-11-03'),
	(381, 1, 13, 3, 3, 2, 2, '#924fe3', false, '2026-11-27'),
	(393, 1, 14, 0, 3, 2, 2, '#924fe3', false, '2026-12-01'),
	(339, 1, 12, 1, 3, 2, 2, '#924fe3', false, '2026-11-18'),
	(229, 1, 8, 3, 1, 2, 2, '#924fe3', false, '2026-10-23'),
	(315, 1, 11, 2, 3, 2, 2, '#924fe3', false, '2026-11-12'),
	(494, 1, 17, 2, 2, NULL, NULL, NULL, false, '2026-12-24'),
	(495, 1, 17, 2, 3, NULL, NULL, NULL, false, '2026-12-24'),
	(500, 1, 17, 3, 2, NULL, NULL, NULL, false, '2026-12-25'),
	(501, 1, 17, 3, 3, NULL, NULL, NULL, false, '2026-12-25'),
	(511, 1, 18, 0, 1, NULL, NULL, NULL, false, '2026-12-29'),
	(512, 1, 18, 0, 2, NULL, NULL, NULL, false, '2026-12-29'),
	(513, 1, 18, 0, 3, NULL, NULL, NULL, false, '2026-12-29'),
	(517, 1, 18, 1, 1, NULL, NULL, NULL, false, '2026-12-30'),
	(518, 1, 18, 1, 2, NULL, NULL, NULL, false, '2026-12-30'),
	(524, 1, 18, 2, 2, NULL, NULL, NULL, false, '2026-12-31'),
	(525, 1, 18, 2, 3, NULL, NULL, NULL, false, '2026-12-31'),
	(529, 1, 18, 3, 1, NULL, NULL, NULL, false, '2027-01-01'),
	(561, 1, 19, 3, 3, 3, 3, '#368ffc', false, '2027-01-08'),
	(541, 1, 19, 0, 1, NULL, NULL, NULL, false, '2027-01-05'),
	(547, 1, 19, 1, 1, NULL, NULL, NULL, false, '2027-01-06'),
	(548, 1, 19, 1, 2, NULL, NULL, NULL, false, '2027-01-06'),
	(549, 1, 19, 1, 3, NULL, NULL, NULL, false, '2027-01-06'),
	(554, 1, 19, 2, 2, NULL, NULL, NULL, false, '2027-01-07'),
	(555, 1, 19, 2, 3, NULL, NULL, NULL, false, '2027-01-07'),
	(530, 1, 18, 3, 2, 3, 3, '#368ffc', false, '2027-01-01'),
	(559, 1, 19, 3, 1, 3, 3, '#368ffc', false, '2027-01-08'),
	(531, 1, 18, 3, 3, 3, 3, '#368ffc', false, '2027-01-01'),
	(553, 1, 19, 2, 1, 1, 1, '#ff3333', false, '2027-01-07'),
	(493, 1, 17, 2, 1, 1, 1, '#ff3333', false, '2026-12-24'),
	(543, 1, 19, 0, 3, 1, 1, '#ff3333', false, '2027-01-05'),
	(499, 1, 17, 3, 1, 2, 2, '#924fe3', false, '2026-12-25'),
	(542, 1, 19, 0, 2, 2, 2, '#924fe3', false, '2027-01-05'),
	(519, 1, 18, 1, 3, 2, 2, '#924fe3', false, '2026-12-30'),
	(560, 1, 19, 3, 2, 2, 2, '#924fe3', false, '2027-01-08'),
	(523, 1, 18, 2, 1, 2, 2, '#924fe3', false, '2026-12-31');


--
-- Data for Name: labs; Type: TABLE DATA; Schema: lab_services; Owner: postgres
--



--
-- Data for Name: computers; Type: TABLE DATA; Schema: lab_services; Owner: postgres
--



--
-- Data for Name: incidents; Type: TABLE DATA; Schema: lab_services; Owner: postgres
--



--
-- Data for Name: company; Type: TABLE DATA; Schema: practicas; Owner: postgres
--

INSERT INTO "practicas"."company" ("id", "profile_id", "name", "phone", "address", "municipality_id", "created_at", "updated_at") VALUES
	(1, '2a352e89-1ccf-47e0-bd9b-75069e0d0cf9', 'Nuevo Nombre Empresa', '999999999', 'Calle 1 entre A y B', 1, '2026-04-21 02:40:12.197+00', '2026-04-21 02:40:12.197+00');


--
-- Data for Name: agreement; Type: TABLE DATA; Schema: practicas; Owner: postgres
--

INSERT INTO "practicas"."agreement" ("id", "company_id", "type", "status", "title", "description", "specialty", "students_needed", "bank_problem_document", "approved_by_practices", "approved_by_prelocation", "created_at", "updated_at") VALUES
	(1, 1, 'PRACTICE', 'APPROVED', 'Convenio de Prácticas Informática', 'Convenio para prácticas profesionales en TI', 'Informática', 2, NULL, true, false, '2026-04-21 02:40:18.136+00', '2026-04-21 02:40:18.136+00'),
	(2, 1, 'BOTH', 'APPROVED', 'Convenio de Prueba', 'Descripción del convenio', 'Informática', 2, NULL, true, true, '2026-05-03 00:33:21.572+00', '2026-05-03 00:33:21.572+00');


--
-- Data for Name: prelocalization_call; Type: TABLE DATA; Schema: practicas; Owner: postgres
--



--
-- Data for Name: vacancy; Type: TABLE DATA; Schema: practicas; Owner: postgres
--

INSERT INTO "practicas"."vacancy" ("id", "agreement_id", "title", "specialty", "slots", "status", "created_at", "updated_at") VALUES
	(1, 1, 'Desarrollador Backend', 'Informática', 1, 'OPEN', '2026-04-21 02:40:22.337+00', '2026-04-21 02:40:22.337+00'),
	(2, 2, 'Desarrollador Backend', 'Contabilidad', 2, 'OPEN', '2026-05-03 01:28:17.88+00', '2026-05-03 01:28:17.88+00');


--
-- Data for Name: prelocalization_assignment; Type: TABLE DATA; Schema: practicas; Owner: postgres
--



--
-- Data for Name: prelocalization_ranking; Type: TABLE DATA; Schema: practicas; Owner: postgres
--



--
-- Data for Name: request; Type: TABLE DATA; Schema: practicas; Owner: postgres
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: careers_id_seq; Type: SEQUENCE SET; Schema: academico; Owner: postgres
--

SELECT pg_catalog.setval('"academico"."careers_id_seq"', 13, true);


--
-- Name: faculties_id_seq; Type: SEQUENCE SET; Schema: academico; Owner: postgres
--

SELECT pg_catalog.setval('"academico"."faculties_id_seq"', 1, false);


--
-- Name: municipalities_id_seq; Type: SEQUENCE SET; Schema: academico; Owner: postgres
--

SELECT pg_catalog.setval('"academico"."municipalities_id_seq"', 7, true);


--
-- Name: professors_id_seq; Type: SEQUENCE SET; Schema: academico; Owner: postgres
--

SELECT pg_catalog.setval('"academico"."professors_id_seq"', 1, false);


--
-- Name: students_id_seq; Type: SEQUENCE SET; Schema: academico; Owner: postgres
--

SELECT pg_catalog.setval('"academico"."students_id_seq"', 3, true);


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 77, true);


--
-- Name: asignatura_id_seq; Type: SEQUENCE SET; Schema: horarios; Owner: postgres
--

SELECT pg_catalog.setval('"horarios"."asignatura_id_seq"', 4, true);


--
-- Name: horario_general_id_seq; Type: SEQUENCE SET; Schema: horarios; Owner: postgres
--

SELECT pg_catalog.setval('"horarios"."horario_general_id_seq"', 1, true);


--
-- Name: horario_semanal_id_seq; Type: SEQUENCE SET; Schema: horarios; Owner: postgres
--

SELECT pg_catalog.setval('"horarios"."horario_semanal_id_seq"', 660, true);


--
-- Name: profesor_id_seq; Type: SEQUENCE SET; Schema: horarios; Owner: postgres
--

SELECT pg_catalog.setval('"horarios"."profesor_id_seq"', 3, true);


--
-- Name: turno_id_seq; Type: SEQUENCE SET; Schema: horarios; Owner: postgres
--

SELECT pg_catalog.setval('"horarios"."turno_id_seq"', 6, true);


--
-- Name: agreement_id_seq; Type: SEQUENCE SET; Schema: practicas; Owner: postgres
--

SELECT pg_catalog.setval('"practicas"."agreement_id_seq"', 2, true);


--
-- Name: company_id_seq; Type: SEQUENCE SET; Schema: practicas; Owner: postgres
--

SELECT pg_catalog.setval('"practicas"."company_id_seq"', 1, true);


--
-- Name: prelocalization_assignment_id_seq; Type: SEQUENCE SET; Schema: practicas; Owner: postgres
--

SELECT pg_catalog.setval('"practicas"."prelocalization_assignment_id_seq"', 1, false);


--
-- Name: prelocalization_call_id_seq; Type: SEQUENCE SET; Schema: practicas; Owner: postgres
--

SELECT pg_catalog.setval('"practicas"."prelocalization_call_id_seq"', 1, false);


--
-- Name: prelocalization_ranking_id_seq; Type: SEQUENCE SET; Schema: practicas; Owner: postgres
--

SELECT pg_catalog.setval('"practicas"."prelocalization_ranking_id_seq"', 1, false);


--
-- Name: request_id_seq; Type: SEQUENCE SET; Schema: practicas; Owner: postgres
--

SELECT pg_catalog.setval('"practicas"."request_id_seq"', 1, false);


--
-- Name: vacancy_id_seq; Type: SEQUENCE SET; Schema: practicas; Owner: postgres
--

SELECT pg_catalog.setval('"practicas"."vacancy_id_seq"', 2, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."roles_id_seq"', 22, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict TqZkmJDH0HpSn0EYW0d71UmyOnYXlucPPM64bgHt8mjkXnopOcuX1PoinFNfvED

RESET ALL;
