import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Story, StoryCategory } from '../backend';

export function useLatestStories(limit: number = 20) {
  const { actor, isFetching } = useActor();

  return useQuery<Story[]>({
    queryKey: ['stories', 'latest', limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLatestStories(BigInt(limit));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useStoriesByCategory(category: StoryCategory) {
  const { actor, isFetching } = useActor();

  return useQuery<Story[]>({
    queryKey: ['stories', 'category', category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStoriesByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useStory(id: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<Story>({
    queryKey: ['story', id.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getStory(id);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSearchStories(query: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Story[]>({
    queryKey: ['stories', 'search', query],
    queryFn: async () => {
      if (!actor || !query.trim()) return [];
      return actor.searchStories(query);
    },
    enabled: !!actor && !isFetching && !!query.trim(),
  });
}
