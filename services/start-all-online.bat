@echo off
echo Iniciando todos los servicios en MODO PRODUCCIÓN (online)...

:: Auth (en producción no necesita NODE_ENV, carga .env normal)
start "Auth" cmd /k "cd /d C:\Universidad\ecosistema_web_universitario\services\auth-service\backend && npm run dev:online"

:: Prácticas
start "Practicas" cmd /k "cd /d C:\Universidad\ecosistema_web_universitario\services\practicas-service\backend && npm run start:online"

:: Horarios
start "Horarios" cmd /k "cd /d C:\Universidad\ecosistema_web_universitario\services\horarios-service\backend && npm run start:online"

:: Votaciones
start "Votaciones" cmd /k "cd /d C:\Universidad\ecosistema_web_universitario\services\votaciones-service\backend && npm run start:online"

:: Notas
start "Notas" cmd /k "cd /d C:\Universidad\ecosistema_web_universitario\services\notas-service\backend && npm run start:online"

:: Laboratorios
start "Laboratorios" cmd /k "cd /d C:\Universidad\ecosistema_web_universitario\services\laboratorios-service\backend && npm run start:online"

echo Todos los servicios han sido iniciados en ventanas separadas.