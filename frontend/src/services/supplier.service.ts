import axios from 'axios';
import { Supplier, SupplierCreateInput } from '../types/supplier';

const API_URL = process.env.REACT_APP_API_URL || '/api';

export const supplierService = {
  async create(data: SupplierCreateInput): Promise<Supplier> {
    const response = await axios.post(`${API_URL}/suppliers`, data);
    return response.data;
  },

  async getAll(): Promise<Supplier[]> {
    const response = await axios.get(`${API_URL}/suppliers`);
    return response.data;
  },

  async getById(id: string): Promise<Supplier> {
    const response = await axios.get(`${API_URL}/suppliers/${id}`);
    return response.data;
  }
};