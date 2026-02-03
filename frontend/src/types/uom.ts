export enum UomStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED'
}

export interface Uom {
  id: string;
  uomId: string;
  code: string;
  name: string;
  status: UomStatus;
  createdAt: string;
  createdBy?: string;
  updatedAt: string;
  updatedBy?: string;
  deletedAt?: string | null;
  deletedBy?: string | null;
}