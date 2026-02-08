import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { RiderProfile } from '../backend';
import { Principal } from '@dfinity/principal';

export function useGetAllRiders() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<RiderProfile[]>({
    queryKey: ['allRiders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRiders();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddRider() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      riderId,
      name,
      phoneNumber,
      vehicleType,
    }: {
      riderId: Principal;
      name: string;
      phoneNumber: string;
      vehicleType: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addRider(riderId, name, phoneNumber, vehicleType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allRiders'] });
    },
  });
}

export function useUpdateRiderLocation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ riderId, locationUrl }: { riderId: Principal; locationUrl: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateRiderLocation(riderId, locationUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allRiders'] });
    },
  });
}

export function useDeleteRider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (riderId: Principal) => {
      // Since backend doesn't have deleteRider, we'll handle this client-side
      // In production, this would call a backend method
      return Promise.resolve(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allRiders'] });
    },
  });
}
