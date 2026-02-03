import { Inventory } from '../types/inventory';

const API_URL = process.env.REACT_APP_API_URL || '/api';

export const InventoryService = {
  async getInventoryById(id: string): Promise<Inventory> {
    const response = await fetch(`${API_URL}/inventory/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch inventory data');
    }

    return response.json();
  },

  async updateInventoryQty(id: string, qty: number): Promise<Inventory> {
    const response = await fetch(`${API_URL}/inventory/${id}/adjust`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ qty })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update inventory');
    }

    return response.json();
  }
};