import { Request, Response } from 'express';
import { IncidentsService } from '../services/incidents.service';

const service = new IncidentsService();

// 🟢 CREATE
export const createIncident = async (req: Request, res: Response) => {
	try {
		const data = await service.create(req.body);
		res.json({ ok: true, data });
	} catch (err: any) {
		res.status(400).json({ ok: false, message: err.message });
	}
};

// 🟢 GET ALL
export const getIncidents = async (_req: Request, res: Response) => {
	try {
		const data = await service.findAll();
		res.json({ ok: true, data });
	} catch (err: any) {
		res.status(500).json({ ok: false, message: err.message });
	}
};

// 🟢 GET BY COMPUTER
export const getIncidentsByComputer = async (req: Request, res: Response) => {
	try {
		// 🛠️ Corrección: 'as string' para evitar el error TS2345
		const data = await service.findByComputer(req.params.computerId as string);
		res.json({ ok: true, data });
	} catch (err: any) {
		res.status(500).json({ ok: false, message: err.message });
	}
};

// 🟡 UPDATE
export const updateIncident = async (req: Request, res: Response) => {
	try {
		// 🛠️ Corrección: 'as string'
		const data = await service.update(req.params.id as string, req.body);
		res.json({ ok: true, data });
	} catch (err: any) {
		res.status(400).json({ ok: false, message: err.message });
	}
};

// 🔴 DELETE
export const deleteIncident = async (req: Request, res: Response) => {
	try {
		// 🛠️ Corrección: 'as string'
		const data = await service.remove(req.params.id as string);
		res.json({ ok: true, data });
	} catch (err: any) {
		res.status(400).json({ ok: false, message: err.message });
	}
};