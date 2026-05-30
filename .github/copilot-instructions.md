# Copilot Instructions for Ecosystem Universitario

## Architecture Overview

This is a **microservices-based educational practices management system** built with NestJS, Supabase Auth, and Prisma ORM, deployed across multiple services.

### Core Services

- **auth-service**: Standalone Express.js service handling Supabase authentication
- **practicas-service**: NestJS microservice (main focus) managing internships, agreements, vacancies
- **frontend**: React + Vite (communicates with practicas-service via NestJS REST API)

### Database Architecture

- **Multi-schema PostgreSQL** via Supabase with Prisma multiSchema support
  - `auth` schema: Supabase managed auth tables (users, sessions, identities, etc.)
  - `public` schema: Shared models (profiles, roles)
  - `practicas` schema: Internship-specific models (students, companies, agreements, vacancies, etc.)

### Key Design Pattern: ProfileId

**Critical**: The system links all business entities to users through `profileId` (UUID string), not `userId`.
- `auth.users.id` (UUID) → `public.profiles.id` (UUID) → business entities reference `profile_id`
- Example: `student.profile_id` and `company.profile_id` are foreign keys to `profiles.id`

## Prisma & Database Usage

### PrismaService Location
`src/prisma/prisma.service.ts` - Single instance, injected into all modules

### Data Access Pattern
```typescript
// DO: Use profileId (UUID) as the link
const student = await this.prisma.student.findUnique({
  where: { profile_id: req.user.id }, // req.user.id comes from Supabase token
});

// DON'T: Use old integer userId
// userId pattern is DEPRECATED - Supabase auth returns UUID, not integer

// DON'T: Reference profiles table in business queries
// Business entities already have profile_id; query directly on business models
```

### Include Relations (Correct Syntax)
When joining related data, use the exact model names and field names:
```typescript
// Example from schema: company model has relationship to profiles
await this.prisma.company.findUnique({
  where: { profile_id: userUuid },
  include: {
    municipality: true,
    agreement: true, // relations follow schema exactly
  },
});
```

## Authentication & Authorization

### Supabase Token Flow (practicas-service)

1. **Frontend sends**: `Authorization: Bearer <JWT from Supabase>`
2. **NestJS Guard** (`SupabaseAuthGuard`) validates token:
   - Calls `supabase.auth.getUser(token)`
   - Extracts user UUID → attaches to `req.user` as `{ id: uuid, email: string }`
3. **Controllers/Services** extract `req.user.id` (UUID) for queries

### Guard Usage (Required Pattern)
```typescript
@UseGuards(SupabaseAuthGuard)
@Get('/profile')
async getProfile(@Request() req: any) {
  const profileId = req.user.id; // UUID from Supabase
  return this.studentService.findMyProfile(profileId);
}
```

### Role-Based Access (Old Pattern - DEPRECATED)
The old `@Roles()` decorator and RolesGuard referenced Prisma's `Role` enum (STUDENT, TEACHER, etc.).
**Don't use this.** Instead:
- Query `profiles` table which has `role_id` (foreign key to `roles` table)
- Implement role checks by joining to `roles` table if needed
- For now, most endpoints simply require authentication (`SupabaseAuthGuard`)

## Module Conventions

Each business module follows this structure:
```
module_name/
  ├── module_name.controller.ts   (HTTP routes, extract req.user.id, validate roles if needed)
  ├── module_name.service.ts       (business logic, all Prisma queries use profileId)
  ├── module_name.module.ts        (NestJS module, imports PrismaModule)
  ├── dto/
  │   ├── create-<entity>.dto.ts  (@IsString() @IsUUID() for profile_id, use class-validator)
  │   └── update-<entity>.dto.ts
  ├── <entity>.spec.ts             (unit tests)
  └── **don't create**: guards/, decorators/, strategies/ (auth is global via SupabaseAuthGuard)
```

