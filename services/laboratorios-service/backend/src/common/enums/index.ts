// src/common/enums/lab-status.enum.ts
export enum LabStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE'
}

// src/common/enums/computer-status.enum.ts
export enum ComputerStatus {
  AVAILABLE = 'AVAILABLE',
  IN_USE = 'IN_USE',
  BROKEN = 'BROKEN',
  MAINTENANCE = 'MAINTENANCE'
}

// src/common/enums/incident-status.enum.ts
export enum IncidentStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}
