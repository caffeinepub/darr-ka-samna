import { useSearch, Link } from '@tanstack/react-router';
import { ArrowLeft, Search as SearchIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { StoryCard } from '../components/StoryCard';
import { SearchBar } from '../components/SearchBar';
import { useSearchStories } from '../hooks/useStories';

export function SearchPage() {
  const searchParams = useSearch({ from: '/search' });
  const query = (searchParams as { q?: string }).q || '';
  const { data: stories = [], isLoading } = useSearchStories(query);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link to="/" className="inline-block mb-6">
        <Button variant="ghost" className="text-foreground/80 hover:text-destructive">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
      </Link>

      {/* Search Header */}
      <section className="mb-12">
        <h1 className="text-3xl md:text-4xl font-creepster text-destructive mb-6 text-center">
          Search Horror Stories
        </h1>
        <SearchBar onSearch={(q) => window.history.pushState({}, '', `/search?q=${encodeURIComponent(q)}`)} initialQuery={query} />
      </section>

      {/* Search Results */}
      <section>
        {!query ? (
          <div className="text-center py-12 bg-card/30 rounded-lg border border-dashed border-border">
            <SearchIcon className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">Type to search stories</p>
            <p className="text-sm text-muted-foreground/70 mt-2">
              Enter keywords to find horror stories
            </p>
          </div>
        ) : isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-destructive border-t-transparent"></div>
            <p className="mt-4 text-muted-foreground">Searching...</p>
          </div>
        ) : stories.length > 0 ? (
          <>
            <h2 className="text-xl font-creepster text-destructive mb-6">
              Found {stories.length} {stories.length === 1 ? 'story' : 'stories'} for "{query}"
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => (
                <StoryCard key={story.id.toString()} story={story} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12 bg-card/30 rounded-lg border border-dashed border-border">
            <SearchIcon className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">No stories found for "{query}"</p>
            <p className="text-sm text-muted-foreground/70 mt-2">
              Try different keywords or browse categories
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
