export enum WarehouseNodeType {
  ROOT = 'ROOT',
  ZONE = 'ZONE',
  BIN = 'BIN'
}

export enum WarehouseMethod {
  FIFO = 'FIFO',
  LIFO = 'LIFO',
  FEFO = 'FEFO'
}

export enum WarehouseStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE'
}

export interface Warehouse {
  id: string;
  nodeId: string;
  name: string;
  parentId?: string | null;
  nodeType: WarehouseNodeType;
  method: WarehouseMethod;
  address: string;
  description?: string | null;
  status: WarehouseStatus;
  createdAt: string;
  createdBy?: string | null;
  updatedAt: string;
  updatedBy?: string | null;
}

export interface WarehouseCreateInput {
  nodeId: string;
  name: string;
  parentId?: string | null;
  nodeType: WarehouseNodeType;
  method: WarehouseMethod;
  address: string;
  description?: string | null;
  status: WarehouseStatus;
}