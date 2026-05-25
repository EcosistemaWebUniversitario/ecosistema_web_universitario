import { Router } from 'express';
import { register, login, me, logout, myPermissions } from '../controllers/auth.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({
    ok: true,
    message: 'Auth service is running'
  });
});

router.post('/register', register);
router.post('/login', login);
router.get('/me', requireAuth, me);
router.post('/logout', requireAuth, logout);
router.get('/me/permissions', requireAuth, myPermissions);

router.get('/admin-test', requireAuth, requireRole('super_admin'), (_req, res) => {
  res.json({
    ok: true,
    message: 'You are a super admin'
  });
});

export default router;