export interface ViewModeData {
  id: string;
  title: string;
  status: 'active' | 'inactive' | 'pending';
  metadata: {
    createdAt: string;
    updatedAt: string;
    author: string;
    version: string;
  };
  content: {
    sections: Array<{
      id: string;
      label: string;
      value: string | number | boolean;
      type: 'text' | 'number' | 'boolean' | 'date';
    }>;
  };
  permissions: {
    canEdit: boolean;
    canDelete: boolean;
    roles: string[];
  };
}