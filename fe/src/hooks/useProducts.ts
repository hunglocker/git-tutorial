import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi } from '@/api';
import { queryKeys } from './queryKeys';
import type { CreateProductRequest, UpdateProductRequest } from '@/types';

export function useProducts() {
  return useQuery({
    queryKey: queryKeys.products.all,
    queryFn: productApi.getAll,
  });
}

export function useAvailableProducts() {
  return useQuery({
    queryKey: queryKeys.products.available,
    queryFn: productApi.getAvailable,
  });
}

export function useProductById(id: string) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => productApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateProductRequest) => productApi.create(request),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.products.available });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: UpdateProductRequest }) =>
      productApi.update(id, request),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.products.available });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.products.detail(variables.id),
      });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productApi.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.products.available });
    },
  });
}
