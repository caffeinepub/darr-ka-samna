import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

export function SearchBar({ onSearch, initialQuery = '' }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-2xl mx-auto">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Search horror stories..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pr-10 bg-card border-destructive/20 focus:border-destructive"
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="absolute right-0 top-0 h-full hover:bg-transparent"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Button type="submit" className="bg-destructive hover:bg-destructive/90">
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </form>
  );
}
