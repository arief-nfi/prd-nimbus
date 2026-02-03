export interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendorName: string;
  poDate: string;
  requiredDate: string;
  nodeType: 'Warehouse' | 'Factory' | 'Store';
  nodeId: string;
  createdAt: string;
}

export interface POSearchInput {
  search?: string;
  page?: number;
  limit?: number;
}

export interface POCreateInput {
  poNumber: string;
  vendorName: string;
  poDate: Date;
  requiredDate: Date;
  nodeType: 'Warehouse' | 'Factory' | 'Store';
  nodeId: string;
}