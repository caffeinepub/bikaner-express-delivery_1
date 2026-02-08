import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { CreateOrderArgs, DeliveryOrderInternal, OrderId } from '../backend';

export function useCreateOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: CreateOrderArgs) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createOrder(args);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myOrders'] });
      queryClient.invalidateQueries({ queryKey: ['allOrders'] });
    },
  });
}

export function useGetMyOrders() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<DeliveryOrderInternal[]>({
    queryKey: ['myOrders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyOrders();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetOrder(orderId: OrderId | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<DeliveryOrderInternal | null>({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!actor || !orderId) return null;
      return actor.getOrder(orderId);
    },
    enabled: !!actor && !actorFetching && !!orderId,
  });
}
