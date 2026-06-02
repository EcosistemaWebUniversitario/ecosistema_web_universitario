import { db } from '../db/supabase';

export class IncidentsService {

  async create(dto: any, userId?: string) {
    const { data, error } = await db()
      .from('incident')
      .insert([{
        computer_id: dto.computerId || dto.computer_id,
        title: dto.title,
        description: dto.description,
        status: dto.status || 'OPEN',
        reported_by: dto.reportedBy || dto.reported_by || userId || null
      }])
      .select();
    if (error) throw new Error(error.message);
    return data;
  }

  async findAll() {
    const { data, error } = await db()
      .from('incident')
      .select('*, computer(serial_number, brand, model, lab(name))')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  }

  async findByComputer(computerId: string) {
    const { data, error } = await db()
      .from('incident').select('*').eq('computer_id', computerId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  }

  async update(id: string, dto: any) {
    const updates: any = {};
    if (dto.title !== undefined) updates.title = dto.title;
    if (dto.description !== undefined) updates.description = dto.description;
    if (dto.status !== undefined) updates.status = dto.status;
    updates.updated_at = new Date().toISOString();

    const { data, error } = await db()
      .from('incident').update(updates).eq('id', id).select();
    if (error) throw new Error(error.message);
    return data;
  }

  async remove(id: string) {
    const { error } = await db().from('incident').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return { message: 'Incident deleted successfully' };
  }
}
