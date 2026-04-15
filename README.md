Ecosistema Web Universitario
📌 Descripción
Este proyecto es un ecosistema web basado en microservicios, diseñado para gestionar diversos procesos universitarios de manera unificada y eficiente.

🧩 Microservicios
Servicio de Autenticación: Gestión de autenticación y autorización (Auth).

Servicio de Prácticas: Control de prácticas profesionales y preubicación laboral.

Servicio de Elecciones: Gestión de procesos electorales estudiantiles.

Servicio de Notas: Gestión y control de calificaciones académicas.

Servicio de Horarios: Creación y consulta de horarios de clases.

Servicio de Inventario: Control de equipos y materiales en laboratorios.

👥 Roles
Super Administrador: Acceso total y supervisión global del sistema.

Administrador de Prácticas: Gestión específica del proceso de prácticas.

Administrador de Preubicación: Encargado de la asignación laboral temprana.

Estudiante: Usuario principal, beneficiario de los servicios académicos y administrativos.

Profesor: Gestión de notas, asistencia y recursos de laboratorio.

Empresa: Entidad externa para convenios de prácticas y vacantes.

🏗️ Arquitectura
Frontend: React

API Gateway: Punto de entrada único para las peticiones.

Microservicios: Desarrollados en Node.js con TypeScript/JavaScript.

Supabase: Utilizado para la autenticación y la base de datos principal.

🎯 Objetivo
Proveer un sistema escalable y modular donde cada servicio funcione de manera independiente, garantizando que un fallo en un módulo no afecte la integridad de todo el ecosistema.

⚙️ Tecnologías
Node.js

TypeScript

JavaScript

React

Supabase

PostgreSQL

GitHub

📂 Estructura del Proyecto
/frontend – Interfaz de usuario.

/api-gateway – Enrutador y seguridad de peticiones.

/services – Lógica individual de cada microservicio.

/doc – Documentación técnica y funcional.
