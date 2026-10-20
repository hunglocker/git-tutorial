import { apiClient } from './client';
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from '@/types';

export const categoryApi = {
  getAll: async (): Promise<Category[]> => {
    const { data } = await apiClient.get<Category[]>('/categories');
    return data;
  },

  getActive: async (): Promise<Category[]> => {
    const { data } = await apiClient.get<Category[]>('/categories/active');
    return data;
  },

  getById: async (id: string): Promise<Category> => {
    const { data } = await apiClient.get<Category>(`/categories/${id}`);
    return data;
  },

  create: async (request: CreateCategoryRequest): Promise<Category> => {
    const { data } = await apiClient.post<Category>('/categories', request);
    return data;
  },

  update: async (id: string, request: UpdateCategoryRequest): Promise<Category> => {
    const { data } = await apiClient.put<Category>(`/categories/${id}`, request);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/categories/${id}`);
  },
};
