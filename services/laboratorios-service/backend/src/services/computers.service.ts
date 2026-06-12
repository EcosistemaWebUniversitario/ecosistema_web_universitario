import { db } from '../db/supabase';

export class ComputersService {

  async create(dto: any) {
    const { data, error } = await db()
      .from('computer')
      .insert([{
        lab_id: dto.labId || dto.lab_id,
        serial_number: dto.serialNumber || dto.serial_number,
        status: dto.status || 'AVAILABLE',
        brand: dto.brand || null,
        model: dto.model || null
      }])
      .select();
    if (error) throw new Error(error.message);
    return data;
  }

  async findAll() {
    const { data, error } = await db()
      .from('computer').select('*, lab(name, location)').order('serial_number');
    if (error) throw new Error(error.message);
    return data;
  }

  async findByLab(labId: string) {
    const { data, error } = await db()
      .from('computer').select('*').eq('lab_id', labId).order('serial_number');
    if (error) throw new Error(error.message);
    return data;
  }

  async update(id: string, dto: any) {
    const updates: any = {};
    if (dto.labId !== undefined) updates.lab_id = dto.labId;
    if (dto.lab_id !== undefined) updates.lab_id = dto.lab_id;
    if (dto.serialNumber !== undefined) updates.serial_number = dto.serialNumber;
    if (dto.serial_number !== undefined) updates.serial_number = dto.serial_number;
    if (dto.status !== undefined) updates.status = dto.status;
    if (dto.brand !== undefined) updates.brand = dto.brand;
    if (dto.model !== undefined) updates.model = dto.model;

    const { data, error } = await db()
      .from('computer').update(updates).eq('id', id).select();
    if (error) throw new Error(error.message);
    return data;
  }

  async remove(id: string) {
    const { error } = await db().from('computer').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return { message: 'Computer deleted successfully' };
  }
}
