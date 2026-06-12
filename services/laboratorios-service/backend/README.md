# 🧪 Gestor de Laboratorios — labs-service

Microservicio de gestión de laboratorios de computación para el ecosistema universitario.

## Stack
- Node.js + TypeScript + Express
- Supabase (schema: `labs`)
- Puerto: **4005**
- Autenticación: JWT Bearer token (auth.users de Supabase)

## Instalación

```bash
npm install
npm run dev    # desarrollo
npm run build && npm start  # producción
```

## Autenticación

Todas las rutas requieren el header:
```
Authorization: Bearer <supabase_access_token>
```

## Roles
| Rol | Permisos |
|---|---|
| `lab_admin` | CRUD completo en labs, computers, incidents |
| `lab_technician` | Crear/editar labs, computers. Actualizar incidents |
| Cualquier autenticado | Ver todo, reportar incidents |

## Endpoints

### Labs
```
GET    /api/labs              — Listar laboratorios
GET    /api/labs/:id          — Obtener laboratorio
POST   /api/labs              — Crear laboratorio
PUT    /api/labs/:id          — Actualizar laboratorio
DELETE /api/labs/:id          — Eliminar laboratorio (solo lab_admin)
```

### Computers
```
GET    /api/computers             — Listar computadoras
GET    /api/computers/lab/:labId  — Computadoras por laboratorio
POST   /api/computers             — Agregar computadora
PUT    /api/computers/:id         — Actualizar computadora
DELETE /api/computers/:id         — Eliminar computadora (solo lab_admin)
```

### Incidents
```
GET    /api/incidents                        — Listar incidentes
GET    /api/incidents/computer/:computerId   — Incidentes por computadora
POST   /api/incidents                        — Reportar incidente
PUT    /api/incidents/:id                    — Actualizar incidente
DELETE /api/incidents/:id                    — Eliminar incidente (solo lab_admin)
```

## Ejemplo de uso

```bash
# Login para obtener token
curl -X POST https://tsnshzwxvxhjpxxjcjuq.supabase.co/auth/v1/token?grant_type=password \
  -H "apikey: <ANON_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@lab.com","password":"tu_password"}'

# Usar el access_token en las peticiones
curl http://localhost:4005/api/labs \
  -H "Authorization: Bearer <access_token>"
```

## Tablas en Supabase (schema: labs)

- `labs.lab` — laboratorios
- `labs.computer` — computadoras por laboratorio
- `labs.incident` — incidentes reportados
