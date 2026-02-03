export type DashboardCardType = 'Warehouse' | 'Inventory' | 'Sales' | 'Purchase';

export interface DashboardCardFormData {
  nodeType: 'Warehouse';
  nodeId: string;
  name: string;
  phoneNumber: string;
  address: string;
  status: 'Active' | 'Inactive';
}

export interface DashboardCard {
  id: string;
  nodeType: string;
  nodeId: string;
  name: string;
  phoneNumber: string;
  address: string;
  status: string;
  createdAt: string;
}