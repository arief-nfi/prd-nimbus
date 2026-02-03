export type CardType = 'metric' | 'chart' | 'list' | 'gauge';
export type CardSize = 'small' | 'medium' | 'large' | 'full';

export interface DashboardCardDefinition {
  id: string;
  title: string;
  description?: string;
  type: CardType;
  size: CardSize;
  dataSourceUrl: string;
  refreshInterval: number; // in seconds
  config: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}