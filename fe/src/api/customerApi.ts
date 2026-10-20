import { apiClient } from './client';
import type { Customer, CreateCustomerRequest, UpdateCustomerRequest } from '@/types';

export const customerApi = {
  getAll: async (): Promise<Customer[]> => {
    const { data } = await apiClient.get<Customer[]>('/customers');
    return data;
  },

  search: async (keyword: string): Promise<Customer[]> => {
    const { data } = await apiClient.get<Customer[]>('/customers/search', {
      params: { keyword },
    });
    return data;
  },

  getById: async (id: string): Promise<Customer> => {
    const { data } = await apiClient.get<Customer>(`/customers/${id}`);
    return data;
  },

  create: async (request: CreateCustomerRequest): Promise<Customer> => {
    const { data } = await apiClient.post<Customer>('/customers', request);
    return data;
  },

  update: async (id: string, request: UpdateCustomerRequest): Promise<Customer> => {
    const { data } = await apiClient.put<Customer>(`/customers/${id}`, request);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/customers/${id}`);
  },
};
