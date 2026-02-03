import { DashboardCardDefinition } from '../types/dashboard';

const API_BASE = '/api/dashboard-cards';

export const DashboardCardService = {
  async getAllDefinitions(): Promise<DashboardCardDefinition[]> {
    const response = await fetch(`${API_BASE}/definitions`, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to fetch definitions');
    return response.json();
  },

  async createDefinition(data: Partial<DashboardCardDefinition>): Promise<DashboardCardDefinition> {
    const response = await fetch(`${API_BASE}/definitions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create definition');
    return response.json();
  },

  async updateDefinition(id: string, data: Partial<DashboardCardDefinition>): Promise<DashboardCardDefinition> {
    const response = await fetch(`${API_BASE}/definitions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update definition');
    return response.json();
  },

  async deleteDefinition(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/definitions/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete definition');
  }
};