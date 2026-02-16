import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Heart, Loader2 } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useFollowerCount, useFollowWebsite } from '../hooks/useFollowWebsite';

export function FollowButton() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const { data: followerCount = BigInt(0), isLoading: countLoading } = useFollowerCount();
  const followMutation = useFollowWebsite();
  const [hasFollowed, setHasFollowed] = useState(false);

  const isAuthenticated = !!identity;
  const displayCount = Number(followerCount);

  const handleFollow = async () => {
    if (!isAuthenticated) {
      await login();
      return;
    }

    if (hasFollowed) return;

    try {
      await followMutation.mutateAsync();
      setHasFollowed(true);
    } catch (error) {
      console.error('Failed to follow:', error);
    }
  };

  const isLoading = isLoggingIn || followMutation.isPending;
  const buttonText = hasFollowed ? 'Following' : 'Follow';

  return (
    <div className="flex items-center gap-3">
      <Button
        onClick={handleFollow}
        disabled={isLoading || hasFollowed}
        variant={hasFollowed ? 'outline' : 'default'}
        className={
          hasFollowed
            ? 'border-destructive/50 text-destructive hover:bg-destructive/10'
            : 'bg-destructive hover:bg-destructive/90'
        }
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            {isLoggingIn ? 'Signing In...' : 'Following...'}
          </>
        ) : (
          <>
            <Heart className={`h-4 w-4 mr-2 ${hasFollowed ? 'fill-current' : ''}`} />
            {buttonText}
          </>
        )}
      </Button>
      {!countLoading && (
        <Badge variant="outline" className="border-destructive/30 text-foreground/80">
          {displayCount} {displayCount === 1 ? 'Follower' : 'Followers'}
        </Badge>
      )}
    </div>
  );
}
