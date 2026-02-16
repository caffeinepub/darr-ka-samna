import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useFollowerCount() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['followerCount'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getFollowerCount();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useFollowWebsite() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.followWebsite();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followerCount'] });
    },
  });
}
