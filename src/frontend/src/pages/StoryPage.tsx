import { useParams, Link } from '@tanstack/react-router';
import { ArrowLeft, Clock, Tag } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { NightModeToggle } from '../components/NightModeToggle';
import { CommentsSection } from '../components/CommentsSection';
import { AdSlotPlaceholder } from '../components/AdSlotPlaceholder';
import { AffiliateLinksPlaceholder } from '../components/AffiliateLinksPlaceholder';
import { useStory } from '../hooks/useStories';
import { useNightMode } from '../hooks/useNightMode';
import { getCategoryLabel } from '../lib/categories';

export function StoryPage() {
  const { storyId } = useParams({ from: '/story/$storyId' });
  const { data: story, isLoading, error } = useStory(BigInt(storyId));
  const { nightMode } = useNightMode();

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
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Badge variant="outline" className="border-destructive/50 text-destructive">
                <Tag className="h-3 w-3 mr-1" />
                {categoryLabel}
              </Badge>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {date.toLocaleDateString()}
              </div>
              <div className="ml-auto">
                <NightModeToggle />
              </div>
            </div>

            <h1 className={`text-4xl md:text-5xl font-creepster mb-6 ${nightMode ? 'text-red-500' : 'text-destructive'} transition-colors duration-300`}>
              {story.title}
            </h1>

            <Separator className="mb-8 bg-border/50" />

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
