export type SupplierStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING';

export interface Supplier {
  id: string;
  suppId: string;
  name: string;
  picName: string;
  address: string;
  phone: string;
  status?: SupplierStatus;
  createdAt: string;
  createdBy?: string;
  updatedAt: string;
  updatedBy?: string;
  deletedAt?: string | null;
  deletedBy?: string | null;
}