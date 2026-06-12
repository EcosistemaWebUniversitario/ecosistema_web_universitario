// src/routes/incidents.routes.ts
import { Router } from 'express';
import { createIncident, getIncidents, getIncidentsByComputer, updateIncident, deleteIncident } from '../controllers/incidents.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', getIncidents);
router.get('/computer/:computerId', getIncidentsByComputer);
router.post('/', createIncident); // cualquier usuario autenticado puede reportar
router.put('/:id', roleMiddleware(['lab_admin', 'lab_technician']), updateIncident);
router.delete('/:id', roleMiddleware(['lab_admin']), deleteIncident);

export default router;
