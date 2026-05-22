import { LabStatus } from '../../common/enums/lab-status.enum';

export interface CreateLabDto {
	name: string;
	location: string;
	capacity: number;
	status?: LabStatus;
	technicianId?: string;
}

export interface UpdateLabDto {
	name?: string;
	location?: string;
	capacity?: number;
	status?: LabStatus;
	technicianId?: string;
}
