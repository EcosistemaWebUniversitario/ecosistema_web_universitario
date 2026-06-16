@echo off
echo Iniciando todos los servicios en MODO DESARROLLO...

:: Auth (requiere NODE_ENV=development para cargar .env.local)
start "Auth" cmd /k "cd /d C:\Universidad\ecosistema_web_universitario\services\auth-service\backend && set $env:NODE_ENV="development" && npm run dev"

:: Prácticas
start "Practicas" cmd /k "cd /d C:\Universidad\ecosistema_web_universitario\services\practicas-service\backend && npm run start:dev"

:: Horarios
start "Horarios" cmd /k "cd /d C:\Universidad\ecosistema_web_universitario\services\horarios-service\backend && npm run dev"

:: Votaciones
start "Votaciones" cmd /k "cd /d C:\Universidad\ecosistema_web_universitario\services\votaciones-service\backend && npm run dev"

:: Notas
start "Notas" cmd /k "cd /d C:\Universidad\ecosistema_web_universitario\services\notas-service\backend && npm run dev"

:: Laboratorios
start "Laboratorios" cmd /k "cd /d C:\Universidad\ecosistema_web_universitario\services\laboratorios-service\backend && npm run dev"

echo Todos los servicios han sido iniciados en ventanas separadas.