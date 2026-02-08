import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { OrderId } from '../backend';

export function useUploadParcelPhoto() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, photo }: { orderId: OrderId; photo: Uint8Array }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadParcelPhoto(orderId, photo);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ['myOrders'] });
    },
  });
}

export function useUploadProofPhoto() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, photo }: { orderId: OrderId; photo: Uint8Array }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadProofPhoto(orderId, photo);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ['myOrders'] });
      queryClient.invalidateQueries({ queryKey: ['allOrders'] });
    },
  });
}
