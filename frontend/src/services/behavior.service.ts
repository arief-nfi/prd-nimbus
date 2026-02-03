import api from './api';
import { BehaviorSettings } from '../types/behavior';

export const behaviorService = {
  getViewModeSettings: async (): Promise<BehaviorSettings> => {
    const response = await api.get('/settings/view-mode-behavior');
    return response.data;
  },

  updateViewModeSettings: async (settings: BehaviorSettings): Promise<void> => {
    await api.put('/settings/view-mode-behavior', settings);
  }
};