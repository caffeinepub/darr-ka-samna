import { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetLogo, useUploadLogo, useDeleteLogo, createLogoUrl } from '../hooks/useLogo';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Upload, Trash2, Image as ImageIcon, LogIn, Loader2, BookPlus } from 'lucide-react';

export function AdminLogoPage() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const { data: logo, isLoading: logoLoading } = useGetLogo();
  const uploadMutation = useUploadLogo();
  const deleteMutation = useDeleteLogo();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isAuthenticated = !!identity;

  // Create logo URL for display
  const logoUrl = createLogoUrl(logo || null);

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
    setSuccess(null);

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

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);

      await uploadMutation.mutateAsync({
        data,
        contentType: selectedFile.type,
      });

      setSuccess('Logo uploaded successfully!');
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      
      // Reset file input
      const fileInput = document.getElementById('logo-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to upload logo';
      if (errorMessage.includes('Unauthorized') || errorMessage.includes('admin')) {
        setError('You do not have permission to upload the logo. Admin access required.');
      } else {
        setError(errorMessage);
      }
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete the site logo?')) {
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      await deleteMutation.mutateAsync();
      setSuccess('Logo deleted successfully!');
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete logo';
      if (errorMessage.includes('Unauthorized') || errorMessage.includes('admin')) {
        setError('You do not have permission to delete the logo. Admin access required.');
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
            <CardDescription>Please sign in to manage the site logo</CardDescription>
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-creepster text-destructive mb-2">Admin Settings</h1>
            <p className="text-muted-foreground">
              Manage your site logo and content
            </p>
          </div>
          <Link to="/admin/story/new">
            <Button className="w-full sm:w-auto bg-destructive hover:bg-destructive/90">
              <BookPlus className="mr-2 h-4 w-4" />
              Add Story
            </Button>
          </Link>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-500/50 bg-green-500/10">
            <AlertDescription className="text-green-600 dark:text-green-400">
              {success}
            </AlertDescription>
          </Alert>
        )}

        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="text-xl font-creepster flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Site Logo
            </CardTitle>
            <CardDescription>Upload or update your site logo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Logo */}
            {logoLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-destructive" />
              </div>
            ) : logoUrl ? (
              <div className="space-y-4">
                <Label>Current Logo</Label>
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <img
                    src={logoUrl}
                    alt="Site logo"
                    className="max-w-full sm:max-w-xs h-auto rounded-lg border border-destructive/20"
                  />
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                    className="w-full sm:w-auto"
                  >
                    {deleteMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove Logo
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No logo uploaded yet</p>
            )}

            {/* Upload New Logo */}
            <div className="space-y-4">
              <Label htmlFor="logo-upload">Upload New Logo</Label>
              <Input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploadMutation.isPending}
                className="w-full border-destructive/20 focus:border-destructive"
              />
              <p className="text-xs text-muted-foreground">
                Upload an image file (max 2MB). Supported formats: JPG, PNG, GIF, WebP
              </p>

              {previewUrl && (
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <img
                    src={previewUrl}
                    alt="Logo preview"
                    className="max-w-full sm:max-w-xs h-auto rounded-lg border border-destructive/20"
                  />
                </div>
              )}

              <Button
                onClick={handleUpload}
                disabled={!selectedFile || uploadMutation.isPending}
                className="w-full sm:w-auto bg-destructive hover:bg-destructive/90"
              >
                {uploadMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Logo
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
