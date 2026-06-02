import { db } from '../db/supabase';

export class LabsService {

  async create(dto: any) {
    const { data: existing } = await db()
      .from('lab').select('id').eq('name', dto.name).single();
    if (existing) throw new Error('Lab already exists');

    const { data, error } = await db()
      .from('lab')
      .insert([{
        name: dto.name,
        location: dto.location,
        capacity: dto.capacity,
        status: dto.status || 'ACTIVE',
        technician_id: dto.technicianId || dto.technician_id || null
      }])
      .select();
    if (error) throw new Error(error.message);
    return data;
  }

  async findAll() {
    const { data, error } = await db()
      .from('lab').select('*').order('name');
    if (error) throw new Error(error.message);
    return data;
  }

  async findOne(id: string) {
    const { data, error } = await db()
      .from('lab').select('*').eq('id', id).single();
    if (error) throw new Error('Lab not found');
    return data;
  }

  async update(id: string, dto: any) {
    const updates: any = {};
    if (dto.name !== undefined) updates.name = dto.name;
    if (dto.location !== undefined) updates.location = dto.location;
    if (dto.capacity !== undefined) updates.capacity = dto.capacity;
    if (dto.status !== undefined) updates.status = dto.status;
    if (dto.technicianId !== undefined) updates.technician_id = dto.technicianId;
    if (dto.technician_id !== undefined) updates.technician_id = dto.technician_id;

    const { data, error } = await db()
      .from('lab').update(updates).eq('id', id).select();
    if (error) throw new Error(error.message);
    return data;
  }

  async remove(id: string) {
    const { error } = await db().from('lab').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return { message: 'Lab deleted successfully' };
  }
}
