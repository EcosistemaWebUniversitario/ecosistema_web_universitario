# Sistema de Notas PPK

## Arrancar el backend
```bash
cd ppk-final
npm install
npm run dev
# Servidor en http://localhost:4006
```

## Arrancar el frontend React
```bash
cd ppk-final/frontend
npm install
npm run dev
# Frontend en http://localhost:5173
```

## Puerto: 4006 (cambiar en .env si el líder asigna otro)

## Schemas Supabase usados
- `notas` — asignatura, carrera_asignatura, brigada, nota
- `academico` — faculties, careers, students (compartidas)
- `public` — profiles, roles, auth.users
