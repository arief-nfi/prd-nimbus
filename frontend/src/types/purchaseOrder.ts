export interface Supplier {
  id: string;
  name: string;
  email?: string;
  address?: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  unitPrice: number;
  currency: string;
}

export interface PurchaseOrderItemInput {
  inventoryItemId: string;
  quantity: number;
  unitPrice: number;
}

export interface PurchaseOrderInput {
  supplierId: string;
  orderDate: string;
  expectedDeliveryDate?: string;
  notes?: string;
  items: PurchaseOrderItemInput[];
}

export interface PurchaseOrder extends PurchaseOrderInput {
  id: string;
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'RECEIVED' | 'CANCELLED';
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}