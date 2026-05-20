import { Router } from 'express';

import {
	createComputer,
	getComputers,
	getComputersByLab,
	updateComputer,
	deleteComputer
} from '../controllers/computers.controller';

import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

const router = Router();

router.use(authMiddleware);

// 🟢 COMPUTERS CRUD
router.post('/', roleMiddleware(['lab_admin', 'lab_technician']), createComputer);

router.get('/', getComputers);

router.get('/lab/:labId', getComputersByLab);

router.put('/:id', roleMiddleware(['lab_admin', 'lab_technician']), updateComputer);

router.delete('/:id', roleMiddleware(['lab_admin']), deleteComputer);

export default router;