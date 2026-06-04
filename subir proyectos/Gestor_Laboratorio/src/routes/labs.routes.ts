// src/routes/labs.routes.ts
import { Router } from 'express';
import { createLab, getLabs, getLabById, updateLab, deleteLab } from '../controllers/labs.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', getLabs);
router.get('/:id', getLabById);
router.post('/', roleMiddleware(['lab_admin', 'lab_technician']), createLab);
router.put('/:id', roleMiddleware(['lab_admin', 'lab_technician']), updateLab);
router.delete('/:id', roleMiddleware(['lab_admin']), deleteLab);

export default router;
