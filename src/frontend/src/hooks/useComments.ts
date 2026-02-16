import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Comment } from '../backend';

export function useComments(storyId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<Comment[]>({
    queryKey: ['comments', storyId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getComments(storyId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddComment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      storyId,
      userId,
      content,
    }: {
      storyId: bigint;
      userId: string;
      content: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.addComment(storyId, userId, content);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['comments', variables.storyId.toString()],
      });
    },
  });
}
