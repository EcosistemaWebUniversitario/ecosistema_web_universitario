🔐 Auth Service – Documentación

📌 Descripción

El Auth Service es el microservicio encargado de:
 • Registro de usuarios
 • Autenticación (login)
 • Gestión de sesión (JWT)
 • Obtención del perfil del usuario
 • Control de permisos y roles

Este servicio es el núcleo del ecosistema, ya que todos los demás microservicios dependen de él para validar usuarios.

⸻

🧩 Tecnologías usadas
 • Node.js
 • Express
 • TypeScript
 • Supabase (Auth + Database)

🧑‍💻 Roles del sistema

| Rol | Descripción |
|---|---|
| super_admin | Acceso total al sistema |
| admin_practicas | Gestiona módulo de prácticas |
| admin_prelocalizacion | Gestiona preubicación laboral |
| estudiante | Usuario estudiante |
| empresa | Entidad externa |

---

🔑 Autenticación

El sistema usa JWT (access_token) generado por Supabase.

Uso del token
Todos los endpoints protegidos requieren:

```http
Authorization: Bearer TU_ACCESS_TOKEN 

Rutas:
GET /api/auth/health
 POST /api/auth/register
 POST /api/auth/login
 GET /api/auth/me
 GET /api/auth/me/permissions
 POST /api/auth/logout

🏗️ Flujo de autenticación
 1. Usuario se registra
 2. Supabase crea usuario
 3. Trigger crea perfil automáticamente
 4. Usuario hace login
 5. Recibe access_token
 6. El token se usa en todas las requests

⸻

⚠️ Reglas importantes
 • No confiar en el frontend para seguridad
 • Siempre validar token en backend
 • Siempre validar rol en endpoints sensibles
 • No exponer SERVICE_ROLE_KEY

⸻

🔗 Integración con otros microservicios

Todos los servicios deben:
 1. Recibir el token en headers
 2. Validarlo usando Supabase
 3. Obtener el usuario
 4. Validar permisos si es necesario

⸻

📌 Notas finales
 • Este servicio es obligatorio para todo el ecosistema
 • Todos los equipos deben integrarse con este módulo
 • Cualquier cambio aquí afecta a todo el sistema