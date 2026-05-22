import { supabase } from '../config/supabase';
import { CreateIncidentDto, UpdateIncidentDto } from '../modules/incidents/incidents.dto';

export class IncidentsService {

	async create(dto: CreateIncidentDto) {
		const { data, error } = await supabase
			.from('incidents')
			.insert([dto])
			.select();

		if (error) throw new Error(error.message);

		return data;
	}

	async findAll() {
		const { data, error } = await supabase
			.from('incidents')
			.select('*');

		if (error) throw new Error(error.message);

		return data;
	}

	async findByComputer(computerId: string) {
		const { data, error } = await supabase
			.from('incidents')
			.select('*')
			.eq('computerId', computerId);

		if (error) throw new Error(error.message);

		return data;
	}

	async update(id: string, dto: UpdateIncidentDto) {
		const { data, error } = await supabase
			.from('incidents')
			.update(dto)
			.eq('id', id)
			.select();

		if (error) throw new Error(error.message);

		return data;
	}

	async remove(id: string) {
		const { error } = await supabase
			.from('incidents')
			.delete()
			.eq('id', id);

		if (error) throw new Error(error.message);

		return { message: 'Incident deleted' };
	}
}
