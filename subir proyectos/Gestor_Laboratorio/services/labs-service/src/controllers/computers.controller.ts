import { Request, Response } from 'express';
import { ComputersService } from '../services/computers.service';

const service = new ComputersService();

// 🟢 CREATE
export const createComputer = async (req: Request, res: Response) => {
	try {
		const data = await service.create(req.body);
		res.json({ ok: true, data });
	} catch (err: any) {
		res.status(400).json({ ok: false, message: err.message });
	}
};

// 🟢 GET ALL
export const getComputers = async (_req: Request, res: Response) => {
	try {
		const data = await service.findAll();
		res.json({ ok: true, data });
	} catch (err: any) {
		res.status(500).json({ ok: false, message: err.message });
	}
};

// 🟢 GET BY LAB
export const getComputersByLab = async (req: Request, res: Response) => {
	try {
		const data = await service.findByLab(req.params.labId as string);
		res.json({ ok: true, data });
	} catch (err: any) {
		res.status(500).json({ ok: false, message: err.message });
	}
};

// 🟡 UPDATE
export const updateComputer = async (req: Request, res: Response) => {
	try {
		const data = await service.update(req.params.id as string, req.body);
		res.json({ ok: true, data });
	} catch (err: any) {
		res.status(400).json({ ok: false, message: err.message });
	}
};

// 🔴 DELETE
export const deleteComputer = async (req: Request, res: Response) => {
	try {
		const data = await service.remove(req.params.id as string);
		res.json({ ok: true, data });
	} catch (err: any) {
		res.status(400).json({ ok: false, message: err.message });
	}
};