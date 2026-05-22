import { IncidentStatus } from '../../common/enums/incident-status.enum';

export interface CreateIncidentDto {
	computerId: string;
	title: string;
	description: string;
	status?: IncidentStatus;
	reportedBy: string;
}

export interface UpdateIncidentDto {
	title?: string;
	description?: string;
	status?: IncidentStatus;
}
