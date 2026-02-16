import { useState, useEffect } from 'react';
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
import { LogIn, Loader2, BookPlus, CheckCircle, Upload, X, Image as ImageIcon, Video } from 'lucide-react';
import { categories } from '../lib/categories';
import { isValidYouTubeUrl, getYouTubeEmbedUrl } from '../utils/youtube';
import type { StoryCategory } from '../backend';

export function AdminStoryNewPage() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const createMutation = useCreateStory();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<StoryCategory | ''>('');
  const [content, setContent] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [youtubeError, setYoutubeError] = useState<string | null>(null);

  const isAuthenticated = !!identity;

  // Cleanup preview URL on unmount or file change
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (!file) {
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (2MB max)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('Image size must be less than 2MB');
      return;
    }

    setSelectedFile(file);
    
    // Create preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    const newPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(newPreviewUrl);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    // Reset file input
    const fileInput = document.getElementById('thumbnail') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleYoutubeUrlChange = (value: string) => {
    setYoutubeUrl(value);
    setYoutubeError(null);
    
    if (value.trim() && !isValidYouTubeUrl(value)) {
      setYoutubeError('Please enter a valid YouTube URL (e.g., https://www.youtube.com/watch?v=... or https://youtu.be/...)');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setYoutubeError(null);

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

    // Validate YouTube URL if provided
    if (youtubeUrl.trim() && !isValidYouTubeUrl(youtubeUrl)) {
      setYoutubeError('Please enter a valid YouTube URL');
      return;
    }

    try {
      // Generate excerpt from first 150 characters of content
      const excerpt = content.trim().substring(0, 150) + (content.trim().length > 150 ? '...' : '');

      // Prepare thumbnail data if file is selected
      let thumbnailData: { data: Uint8Array; contentType: string } | null = null;
      if (selectedFile) {
        const arrayBuffer = await selectedFile.arrayBuffer();
        thumbnailData = {
          data: new Uint8Array(arrayBuffer),
          contentType: selectedFile.type,
        };
      }

      await createMutation.mutateAsync({
        title: title.trim(),
        excerpt,
        content: content.trim(),
        category,
        youtubeUrl: youtubeUrl.trim() || null,
        thumbnail: thumbnailData,
      });

      setSuccess('Story created successfully!');
      
      // Reset form
      setTitle('');
      setCategory('');
      setContent('');
      setYoutubeUrl('');
      handleRemoveFile();

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

  const youtubeEmbedUrl = youtubeUrl.trim() && isValidYouTubeUrl(youtubeUrl) 
    ? getYouTubeEmbedUrl(youtubeUrl) 
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-creepster text-destructive mb-2">Create Horror Story</h1>
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
                  className="w-full border-destructive/20 focus:border-destructive"
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
                  <SelectTrigger className="w-full border-destructive/20 focus:border-destructive">
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

              {/* Thumbnail Upload */}
              <div className="space-y-2">
                <Label htmlFor="thumbnail" className="text-base flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Thumbnail Image (Optional)
                </Label>
                <div className="space-y-3">
                  <Input
                    id="thumbnail"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={createMutation.isPending}
                    className="w-full border-destructive/20 focus:border-destructive"
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload an image (max 2MB). Supported formats: JPG, PNG, GIF, WebP
                  </p>
                  
                  {previewUrl && (
                    <div className="relative w-full max-w-md">
                      <img
                        src={previewUrl}
                        alt="Thumbnail preview"
                        className="w-full h-auto rounded-lg border border-destructive/20"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={handleRemoveFile}
                        disabled={createMutation.isPending}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* YouTube URL */}
              <div className="space-y-2">
                <Label htmlFor="youtubeUrl" className="text-base flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  YouTube Video URL (Optional)
                </Label>
                <Input
                  id="youtubeUrl"
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => handleYoutubeUrlChange(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  className="w-full border-destructive/20 focus:border-destructive"
                  disabled={createMutation.isPending}
                />
                {youtubeError && (
                  <p className="text-xs text-destructive">{youtubeError}</p>
                )}
                {youtubeEmbedUrl && (
                  <div className="w-full aspect-video rounded-lg overflow-hidden border border-destructive/20">
                    <iframe
                      src={youtubeEmbedUrl}
                      title="YouTube video preview"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
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
                  className="min-h-[300px] w-full border-destructive/20 focus:border-destructive resize-y"
                  disabled={createMutation.isPending}
                />
                <p className="text-xs text-muted-foreground">
                  {content.length} characters
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
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
