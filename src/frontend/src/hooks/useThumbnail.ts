import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Logo } from '../backend';

/**
 * Fetch thumbnail for a specific story
 */
export function useGetThumbnail(storyId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<Logo | null>({
    queryKey: ['thumbnail', storyId.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getThumbnail(storyId);
    },
    enabled: !!actor && !isFetching,
  });
}

/**
 * Upload thumbnail for a story
 */
export function useUploadThumbnail() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      storyId, 
      data, 
      contentType 
    }: { 
      storyId: bigint; 
      data: Uint8Array; 
      contentType: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.uploadThumbnail(storyId, data, contentType);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['thumbnail', variables.storyId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['story', variables.storyId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['stories'] });
    },
  });
}

/**
 * Delete thumbnail for a story
 */
export function useDeleteThumbnail() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (storyId: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.deleteThumbnail(storyId);
    },
    onSuccess: (_, storyId) => {
      queryClient.invalidateQueries({ queryKey: ['thumbnail', storyId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['story', storyId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['stories'] });
    },
  });
}

/**
 * Helper function to convert Logo/Thumbnail to displayable URL
 */
export function createThumbnailUrl(thumbnail: Logo | null): string | null {
  if (!thumbnail) return null;
  
  try {
    // Convert to standard Uint8Array to ensure compatibility with Blob constructor
    const uint8Array = new Uint8Array(thumbnail.data);
    const blob = new Blob([uint8Array], { type: thumbnail.contentType });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error creating thumbnail URL:', error);
    return null;
  }
}
