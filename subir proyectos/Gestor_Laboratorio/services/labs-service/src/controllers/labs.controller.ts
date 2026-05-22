import { Request, Response } from 'express';
import { LabsService } from '../services/labs.service';

const service = new LabsService();

// 🟢 CREATE /labs
export const createLab = async (req: Request, res: Response) => {
	try {
		const data = await service.create(req.body);
		res.json({ ok: true, data });
	} catch (err: any) {
		res.status(400).json({ ok: false, message: err.message });
	}
};

// 🟢 GET /labs
export const getLabs = async (_req: Request, res: Response) => {
	try {
		const data = await service.findAll();
		res.json({ ok: true, data });
	} catch (err: any) {
		res.status(500).json({ ok: false, message: err.message });
	}
};

// 🟢 GET /labs/:id
export const getLabById = async (req: Request, res: Response) => {
	try {
		// 🛠️ Cambio: req.params.id as string
		const data = await service.findOne(req.params.id as string);
		res.json({ ok: true, data });
	} catch (err: any) {
		res.status(404).json({ ok: false, message: err.message });
	}
};

// 🟡 PUT /labs/:id
export const updateLab = async (req: Request, res: Response) => {
	try {
		// 🛠️ Cambio: req.params.id as string
		const data = await service.update(req.params.id as string, req.body);
		res.json({ ok: true, data });
	} catch (err: any) {
		res.status(400).json({ ok: false, message: err.message });
	}
};

// 🔴 DELETE /labs/:id
export const deleteLab = async (req: Request, res: Response) => {
	try {
		// 🛠️ Cambio: req.params.id as string
		const data = await service.remove(req.params.id as string);
		res.json({ ok: true, data });
	} catch (err: any) {
		res.status(400).json({ ok: false, message: err.message });
	}
};