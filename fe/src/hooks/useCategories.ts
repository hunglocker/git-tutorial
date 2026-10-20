import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryApi } from '@/api';
import { queryKeys } from './queryKeys';
import type { CreateCategoryRequest, UpdateCategoryRequest } from '@/types';

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: categoryApi.getAll,
  });
}

export function useActiveCategories() {
  return useQuery({
    queryKey: queryKeys.categories.active,
    queryFn: categoryApi.getActive,
  });
}

export function useCategoryById(id: string) {
  return useQuery({
    queryKey: queryKeys.categories.detail(id),
    queryFn: () => categoryApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateCategoryRequest) => categoryApi.create(request),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.categories.active });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: UpdateCategoryRequest }) =>
      categoryApi.update(id, request),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.categories.active });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.categories.detail(variables.id),
      });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoryApi.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.categories.active });
    },
  });
}
