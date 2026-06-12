// src/middleware/role.middleware.ts
import { Request, Response, NextFunction } from 'express';

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRole = req.user?.role;

      if (!userRole) {
        return res.status(403).json({ error: 'Rol no encontrado' });
      }

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          error: `Permisos insuficientes. Requiere: ${allowedRoles.join(' o ')}`
        });
      }

      next();
    } catch (err) {
      return res.status(500).json({ error: 'Error en middleware de roles' });
    }
  };
};