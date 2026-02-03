import axios from 'axios';
import { PurchaseOrderInput, PurchaseOrder } from '../types/purchaseOrder';

const API_URL = process.env.REACT_APP_API_URL || '/api';

export const createPurchaseOrder = async (data: PurchaseOrderInput): Promise<PurchaseOrder> => {
  const response = await axios.post(`${API_URL}/purchase-orders`, data);
  return response.data;
};

export const getPurchaseOrders = async (): Promise<PurchaseOrder[]> => {
  const response = await axios.get(`${API_URL}/purchase-orders`);
  return response.data;
};