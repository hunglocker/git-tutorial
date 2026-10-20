import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rentalOrderApi } from '@/api';
import { queryKeys } from './queryKeys';
import type {
  CreateRentalOrderRequest,
  ReturnRentalOrderRequest,
  CancelRentalOrderRequest,
} from '@/types';

export function useRentalOrders() {
  return useQuery({
    queryKey: queryKeys.rentalOrders.all,
    queryFn: rentalOrderApi.getAll,
  });
}

export function useOverdueRentalOrders() {
  return useQuery({
    queryKey: queryKeys.rentalOrders.overdue,
    queryFn: rentalOrderApi.getOverdue,
  });
}

export function useRentalOrderById(id: string) {
  return useQuery({
    queryKey: queryKeys.rentalOrders.detail(id),
    queryFn: () => rentalOrderApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateRentalOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateRentalOrderRequest) => rentalOrderApi.create(request),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.rentalOrders.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.products.available });
    },
  });
}

export function useActivateRentalOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => rentalOrderApi.activate(id),
    onSuccess: (_data, id) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.rentalOrders.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.rentalOrders.detail(id) });
    },
  });
}

export function useReturnRentalOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: ReturnRentalOrderRequest }) =>
      rentalOrderApi.return(id, request),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.rentalOrders.all });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.rentalOrders.detail(variables.id),
      });
      void queryClient.invalidateQueries({ queryKey: queryKeys.products.available });
    },
  });
}

export function useCancelRentalOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: CancelRentalOrderRequest }) =>
      rentalOrderApi.cancel(id, request),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.rentalOrders.all });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.rentalOrders.detail(variables.id),
      });
      void queryClient.invalidateQueries({ queryKey: queryKeys.products.available });
    },
  });
}

export function useMarkAsPaidRentalOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => rentalOrderApi.markAsPaid(id),
    onSuccess: (_data, id) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.rentalOrders.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.rentalOrders.detail(id) });
    },
  });
}
