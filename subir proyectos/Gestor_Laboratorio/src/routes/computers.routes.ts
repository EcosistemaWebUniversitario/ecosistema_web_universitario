// src/routes/computers.routes.ts
import { Router } from 'express';
import { createComputer, getComputers, getComputersByLab, updateComputer, deleteComputer } from '../controllers/computers.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', getComputers);
router.get('/lab/:labId', getComputersByLab);
router.post('/', roleMiddleware(['lab_admin', 'lab_technician']), createComputer);
router.put('/:id', roleMiddleware(['lab_admin', 'lab_technician']), updateComputer);
router.delete('/:id', roleMiddleware(['lab_admin']), deleteComputer);

export default router;
