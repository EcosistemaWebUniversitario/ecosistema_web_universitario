// src/controllers/labs.controller.ts
import { Request, Response } from 'express';
import { LabsService } from '../services/labs.service';

const service = new LabsService();

export const createLab = async (req: Request, res: Response) => {
  try {
    const data = await service.create(req.body);
    res.status(201).json({ ok: true, data });
  } catch (err: any) {
    res.status(400).json({ ok: false, message: err.message });
  }
};

export const getLabs = async (_req: Request, res: Response) => {
  try {
    const data = await service.findAll();
    res.json({ ok: true, data });
  } catch (err: any) {
    res.status(500).json({ ok: false, message: err.message });
  }
};

export const getLabById = async (req: Request, res: Response) => {
  try {
    const data = await service.findOne(req.params.id);
    res.json({ ok: true, data });
  } catch (err: any) {
    res.status(404).json({ ok: false, message: err.message });
  }
};

export const updateLab = async (req: Request, res: Response) => {
  try {
    const data = await service.update(req.params.id, req.body);
    res.json({ ok: true, data });
  } catch (err: any) {
    res.status(400).json({ ok: false, message: err.message });
  }
};

export const deleteLab = async (req: Request, res: Response) => {
  try {
    const data = await service.remove(req.params.id);
    res.json({ ok: true, data });
  } catch (err: any) {
    res.status(400).json({ ok: false, message: err.message });
  }
};
