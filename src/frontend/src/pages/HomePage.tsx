import { Ghost } from 'lucide-react';
import { StoryCard } from '../components/StoryCard';
import { AdSlotPlaceholder } from '../components/AdSlotPlaceholder';
import { useLatestStories } from '../hooks/useStories';

export function HomePage() {
  const { data: stories = [], isLoading } = useLatestStories(20);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-12 mb-12">
        <div className="flex items-center justify-center gap-4 mb-6">
          <Ghost className="h-16 w-16 text-destructive animate-pulse" />
          <h1 className="text-5xl md:text-7xl font-creepster text-destructive tracking-wider">
            Darr Ka Samna
          </h1>
          <Ghost className="h-16 w-16 text-destructive animate-pulse" />
        </div>
        <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
          Dive into the darkness. Experience spine-chilling horror stories that will haunt your dreams.
        </p>
      </section>

      {/* Ad Slot */}
      <AdSlotPlaceholder className="mb-12" />

      {/* Latest Stories */}
      <section className="mb-12">
        <h2 className="text-3xl font-creepster text-destructive mb-8 flex items-center gap-3">
          <span className="h-1 w-12 bg-destructive"></span>
          Latest Horror Stories
          <span className="h-1 flex-1 bg-destructive/20"></span>
        </h2>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-destructive border-t-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading stories...</p>
          </div>
        ) : stories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <StoryCard key={story.id.toString()} story={story} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card/30 rounded-lg border border-dashed border-border">
            <Ghost className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">No stories yet</p>
            <p className="text-sm text-muted-foreground/70 mt-2">
              The darkness awaits its first tale...
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
