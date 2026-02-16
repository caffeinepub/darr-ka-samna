import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetLogo, useUploadLogo, useDeleteLogo, createLogoUrl } from '../hooks/useLogo';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Upload, Trash2, Image as ImageIcon, LogIn, Loader2 } from 'lucide-react';

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
  const logoUrl = createLogoUrl(logo || null);

  // Clean up preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Clean up logo URL on unmount
  useEffect(() => {
    return () => {
      if (logoUrl) {
        URL.revokeObjectURL(logoUrl);
      }
    };
  }, [logoUrl]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (PNG, JPEG, or SVG)');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('File size must be less than 2MB');
      return;
    }

    setSelectedFile(file);

    // Create preview
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setError(null);
    setSuccess(null);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      await uploadMutation.mutateAsync({
        data: uint8Array,
        contentType: selectedFile.type,
      });

      setSuccess('Logo uploaded successfully!');
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload logo. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to remove the site logo?')) return;

    setError(null);
    setSuccess(null);

    try {
      await deleteMutation.mutateAsync();
      setSuccess('Logo removed successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to remove logo. Please try again.');
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
        <h1 className="text-4xl font-creepster text-destructive mb-2">Site Logo Management</h1>
        <p className="text-muted-foreground mb-8">
          Upload or remove the site logo that appears in the header
        </p>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-500/50 bg-green-500/10">
            <AlertDescription className="text-green-600 dark:text-green-400">{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6">
          {/* Current Logo */}
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="text-xl font-creepster">Current Logo</CardTitle>
              <CardDescription>The logo currently displayed on your site</CardDescription>
            </CardHeader>
            <CardContent>
              {logoLoading ? (
                <div className="flex items-center justify-center h-32 bg-muted/30 rounded-lg">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : logoUrl ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center bg-muted/30 rounded-lg p-8">
                    <img
                      src={logoUrl}
                      alt="Current site logo"
                      className="max-h-32 max-w-full object-contain"
                    />
                  </div>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                    className="w-full"
                  >
                    {deleteMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Removing...
                      </>
                    ) : (
                      <>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove Logo
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 bg-muted/30 rounded-lg text-muted-foreground">
                  <ImageIcon className="h-12 w-12 mb-2 opacity-50" />
                  <p className="text-sm">No logo uploaded</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upload New Logo */}
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="text-xl font-creepster">Upload New Logo</CardTitle>
              <CardDescription>
                Select a PNG, JPEG, or SVG file (max 2MB). This will replace the current logo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logo-upload">Select Image File</Label>
                <Input
                  id="logo-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                  onChange={handleFileSelect}
                  className="cursor-pointer"
                />
              </div>

              {previewUrl && (
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <div className="flex items-center justify-center bg-muted/30 rounded-lg p-8">
                    <img
                      src={previewUrl}
                      alt="Logo preview"
                      className="max-h-32 max-w-full object-contain"
                    />
                  </div>
                </div>
              )}

              <Button
                onClick={handleUpload}
                disabled={!selectedFile || uploadMutation.isPending}
                className="w-full bg-destructive hover:bg-destructive/90"
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
