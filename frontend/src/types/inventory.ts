export interface Inventory {
  id: string;
  itemId: string;
  warehouseId: string;
  binId?: string | null;
  qtyOnHand: number;
  lastReceivedAt?: string | Date | null;
  lastPoId?: string | null;
  item?: {
    sku: string;
    name: string;
    description?: string;
  };
  warehouse?: {
    name: string;
    code: string;
  };
  bin?: {
    code: string;
    location?: string;
  };
}