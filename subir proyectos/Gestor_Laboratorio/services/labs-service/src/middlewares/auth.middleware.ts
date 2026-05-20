import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';

export const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return res.status(401).json({
				ok: false,
				message: 'Missing or invalid authorization header'
			});
		}

		const token = authHeader.split(' ')[1];

		// 🟢 Validar token con Supabase
		const { data, error } = await supabase.auth.getUser(token);

		if (error || !data?.user) {
			return res.status(401).json({
				ok: false,
				message: 'Invalid or expired token'
			});
		}

		// 🟢 Inyectar usuario en request
		(req as any).user = data.user;

		next();
	} catch (err) {
		return res.status(500).json({
			ok: false,
			message: 'Auth middleware error'
		});
	}
};
