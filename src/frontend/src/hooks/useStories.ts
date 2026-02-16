import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useUploadThumbnail } from './useThumbnail';
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

export function useCreateStory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const uploadThumbnail = useUploadThumbnail();

  return useMutation({
    mutationFn: async ({
      title,
      excerpt,
      content,
      category,
      youtubeUrl,
      thumbnail,
    }: {
      title: string;
      excerpt: string;
      content: string;
      category: StoryCategory;
      youtubeUrl?: string | null;
      thumbnail?: { data: Uint8Array; contentType: string } | null;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      
      // Create the story with optional YouTube URL
      const storyId = await actor.addStory(
        title, 
        excerpt, 
        content, 
        category, 
        youtubeUrl || null
      );

      // Upload thumbnail if provided
      if (thumbnail) {
        await uploadThumbnail.mutateAsync({
          storyId,
          data: thumbnail.data,
          contentType: thumbnail.contentType,
        });
      }

      return storyId;
    },
    onSuccess: () => {
      // Invalidate all story-related queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['stories'] });
    },
  });
}
