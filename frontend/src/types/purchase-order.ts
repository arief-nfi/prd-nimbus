export type PurchaseOrderStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED';

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  vendorName: string;
  orderDate: string;
  expectedDate: string;
  totalAmount: number;
  currency: string;
  status: PurchaseOrderStatus;
  itemsCount: number;
  createdAt: string;
  updatedAt: string;
}