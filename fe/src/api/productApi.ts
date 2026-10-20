import { apiClient } from './client';
import type { Product, ProductStatus, CreateProductRequest, UpdateProductRequest } from '@/types';

export const productApi = {
  getAll: async (): Promise<Product[]> => {
    const { data } = await apiClient.get<Product[]>('/products');
    return data;
  },

  getAvailable: async (): Promise<Product[]> => {
    const { data } = await apiClient.get<Product[]>('/products/available');
    return data;
  },

  getByCategory: async (categoryId: string): Promise<Product[]> => {
    const { data } = await apiClient.get<Product[]>(`/products/by-category/${categoryId}`);
    return data;
  },

  getByStatus: async (status: ProductStatus): Promise<Product[]> => {
    const { data } = await apiClient.get<Product[]>(`/products/by-status/${status}`);
    return data;
  },

  getById: async (id: string): Promise<Product> => {
    const { data } = await apiClient.get<Product>(`/products/${id}`);
    return data;
  },

  create: async (request: CreateProductRequest): Promise<Product> => {
    const { data } = await apiClient.post<Product>('/products', request);
    return data;
  },

  update: async (id: string, request: UpdateProductRequest): Promise<Product> => {
    const { data } = await apiClient.put<Product>(`/products/${id}`, request);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },
};
