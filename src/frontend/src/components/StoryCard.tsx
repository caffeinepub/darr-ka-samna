import { Link } from '@tanstack/react-router';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock } from 'lucide-react';
import type { Story } from '../backend';
import { getCategoryLabel } from '../lib/categories';

interface StoryCardProps {
  story: Story;
}

export function StoryCard({ story }: StoryCardProps) {
  const categoryLabel = getCategoryLabel(story.category);
  const date = new Date(Number(story.timestamp) / 1000000);

  return (
    <Card className="group hover:border-destructive/50 transition-all duration-300 bg-card/50 backdrop-blur-sm hover:shadow-lg hover:shadow-destructive/10">
      <CardHeader>
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant="outline" className="border-destructive/50 text-destructive">
            {categoryLabel}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {date.toLocaleDateString()}
          </div>
        </div>
        <CardTitle className="text-xl font-creepster text-destructive group-hover:text-destructive/80 transition-colors">
          {story.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-foreground/70 line-clamp-3">
          {story.excerpt}
        </CardDescription>
      </CardContent>
      <CardFooter>
        <Link to="/story/$storyId" params={{ storyId: story.id.toString() }} className="w-full">
          <Button variant="outline" className="w-full border-destructive/30 hover:bg-destructive/10 group-hover:border-destructive">
            <BookOpen className="h-4 w-4 mr-2" />
            Read Story
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
