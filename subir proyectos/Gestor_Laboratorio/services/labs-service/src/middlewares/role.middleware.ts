import { Request, Response, NextFunction } from 'express';

// 🟢 Nombres de roles actualizados para coincidir con la DB
type Role = 'lab_admin' | 'lab_technician';

export const roleMiddleware = (allowedRoles: Role[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			const user = (req as any).user;

			if (!user) {
				return res.status(401).json({
					ok: false,
					message: 'Unauthorized'
				});
			}

			// 🟢 Extraer role desde metadata de Supabase
			const userRole = user.user_metadata?.role;

			if (!userRole) {
				return res.status(403).json({
					ok: false,
					message: 'Role not found'
				});
			}

			// 🟢 Validar permisos (Case-sensitive)
			if (!allowedRoles.includes(userRole as Role)) {
				return res.status(403).json({
					ok: false,
					message: 'Insufficient permissions'
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