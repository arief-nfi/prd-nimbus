import api from '@/lib/axios';

export const createApiMethods = <T, K = T>(basePath: string) => ({
  getAll: async (params?: any): Promise<T[]> => {
    const { data } = await api.get(basePath, { params });
    return data;
  },
  getById: async (id: string): Promise<T> => {
    const { data } = await api.get(`${basePath}/${id}`);
    return data;
  },
  create: async (payload: Partial<K>): Promise<T> => {
    const { data } = await api.post(basePath, payload);
    return data;
  },
  update: async (id: string, payload: Partial<K>): Promise<T> => {
    const { data } = await api.patch(`${basePath}/${id}`, payload);
    return data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`${basePath}/${id}`);
  },
});

export const warehouseApi = createApiMethods('/warehouses');
export const supplierApi = createApiMethods('/suppliers');
export const itemApi = createApiMethods('/items');
export const uomApi = createApiMethods('/uoms');
export const inventoryApi = createApiMethods('/inventory');
export const purchaseOrderApi = createApiMethods('/purchase-orders');
export const poLineItemApi = createApiMethods('/po-line-items');
export const poAttachmentApi = {
  ...createApiMethods('/po-attachments'),
  upload: async (poId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('purchaseOrderId', poId);
    const { data } = await api.post('/po-attachments/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  }
};