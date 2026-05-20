import { ComputerStatus } from '../../common/enums/computer-status.enum';

export interface CreateComputerDto {
	labId: string;
	serialNumber: string;
	status?: ComputerStatus;
	brand?: string;
	model?: string;
}

export interface UpdateComputerDto {
	labId?: string;
	serialNumber?: string;
	status?: ComputerStatus;
	brand?: string;
	model?: string;
}
