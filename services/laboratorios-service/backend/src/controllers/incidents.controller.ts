// src/controllers/incidents.controller.ts
import { Request, Response } from 'express';
import { IncidentsService } from '../services/incidents.service';

const service = new IncidentsService();

export const createIncident = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const data = await service.create(req.body, userId);
    res.status(201).json({ ok: true, data });
  } catch (err: any) {
    res.status(400).json({ ok: false, message: err.message });
  }
};

export const getIncidents = async (_req: Request, res: Response) => {
  try {
    const data = await service.findAll();
    res.json({ ok: true, data });
  } catch (err: any) {
    res.status(500).json({ ok: false, message: err.message });
  }
};

export const getIncidentsByComputer = async (req: Request, res: Response) => {
  try {
    const data = await service.findByComputer(req.params.computerId);
    res.json({ ok: true, data });
  } catch (err: any) {
    res.status(500).json({ ok: false, message: err.message });
  }
};

export const updateIncident = async (req: Request, res: Response) => {
  try {
    const data = await service.update(req.params.id, req.body);
    res.json({ ok: true, data });
  } catch (err: any) {
    res.status(400).json({ ok: false, message: err.message });
  }
};

export const deleteIncident = async (req: Request, res: Response) => {
  try {
    const data = await service.remove(req.params.id);
    res.json({ ok: true, data });
  } catch (err: any) {
    res.status(400).json({ ok: false, message: err.message });
  }
};
