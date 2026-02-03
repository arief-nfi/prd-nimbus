import axios from 'axios';
import { Warehouse, WarehouseCreateInput } from '../types/warehouse';

const API_URL = process.env.REACT_APP_API_URL || '/api';

export const WarehouseService = {
  async getAll(params?: { status?: string }): Promise<Warehouse[]> {
    const response = await axios.get(`${API_URL}/warehouses`, { params });
    return response.data;
  },

  async create(data: WarehouseCreateInput): Promise<Warehouse> {
    const response = await axios.post(`${API_URL}/warehouses`, data);
    return response.data;
  },

  async getById(id: string): Promise<Warehouse> {
    const response = await axios.get(`${API_URL}/warehouses/${id}`);
    return response.data;
  }
};