### DTO Best Practices
- Always use `@IsUUID()` for `profile_id` fields (validation via class-validator)
- Don't include auth fields (password, tokens) in DTOs
- For business entities, avoid transferring internal IDs; use UUIDs where possible

## Critical Migration Rules

### NEVER DO THIS:
1. ❌ Import `Role` from `@prisma/client` - it doesn't exist in new schema
2. ❌ Use `prisma.user.*` - auth.users is managed by Supabase only
3. ❌ Reference `userId: number` - Supabase returns UUID
4. ❌ Trust `req.user` without SupabaseAuthGuard - guard must extract it from token
5. ❌ Seed with old auth structure - use profileId-based seeding

### ALWAYS DO THIS:
1. ✅ Extract UUID from `req.user.id` (set by SupabaseAuthGuard)
2. ✅ Query by `profile_id: uuid` in all business models
3. ✅ Use Prisma multiSchema (`@schema("practicas")`, `@schema("public")`)
4. ✅ Validate `@IsUUID()` on DTOs before Prisma calls
5. ✅ Use `include` for related data (check schema.prisma for exact field names)

## Build & Test Commands

```bash
# Development (watch mode)
npm run start:dev

# Build (compile TypeScript)
npm run build

# Run tests
npm run test

# Run E2E tests
npm run test:e2e

# Seed database (for demo data)
npm run seed:base      # Base roles/careers/municipalities
npm run seed:demo      # Demo students/companies/vacancies
npm run seed:all       # Both

# Lint & format
npm run lint
npm run format
```

## Common Patterns in This Codebase

### Filtering by Current User
```typescript
// Service method: pass profileId from controller
async findMyStuff(profileId: string) {
  return this.prisma.student.findUnique({
    where: { profile_id: profileId },
  });
}

// Controller: extract from request
@UseGuards(SupabaseAuthGuard)
@Get('/my-profile')
async getMyProfile(@Request() req: any) {
  return this.studentService.findMyStuff(req.user.id);
}
```

### Creating Business Entities Linked to User
```typescript
// DTO includes profile_id as UUID string
// Guard ensures req.user.id exists
async create(profileId: string, dto: CreateStudentDto) {
  return this.prisma.student.create({
    data: {
      profile_id: profileId,
      first_name: dto.first_name,
      last_name: dto.last_name,
      ci: dto.ci,
      sex: dto.sex,
      academic_year: dto.academic_year,
      career_id: dto.career_id,
      municipality_id: dto.municipality_id,
    },
  });
}
```

### Joining Municipalities or Careers
```typescript
const student = await this.prisma.student.findUnique({
  where: { profile_id: uuid },
  include: {
    municipality: true,
    career: true,
    profiles: true, // link to public.profiles
  },
});
```

## File Organization & Key Locations

- **Authentication config**: `src/config/supabase.ts`
- **Auth Guard**: `src/auth/guards/supabase.guard.ts` (or similar - check actual file)
- **Database client**: `src/prisma/prisma.service.ts`
- **Global pipes**: `main.ts` (ValidationPipe with whitelist: true)
- **Global filters**: `src/common/filters/http-exception.filter.ts`
- **Request interceptors**: `src/common/interceptors/response.interceptor.ts`
- **Seed scripts**: `prisma/seed.ts` and `prisma/seed-demo.ts`

## Troubleshooting

**"Role not found"**: Old code importing `Role` from Prisma. Delete import, check for `@Roles()` decorators and remove them.

**"Cannot find module @prisma/client User"**: Querying `prisma.user.*`. Only use auth.users for Supabase login; business logic queries profiles, students, companies.

**"profileId not defined"**: Missing UUID extraction from request. Ensure guard is applied and `req.user.id` is available.

**Seeding fails**: Seed scripts may reference old schema. Update to use profileId, avoid creating auth.users (Supabase manages these).

---

**Last Updated**: April 2026
**Schema Version**: Multi-schema (auth, public, practicas)
**Framework**: NestJS 11 + Supabase Auth
