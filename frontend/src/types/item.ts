export interface IItem {
  id: string;
  name: string;
  code: string;
  category: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
}

export interface IFilterParams {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface IApiResponse<T> {
  data: T;
  total: number;
  page: number;
  limit: number;
}