import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useCreateStory } from '../hooks/useStories';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { LogIn, Loader2, BookPlus, CheckCircle } from 'lucide-react';
import { categories } from '../lib/categories';
import type { StoryCategory } from '../backend';

export function AdminStoryNewPage() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const createMutation = useCreateStory();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<StoryCategory | ''>('');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isAuthenticated = !!identity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!title.trim()) {
      setError('Please enter a story title');
      return;
    }

    if (!category) {
      setError('Please select a category');
      return;
    }

    if (!content.trim()) {
      setError('Please enter the story content');
      return;
    }

    try {
      // Generate excerpt from first 150 characters of content
      const excerpt = content.trim().substring(0, 150) + (content.trim().length > 150 ? '...' : '');

      await createMutation.mutateAsync({
        title: title.trim(),
        excerpt,
        content: content.trim(),
        category,
      });

      setSuccess('Story created successfully!');
      
      // Reset form
      setTitle('');
      setCategory('');
      setContent('');

      // Navigate to home after a short delay
      setTimeout(() => {
        navigate({ to: '/' });
      }, 1500);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create story. Please try again.';
      if (errorMessage.includes('Unauthorized') || errorMessage.includes('admin')) {
        setError('You do not have permission to create stories. Admin access required.');
      } else {
        setError(errorMessage);
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto border-destructive/20">
          <CardHeader>
            <CardTitle className="text-2xl font-creepster text-destructive">Admin Access Required</CardTitle>
            <CardDescription>Please sign in to create horror stories</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={login}
              disabled={isLoggingIn}
              className="w-full bg-destructive hover:bg-destructive/90"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-creepster text-destructive mb-2">Create Horror Story</h1>
        <p className="text-muted-foreground mb-8">
          Share a spine-chilling tale that will haunt your readers
        </p>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-500/50 bg-green-500/10">
            <AlertDescription className="text-green-600 dark:text-green-400 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              {success}
            </AlertDescription>
          </Alert>
        )}

        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="text-xl font-creepster flex items-center gap-2">
              <BookPlus className="h-5 w-5" />
              Story Details
            </CardTitle>
            <CardDescription>Fill in the details for your horror story</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter story title (Hindi/English supported)"
                  className="border-destructive/20 focus:border-destructive"
                  disabled={createMutation.isPending}
                  maxLength={200}
                />
                <p className="text-xs text-muted-foreground">
                  {title.length}/200 characters
                </p>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-base">
                  Category <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={category}
                  onValueChange={(value) => setCategory(value as StoryCategory)}
                  disabled={createMutation.isPending}
                >
                  <SelectTrigger className="border-destructive/20 focus:border-destructive">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {category && (
                  <p className="text-xs text-muted-foreground">
                    {categories.find((c) => c.value === category)?.description}
                  </p>
                )}
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content" className="text-base">
                  Full Story <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your horror story here... (Hindi/English supported)"
                  className="min-h-[300px] border-destructive/20 focus:border-destructive resize-y"
                  disabled={createMutation.isPending}
                />
                <p className="text-xs text-muted-foreground">
                  {content.length} characters
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex-1 bg-destructive hover:bg-destructive/90"
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Story...
                    </>
                  ) : (
                    <>
                      <BookPlus className="mr-2 h-4 w-4" />
                      Create Story
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate({ to: '/' })}
                  disabled={createMutation.isPending}
                  className="border-destructive/30 hover:bg-destructive/10"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
