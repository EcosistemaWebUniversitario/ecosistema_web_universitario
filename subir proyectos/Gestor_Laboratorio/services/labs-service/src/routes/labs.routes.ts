import { Router } from 'express';
import {
	createLab,
	getLabs,
	getLabById,
	updateLab,
	deleteLab
} from '../controllers/labs.controller';

import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

const router = Router();

// 🟢 TODAS LAS RUTAS PROTEGIDAS
router.use(authMiddleware);

// 🟢 LABS CRUD
router.post('/', roleMiddleware(['lab_admin', 'lab_technician']), createLab);

router.get('/', getLabs);

router.get('/:id', getLabById);

router.put('/:id', roleMiddleware(['lab_admin', 'lab_technician']), updateLab);

router.delete('/:id', roleMiddleware(['lab_admin']), deleteLab);

export default router;