import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerApi } from '@/api';
import { queryKeys } from './queryKeys';
import type { CreateCustomerRequest, UpdateCustomerRequest } from '@/types';

export function useCustomers() {
  return useQuery({
    queryKey: queryKeys.customers.all,
    queryFn: customerApi.getAll,
  });
}

export function useCustomerSearch(keyword: string) {
  return useQuery({
    queryKey: queryKeys.customers.search(keyword),
    queryFn: () => customerApi.search(keyword),
    enabled: keyword.trim().length > 0,
  });
}

export function useCustomerById(id: string) {
  return useQuery({
    queryKey: queryKeys.customers.detail(id),
    queryFn: () => customerApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateCustomerRequest) => customerApi.create(request),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: UpdateCustomerRequest }) =>
      customerApi.update(id, request),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.customers.detail(variables.id),
      });
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => customerApi.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
    },
  });
}
