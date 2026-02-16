import { useParams, Link } from '@tanstack/react-router';
import { useEffect, useState, useRef } from 'react';
import { ArrowLeft, Clock, Tag, Eye } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { NightModeToggle } from '../components/NightModeToggle';
import { CommentsSection } from '../components/CommentsSection';
import { AdSlotPlaceholder } from '../components/AdSlotPlaceholder';
import { AffiliateLinksPlaceholder } from '../components/AffiliateLinksPlaceholder';
import { useStory } from '../hooks/useStories';
import { useIncrementStoryView } from '../hooks/useStoryViews';
import { useGetThumbnail, createThumbnailUrl } from '../hooks/useThumbnail';
import { useNightMode } from '../hooks/useNightMode';
import { getCategoryLabel } from '../lib/categories';
import { getYouTubeEmbedUrl } from '../utils/youtube';

export function StoryPage() {
  const { storyId } = useParams({ from: '/story/$storyId' });
  const { data: story, isLoading, error } = useStory(BigInt(storyId));
  const { data: thumbnail } = useGetThumbnail(BigInt(storyId));
  const { nightMode } = useNightMode();
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const incrementViewMutation = useIncrementStoryView();
  const hasIncrementedView = useRef(false);

  // Increment view count once per page load
  useEffect(() => {
    if (story && !hasIncrementedView.current) {
      hasIncrementedView.current = true;
      incrementViewMutation.mutate(story.id);
    }
  }, [story, incrementViewMutation]);

  // Create and cleanup thumbnail URL
  useEffect(() => {
    const url = createThumbnailUrl(thumbnail || null);
    setThumbnailUrl(url);

    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [thumbnail]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-destructive border-t-transparent"></div>
        <p className="mt-4 text-muted-foreground">Loading story...</p>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-destructive text-lg mb-4">Story not found</p>
        <Link to="/">
          <Button variant="outline" className="border-destructive/30">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  const categoryLabel = getCategoryLabel(story.category);
  const date = new Date(Number(story.timestamp) / 1000000);
  const placeholderImage = '/assets/generated/story-thumbnail-placeholder.dim_800x450.png';
  const displayImage = thumbnailUrl || placeholderImage;
  const youtubeEmbedUrl = story.youtubeUrl ? getYouTubeEmbedUrl(story.youtubeUrl) : null;
  const viewCount = Number(story.viewCount);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link to="/" className="inline-block mb-6">
          <Button variant="ghost" className="text-foreground/80 hover:text-destructive">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Stories
          </Button>
        </Link>

        {/* Story Header */}
        <Card className={`mb-8 ${nightMode ? 'bg-black/90 border-destructive/30' : 'bg-card/50'} backdrop-blur-sm transition-colors duration-300`}>
          <CardContent className="pt-8">
            {/* Thumbnail */}
            <div className="relative w-full aspect-video overflow-hidden rounded-lg mb-6">
              <img
                src={displayImage}
                alt={story.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6">
              <Badge variant="outline" className="border-destructive/50 text-destructive">
                <Tag className="h-3 w-3 mr-1" />
                {categoryLabel}
              </Badge>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {date.toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Eye className="h-4 w-4" />
                <span>Total reads: {viewCount}</span>
              </div>
              <div className="ml-auto">
                <NightModeToggle />
              </div>
            </div>

            <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-creepster mb-6 ${nightMode ? 'text-red-500' : 'text-destructive'} transition-colors duration-300 break-words`}>
              {story.title}
            </h1>

            <Separator className="mb-8 bg-border/50" />

            {/* YouTube Video Embed */}
            {youtubeEmbedUrl && (
              <div className="mb-8">
                <div className="w-full aspect-video rounded-lg overflow-hidden border border-destructive/20">
                  <iframe
                    src={youtubeEmbedUrl}
                    title="Story video"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Story Content */}
            <div className={`prose prose-lg max-w-none ${nightMode ? 'prose-invert' : ''}`}>
              <div className={`whitespace-pre-wrap leading-relaxed ${nightMode ? 'text-gray-200' : 'text-foreground/90'} transition-colors duration-300`}>
                {story.content}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ad Slot */}
        <AdSlotPlaceholder className="mb-8" />

        {/* Affiliate Links */}
        <div className="mb-8">
          <AffiliateLinksPlaceholder />
        </div>

        {/* Comments Section */}
        <CommentsSection storyId={story.id} />
      </div>
    </div>
  );
}
