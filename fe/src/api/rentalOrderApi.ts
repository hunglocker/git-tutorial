import { apiClient } from './client';
import type {
  RentalOrder,
  RentalStatus,
  CreateRentalOrderRequest,
  ReturnRentalOrderRequest,
  CancelRentalOrderRequest,
} from '@/types';

export const rentalOrderApi = {
  getAll: async (): Promise<RentalOrder[]> => {
    const { data } = await apiClient.get<RentalOrder[]>('/rental-orders');
    return data;
  },

  getByStatus: async (status: RentalStatus): Promise<RentalOrder[]> => {
    const { data } = await apiClient.get<RentalOrder[]>(`/rental-orders/by-status/${status}`);
    return data;
  },

  getByCustomer: async (customerId: string): Promise<RentalOrder[]> => {
    const { data } = await apiClient.get<RentalOrder[]>(
      `/rental-orders/by-customer/${customerId}`
    );
    return data;
  },

  getOverdue: async (): Promise<RentalOrder[]> => {
    const { data } = await apiClient.get<RentalOrder[]>('/rental-orders/overdue');
    return data;
  },

  getById: async (id: string): Promise<RentalOrder> => {
    const { data } = await apiClient.get<RentalOrder>(`/rental-orders/${id}`);
    return data;
  },

  create: async (request: CreateRentalOrderRequest): Promise<RentalOrder> => {
    const { data } = await apiClient.post<RentalOrder>('/rental-orders', request);
    return data;
  },

  activate: async (id: string): Promise<RentalOrder> => {
    const { data } = await apiClient.patch<RentalOrder>(`/rental-orders/${id}/activate`);
    return data;
  },

  return: async (id: string, request: ReturnRentalOrderRequest): Promise<RentalOrder> => {
    const { data } = await apiClient.patch<RentalOrder>(
      `/rental-orders/${id}/return`,
      request
    );
    return data;
  },

  cancel: async (id: string, request: CancelRentalOrderRequest): Promise<RentalOrder> => {
    const { data } = await apiClient.patch<RentalOrder>(
      `/rental-orders/${id}/cancel`,
      request
    );
    return data;
  },

  markAsPaid: async (id: string): Promise<RentalOrder> => {
    const { data } = await apiClient.patch<RentalOrder>(`/rental-orders/${id}/mark-paid`);
    return data;
  },
};
