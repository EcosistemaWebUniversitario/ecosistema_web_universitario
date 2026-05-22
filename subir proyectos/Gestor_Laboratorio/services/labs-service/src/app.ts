import express from 'express';
import cors from 'cors';

import labsRoutes from './routes/labs.routes';
import computersRoutes from './routes/computers.routes';
import incidentsRoutes from './routes/incidents.routes';

const app = express();

// 🟢 MIDDLEWARES BASE
app.use(cors());
app.use(express.json());

// 🟢 ROUTES PRINCIPALES
app.use('/api/labs', labsRoutes);
app.use('/api/computers', computersRoutes);
app.use('/api/incidents', incidentsRoutes);

export default app;
