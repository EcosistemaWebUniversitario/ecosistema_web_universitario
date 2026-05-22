import { supabase } from '../config/supabase';
import { CreateComputerDto, UpdateComputerDto } from '../modules/computers/computers.dto';

export class ComputersService {

	async create(dto: CreateComputerDto) {
		const { data, error } = await supabase
			.from('computers')
			.insert([dto])
			.select();

		if (error) throw new Error(error.message);

		return data;
	}

	async findAll() {
		const { data, error } = await supabase
			.from('computers')
			.select('*');

		if (error) throw new Error(error.message);

		return data;
	}

	async findByLab(labId: string) {
		const { data, error } = await supabase
			.from('computers')
			.select('*')
			.eq('labId', labId);

		if (error) throw new Error(error.message);

		return data;
	}

	async update(id: string, dto: UpdateComputerDto) {
		const { data, error } = await supabase
			.from('computers')
			.update(dto)
			.eq('id', id)
			.select();

		if (error) throw new Error(error.message);

		return data;
	}

	async remove(id: string) {
		const { error } = await supabase
			.from('computers')
			.delete()
			.eq('id', id);

		if (error) throw new Error(error.message);

		return { message: 'Computer deleted' };
	}
}
