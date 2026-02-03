import axios from 'axios';
import { IItem, IFilterParams, IApiResponse } from '../types/item';

const API_URL = process.env.REACT_APP_API_URL || '/api';

export const ItemService = {
  async getAll(params: IFilterParams): Promise<IApiResponse<IItem[]>> {
    const response = await axios.get(`${API_URL}/items`, {
      params: {
        page: params.page,
        limit: params.limit,
        search: params.search || undefined,
        status: params.status !== 'all' ? params.status : undefined,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder
      }
    });
    return response.data;
  },

  async getById(id: string): Promise<IItem> {
    const response = await axios.get(`${API_URL}/items/${id}`);
    return response.data;
  }
};