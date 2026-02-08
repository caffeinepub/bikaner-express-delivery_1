import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { DeliveryOrderInternal, OrderId, OrderStatus } from '../backend';
import { Principal } from '@dfinity/principal';

export function useGetAllOrders() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<DeliveryOrderInternal[]>({
    queryKey: ['allOrders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetOrdersByStatus(status: OrderStatus | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<DeliveryOrderInternal[]>({
    queryKey: ['ordersByStatus', status],
    queryFn: async () => {
      if (!actor || !status) return [];
      return actor.getOrdersByStatus(status);
    },
    enabled: !!actor && !actorFetching && !!status,
  });
}

export function useAssignRider() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, riderId }: { orderId: OrderId; riderId: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.assignRider(orderId, Principal.fromText(riderId));
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ['allOrders'] });
      queryClient.invalidateQueries({ queryKey: ['myOrders'] });
    },
  });
}
