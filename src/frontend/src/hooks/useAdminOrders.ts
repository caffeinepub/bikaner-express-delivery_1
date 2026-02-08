import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { DeliveryOrderInternal, OrderId, OrderStatus, CreateOrderArgs, Variant_cash_online } from '../backend';
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

export function useAssignRiderToOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, riderId }: { orderId: OrderId; riderId: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.assignRiderToOrder(orderId, Principal.fromText(riderId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allOrders'] });
      queryClient.invalidateQueries({ queryKey: ['myOrders'] });
    },
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: OrderId; status: OrderStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateStatus({ orderId, status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allOrders'] });
      queryClient.invalidateQueries({ queryKey: ['myOrders'] });
    },
  });
}

export function useCreateAdminOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: {
      customerName: string;
      mobileNumber: string;
      pickupLocation: string;
      pickupAddress: string;
      dropLocation: string;
      deliveryAddress: string;
      parcelDescription: string;
      paymentType: Variant_cash_online;
    }) => {
      if (!actor) throw new Error('Actor not available');
      
      const orderArgs: CreateOrderArgs = {
        customerName: args.customerName,
        mobileNumber: args.mobileNumber,
        pickupLocation: args.pickupLocation,
        pickupAddress: args.pickupAddress,
        dropLocation: args.dropLocation,
        deliveryAddress: args.deliveryAddress,
        parcelDescription: args.parcelDescription,
        paymentType: args.paymentType,
        parcelPhoto: undefined,
      };
      
      return actor.createOrder(orderArgs);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allOrders'] });
    },
  });
}
