import { supabase } from '../config/supabase';
import { CreateLabDto, UpdateLabDto } from '../modules/labs/labs.dto';

export class LabsService {

	// 🟢 CREATE
	async create(dto: CreateLabDto) {
		// 🔍 Validar duplicados por nombre
		const { data: existing } = await supabase
			.from('labs')
			.select('*')
			.eq('name', dto.name)
			.single();

		if (existing) {
			throw new Error('Lab already exists');
		}

		const { data, error } = await supabase
			.from('labs')
			.insert([dto])
			.select();

		if (error) throw new Error(error.message);

		return data;
	}

	// 🟢 READ ALL
	async findAll() {
		const { data, error } = await supabase
			.from('labs')
			.select('*');

		if (error) throw new Error(error.message);

		return data;
	}

	// 🟢 READ ONE
	async findOne(id: string) {
		const { data, error } = await supabase
			.from('labs')
			.select('*')
			.eq('id', id)
			.single();

		if (error) throw new Error('Lab not found');

		return data;
	}

	// 🟡 UPDATE
	async update(id: string, dto: UpdateLabDto) {
		const { data, error } = await supabase
			.from('labs')
			.update(dto)
			.eq('id', id)
			.select();

		if (error) throw new Error(error.message);

		return data;
	}

	// 🔴 DELETE
	async remove(id: string) {
		const { error } = await supabase
			.from('labs')
			.delete()
			.eq('id', id);

		if (error) throw new Error(error.message);

		return { message: 'Lab deleted successfully' };
	}
}
