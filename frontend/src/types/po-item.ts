export interface POItem {
  id: string;
  itemId: string;
  item: {
    name: string;
    sku: string;
  };
  stock?: string;
  quantity: number;
  uom: string;
  unitPrice: number;
  totalAmount: number;
  createdAt: string;
}

export interface POItemFormData {
  itemId: string;
  quantity: number;
  unitPrice: number;
  uom: string;
  stock?: string;
}