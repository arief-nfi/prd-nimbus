export interface BehaviorSettings {
  id?: string;
  defaultViewMode: 'compact' | 'expanded' | 'grid';
  autoRefresh: boolean;
  refreshInterval: number;
  enableAnimations: boolean;
  showMetadata: boolean;
  persistenceEnabled: boolean;
  updatedAt?: string;
}