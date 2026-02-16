import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useIncrementStoryView() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (storyId: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.incrementStoryViewCount(storyId);
    },
    onSuccess: (_, storyId) => {
      // Invalidate the specific story query to refresh view count
      queryClient.invalidateQueries({
        queryKey: ['story', storyId.toString()],
      });
    },
  });
}
