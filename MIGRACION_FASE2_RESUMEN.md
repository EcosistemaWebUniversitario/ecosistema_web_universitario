# Migración Fase 2 - Resumen de Progreso

**Fecha**: Abril 20, 2026
**Objetivo**: Migrar practicas-service de autenticación local + Prisma viejo a Supabase Auth + Prisma nuevo

## ✅ COMPLETADO EN FASE 2

### 1. Infraestructura de Autenticación Supabase
- ✅ `src/config/supabase.ts` - Configuración con anon key y service role
- ✅ `src/auth/guards/supabase.guard.ts` - Guard funcional que valida Bearer tokens
- ✅ Extracción de `user.id` (UUID) y `user.email` desde Supabase
- ✅ Asignación de usuario autenticado a `request.user`

### 2. Actualización del Auth Module
- ✅ Reemplazo de estrategia JWT local con SupabaseAuthGuard
- ✅ Eliminación de dependencia a `@nestjs/passport` y `@nestjs/jwt`
- ✅ AuthService simplificado para solo consultar perfiles Supabase
- ✅ AuthController actualizado con endpoint `/auth/me`

### 3. Actualización de Seeders
- ✅ `prisma/seed.ts` - Agrega roles a public.roles y datos de base (facultades, carreras, municipios)
- ✅ `prisma/seed-demo.ts` - Reescrito para usar profiles + UUID en lugar de prisma.user
- ✅ Prisma client regenerado correctamente

### 4. Ajustes Iniciales de Controladores
- ✅ `src/agreements/agreements.controller.ts` - Cambio de Role enum a string literals ('empresa', 'admin_practicas', etc.)

### 5. Limpieza de Código Viejo
- ✅ `src/auth/decorators/roles.decorator.ts` - Actualizado (de Role[] a string[])
- ✅ `src/auth/guards/roles.guard.ts` - Simplificado (ahora solo retorna true - DEPRECATED)
- ✅ `src/auth/strategies/jwt.strategy.ts` - Vacío (DEPRECATED, guardado para compatibilidad)

### 6. Documento de Instrucciones
- ✅ `.github/copilot-instructions.md` - Creado con guía completa de arquitectura y patrones

## ⚠️ PENDIENTE EN FASE 3-4

### Cambios de Nomenclatura Prisma (CRÍTICO)
El schema nuevo genera enums y modelos en snake_case. Todos estos servicios necesitan actualización:

#### Enums Snake_case:
```
OLD (camelCase)          →  NEW (snake_case)
AgreementStatus          →  agreement_status
AgreementType            →  agreement_type  
VacancyStatus            →  vacancy_status
RequestStatus            →  request_status
CallStatus               →  call_status
```

#### Nombres de Modelos (lowercase):
```
Prisma.Agreement         →  prisma.agreement
Prisma.Student           →  prisma.student
Prisma.Company           →  prisma.company
Prisma.Vacancy           →  prisma.vacancy
```

#### Nombres de Campos (snake_case):
```
approvedByPractices      →  approved_by_practices
approvedByPrelocation    →  approved_by_prelocation
createdAt                →  created_at
firstName                →  first_name
lastName                 →  last_name
companyId                →  company_id
studentId                →  student_id
```

### Cambios de Lógica (CRÍTICO)
Todos los servicios deben cambiar:
```typescript
// OLD
async create(userId: number, dto: CreateDto) {
  const company = await prisma.company.findUnique({ where: { userId } });
  return prisma.agreement.create({
    data: { companyId: company.id, ...dto }
  });
}

// NEW
async create(profileId: string, dto: CreateDto) {
  const company = await prisma.company.findUnique({ 
    where: { profile_id: profileId } 
  });
  return prisma.agreement.create({
    data: { company_id: company.id, ...dto }
  });
}
```

### Archivos que Requieren Migración Completa

1. **agreements/**
   - agreements.service.ts - Cambiar queries a snake_case, remove userId references
   - agreements.controller.ts - YA HECHO (Role → strings)
   - dto/*.ts - Actualizar tipos

2. **students/**
   - students.service.ts - Cambiar userId → profileId, fields a snake_case
   - students.controller.ts - Cambiar Role → strings

3. **companies/**
   - companies.service.ts - Similar a students
   - companies.controller.ts - Similar a students

4. **requests/**
   - requests.service.ts
   - requests.controller.ts

5. **prelocalization/**
   - prelocalization.service.ts
   - prelocalization-results.controller.ts

6. **ranking/** / **assignments/** / **dashboard/**
   - Similar a los anteriores

7. **users/** (DEPRECATED)
   - Probablemente se elimine completo o se reemplace

### Cambios en app.module.ts
- ✅ Comentados módulos que no compilan aún
- ⚠️ Cuando se arreglen los servicios, descomentar módulos uno por uno

## 🚀 PRÓXIMOS PASOS (Fase 3-4)

1. Actualizar **agreements.service.ts** como modelo
2. Replicar patrón en students, companies, requests
3. Actualizar todos los DTOs
4. Descomentar módulos en app.module.ts progresivamente
5. Crear endpoint de prueba GET /health-auth ⭐ (Fase 5)
6. Compilar sin errores (Fase 6)

## 📋 CRITERIOS DE ÉXITO

- ✅ npm run build compila sin errores
- ✅ SupabaseAuthGuard funciona en rutas protegidas
- ✅ No hay imports de `Role` desde @prisma/client
- ✅ No hay referencias a `prisma.user`
- ✅ Todos los campos usan snake_case en queries
- ✅ Todos los UUID se pasan como `profileId` (string)
- ✅ Seeders corren sin errores
- ✅ GET /auth/me retorna perfil del usuario autenticado

## 📌 NOTAS IMPORTANTES

1. **Role enum**: Ahora solo existen roles en `public.roles` table, no enum de Prisma
2. **ProfileId**: Es UUID (string), viene de `auth.users.id` via Supabase
3. **Guarding**: SupabaseAuthGuard es global, @Roles() aún funciona pero es decorativo
4. **Seeders**: Necesitan UUID de prueba hardcodeados hasta que haya Supabase real
5. **Models**: Prisma genera lowercase (company, student, etc.), no camelCase

