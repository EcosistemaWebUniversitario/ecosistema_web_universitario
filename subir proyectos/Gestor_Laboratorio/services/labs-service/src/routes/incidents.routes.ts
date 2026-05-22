import { Router } from 'express';

import {
	createIncident,
	getIncidents,
	getIncidentsByComputer,
	updateIncident,
	deleteIncident
} from '../controllers/incidents.controller';

import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

const router = Router();

router.use(authMiddleware);

// 🟢 INCIDENTS CRUD
// Nota: Cualquier usuario autenticado puede reportar (ej. alumnos), 
// pero si quieres restringirlo solo a técnicos/admin, podrías añadir el middleware aquí.
router.post('/', createIncident);

router.get('/', getIncidents);

router.get('/computer/:computerId', getIncidentsByComputer);

router.put('/:id', roleMiddleware(['lab_admin', 'lab_technician']), updateIncident);

router.delete('/:id', roleMiddleware(['lab_admin']), deleteIncident);

export default router;