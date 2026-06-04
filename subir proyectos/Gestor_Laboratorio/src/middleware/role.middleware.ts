// src/middleware/role.middleware.ts
import { Request, Response, NextFunction } from 'express';

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRole = (req as any).userRole;

      if (!userRole) {
        return res.status(403).json({
          ok: false,
          message: 'Role not found in profile'
        });
      }

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          ok: false,
          message: `Insufficient permissions. Required: ${allowedRoles.join(' or ')}`
        });
      }

      next();
    } catch (err) {
      return res.status(500).json({
        ok: false,
        message: 'Role middleware error'
      });
    }
  };
};
