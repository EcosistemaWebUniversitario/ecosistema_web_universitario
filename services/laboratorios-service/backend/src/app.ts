// app.ts
import express from 'express';
import cors from 'cors';
import path from 'path';
import labsRoutes from './routes/labs.routes';
import computersRoutes from './routes/computers.routes';
import incidentsRoutes from './routes/incidents.routes';

const app = express();

app.use(cors());
app.use(express.json());

const frontendPath = path.resolve(process.cwd(), 'frontend');
app.use(express.static(frontendPath));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'labs-service', status: 'running' });
});

app.use('/api/labs', labsRoutes);
app.use('/api/computers', computersRoutes);
app.use('/api/incidents', incidentsRoutes);

// Fallback: redirige al login central si no es una ruta API
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    // Mientras no haya SPA, redirigimos al auth-service
    return res.redirect('/auth');
  }
  res.status(404).json({ error: 'Endpoint no encontrado' });
});

export default app;