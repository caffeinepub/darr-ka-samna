import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Logo } from '../backend';

export function useGetLogo() {
  const { actor, isFetching } = useActor();

  return useQuery<Logo | null>({
    queryKey: ['logo'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getLogo();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUploadLogo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data, contentType }: { data: Uint8Array; contentType: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.uploadLogo(data, contentType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logo'] });
    },
  });
}

export function useDeleteLogo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.deleteLogo();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logo'] });
    },
  });
}

// Helper function to convert Logo to displayable URL
export function createLogoUrl(logo: Logo | null): string | null {
  if (!logo) return null;
  
  try {
    // Convert to standard Uint8Array to ensure compatibility with Blob constructor
    const uint8Array = new Uint8Array(logo.data);
    const blob = new Blob([uint8Array], { type: logo.contentType });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error creating logo URL:', error);
    return null;
  }
}
